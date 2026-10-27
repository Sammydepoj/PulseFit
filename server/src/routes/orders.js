import { Router } from "express";
import { pool } from "../db.js";
import { requireUser } from "../session.js";

export const ordersRouter = Router();

ordersRouter.use(requireUser);

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// One of the signed-in user's own orders. Someone else's order id looks the
// same as one that doesn't exist (404), so ids can't be probed.
ordersRouter.get("/:id", async (req, res) => {
    if (!UUID.test(req.params.id)) {
        return res.status(404).json({ error: "No such order" });
    }

    const { rows } = await pool.query(
        `SELECT id, status, total_cents AS "totalCents", currency,
                created_at AS "createdAt", paid_at AS "paidAt"
           FROM orders
          WHERE id = $1 AND user_id = $2`,
        [req.params.id, req.user.id],
    );
    if (rows.length === 0) {
        return res.status(404).json({ error: "No such order" });
    }

    const items = await pool.query(
        `SELECT plan_id AS "planId", plan_name AS "planName",
                unit_price_cents AS "unitPriceCents", quantity
           FROM order_items
          WHERE order_id = $1
          ORDER BY id`,
        [req.params.id],
    );
    res.json({ ...rows[0], items: items.rows });
});
