import { Router } from "express";
import { pool } from "../db.js";
import { DUMMY_HASH, hashPassword, verifyPassword } from "../password.js";
import { endSession, startSession } from "../session.js";

export const authRouter = Router();

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Failed logins per email in the last 15 minutes. In memory, so it resets when
// the server restarts; enough to slow down password guessing.
const MAX_FAILURES = 10;
const WINDOW_MS = 15 * 60 * 1000;
const failures = new Map();

function tooManyFailures(email) {
    const recent = (failures.get(email) ?? []).filter((t) => Date.now() - t < WINDOW_MS);
    failures.set(email, recent);
    return recent.length >= MAX_FAILURES;
}

const publicUser = ({ id, name, email }) => ({ id, name, email });

authRouter.post("/signup", async (req, res) => {
    const name = String(req.body?.name ?? "").trim();
    const email = String(req.body?.email ?? "").trim().toLowerCase();
    const password = String(req.body?.password ?? "");

    if (!name || name.length > 100) {
        return res.status(400).json({ error: "Enter your name" });
    }
    if (!EMAIL.test(email) || email.length > 254) {
        return res.status(400).json({ error: "Enter a valid email address" });
    }
    // The upper bound stops someone sending a megabyte "password" to burn CPU hashing it.
    if (password.length < 8 || password.length > 128) {
        return res.status(400).json({ error: "Password must be 8 to 128 characters" });
    }

    const passwordHash = await hashPassword(password);
    // The UNIQUE index on email decides races; no check-then-insert gap.
    const { rows } = await pool.query(
        `INSERT INTO users (name, email, password_hash)
         VALUES ($1, $2, $3)
         ON CONFLICT (email) DO NOTHING
         RETURNING id, name, email`,
        [name, email, passwordHash],
    );
    if (rows.length === 0) {
        return res.status(409).json({ error: "An account with that email already exists" });
    }

    await startSession(res, rows[0].id);
    res.status(201).json({ user: publicUser(rows[0]) });
});

authRouter.post("/login", async (req, res) => {
    const email = String(req.body?.email ?? "").trim().toLowerCase();
    const password = String(req.body?.password ?? "");

    if (tooManyFailures(email)) {
        return res.status(429).json({ error: "Too many attempts. Try again in a few minutes." });
    }

    const { rows } = await pool.query(
        "SELECT id, name, email, password_hash FROM users WHERE email = $1",
        [email],
    );
    const user = rows[0];
    // Always run one hash comparison, whether or not the account exists.
    const ok =
        password.length <= 128 &&
        (await verifyPassword(password, user?.password_hash ?? DUMMY_HASH)) &&
        Boolean(user);

    if (!ok) {
        failures.get(email).push(Date.now());
        return res.status(401).json({ error: "Incorrect email or password" });
    }

    failures.delete(email);
    await pool.query("DELETE FROM sessions WHERE expires_at < now()");
    await startSession(res, user.id);
    res.json({ user: publicUser(user) });
});

authRouter.post("/logout", async (req, res) => {
    await endSession(req, res);
    res.status(204).end();
});

// Who is signed in? Lets the page restore its state after a refresh.
authRouter.get("/me", (req, res) => {
    res.json({ user: req.user });
});
