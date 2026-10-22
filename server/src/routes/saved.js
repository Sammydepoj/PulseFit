import { Router } from "express";
import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../auth.js";
import { pool } from "../db.js";

export const savedRouter = Router();

async function requireUser(req, res, next) {
    const session = await auth.api.getSession({
        headers: fromNodeHeaders(req.headers),
    });
    if (!session) return res.status(401).json({ error: "Sign in first" });
    req.user = session.user;
    next();
}

savedRouter.use(requireUser);

// Class ids the signed-in user has saved.
savedRouter.get("/", async (req, res) => {
    const { rows } = await pool.query(
        "SELECT class_id FROM saved_classes WHERE user_id = $1 ORDER BY class_id",
        [req.user.id],
    );
    res.json(rows.map((r) => r.class_id));
});

// Save several at once (used to merge what a guest saved before signing in).
savedRouter.post("/", async (req, res) => {
    const ids = req.body?.classIds;
    if (!Array.isArray(ids) || !ids.every(Number.isInteger)) {
        return res.status(400).json({ error: "classIds must be an array of integers" });
    }
    await pool.query(
        `INSERT INTO saved_classes (user_id, class_id)
         SELECT $1, c.id FROM classes c WHERE c.id = ANY($2::int[])
         ON CONFLICT DO NOTHING`,
        [req.user.id, ids],
    );
    res.status(204).end();
});

savedRouter.put("/:classId", async (req, res) => {
    const classId = Number(req.params.classId);
    const { rowCount } = await pool.query(
        `INSERT INTO saved_classes (user_id, class_id)
         SELECT $1, id FROM classes WHERE id = $2
         ON CONFLICT DO NOTHING`,
        [req.user.id, classId],
    );
    if (rowCount === 0) {
        const exists = await pool.query("SELECT 1 FROM classes WHERE id = $1", [classId]);
        if (exists.rowCount === 0) return res.status(404).json({ error: "No such class" });
    }
    res.status(204).end();
});

savedRouter.delete("/:classId", async (req, res) => {
    await pool.query(
        "DELETE FROM saved_classes WHERE user_id = $1 AND class_id = $2",
        [req.user.id, Number(req.params.classId)],
    );
    res.status(204).end();
});
