import { createHash, randomBytes } from "node:crypto";
import { pool } from "./db.js";

const COOKIE = "pulsefit_session";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

// Only the hash of the token is stored, so a leaked database can't be used to sign in.
const hashToken = (token) => createHash("sha256").update(token).digest("hex");

const secure = process.env.CLIENT_URL?.startsWith("https") ?? false;

function readCookie(req, name) {
    const header = req.headers.cookie;
    if (!header) return null;
    for (const part of header.split(";")) {
        const [key, ...rest] = part.trim().split("=");
        if (key === name) return decodeURIComponent(rest.join("="));
    }
    return null;
}

function cookieString(value, maxAge) {
    return [
        `${COOKIE}=${encodeURIComponent(value)}`,
        "Path=/",
        "HttpOnly",
        "SameSite=Lax",
        `Max-Age=${maxAge}`,
        secure && "Secure",
    ]
        .filter(Boolean)
        .join("; ");
}

export async function startSession(res, userId) {
    const token = randomBytes(32).toString("base64url");
    await pool.query(
        `INSERT INTO sessions (token_hash, user_id, expires_at)
         VALUES ($1, $2, now() + make_interval(secs => $3))`,
        [hashToken(token), userId, MAX_AGE_SECONDS],
    );
    res.setHeader("Set-Cookie", cookieString(token, MAX_AGE_SECONDS));
}

export async function endSession(req, res) {
    const token = readCookie(req, COOKIE);
    if (token) {
        await pool.query("DELETE FROM sessions WHERE token_hash = $1", [hashToken(token)]);
    }
    res.setHeader("Set-Cookie", cookieString("", 0));
}

// Sets req.user to { id, name, email } if the cookie holds a live session, else null.
export async function loadUser(req, _res, next) {
    req.user = null;
    const token = readCookie(req, COOKIE);
    if (token) {
        const { rows } = await pool.query(
            `SELECT u.id, u.name, u.email
               FROM sessions s
               JOIN users u ON u.id = s.user_id
              WHERE s.token_hash = $1 AND s.expires_at > now()`,
            [hashToken(token)],
        );
        req.user = rows[0] ?? null;
    }
    next();
}

export function requireUser(req, res, next) {
    if (!req.user) return res.status(401).json({ error: "Sign in first" });
    next();
}
