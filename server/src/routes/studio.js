import { Router } from "express";
import { pool } from "../db.js";

export const studioRouter = Router();

// Express 5 forwards rejected promises to the error handler, so no try/catch here.

studioRouter.get("/classes", async (_req, res) => {
    // The UI shows the coach's first name only.
    const { rows } = await pool.query(
        `SELECT c.id, c.day, c.period, c.time, c.name, c.level,
                split_part(co.name, ' ', 1) AS coach
           FROM classes c
           JOIN coaches co ON co.id = c.coach_id
          ORDER BY c.id`,
    );
    res.json(rows);
});

studioRouter.get("/coaches", async (_req, res) => {
    const { rows } = await pool.query(
        `SELECT id, name, initials, specialty, bio, quote, image,
                image_alt AS "imageAlt", credit
           FROM coaches
          ORDER BY id`,
    );
    res.json(rows);
});

studioRouter.get("/plans", async (_req, res) => {
    const { rows } = await pool.query(
        `SELECT id, name, price_cents AS "priceCents", per, note, perks, cta, featured
           FROM plans
          ORDER BY position`,
    );
    res.json(rows);
});
