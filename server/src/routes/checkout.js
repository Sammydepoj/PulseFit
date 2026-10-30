import { Router } from "express";
import { pool } from "../db.js";
import { stripe, clientUrl } from "../stripe.js";
import { requireUser } from "../session.js";

export const checkoutRouter = Router();

// Start paying for a membership plan. The browser sends only { planId }; the
// price always comes from our own plans table, never from the request.
checkoutRouter.post("/", requireUser, async (req, res) => {
    if (!stripe) {
        return res.status(503).json({ error: "Payments are not set up yet" });
    }

    const planId = Number(req.body?.planId);
    if (!Number.isInteger(planId)) {
        return res.status(400).json({ error: "planId must be a whole number" });
    }

    const { rows } = await pool.query(
        "SELECT id, name, price_cents FROM plans WHERE id = $1",
        [planId],
    );
    const plan = rows[0];
    if (!plan) return res.status(404).json({ error: "No such plan" });

    // The order and its line item are created together or not at all.
    const db = await pool.connect();
    let orderId;
    try {
        await db.query("BEGIN");
        const order = await db.query(
            "INSERT INTO orders (user_id, total_cents) VALUES ($1, $2) RETURNING id",
            [req.user.id, plan.price_cents],
        );
        orderId = order.rows[0].id;
        await db.query(
            `INSERT INTO order_items (order_id, plan_id, plan_name, unit_price_cents)
             VALUES ($1, $2, $3, $4)`,
            [orderId, plan.id, plan.name, plan.price_cents],
        );
        await db.query("COMMIT");
    } catch (err) {
        await db.query("ROLLBACK");
        throw err;
    } finally {
        db.release();
    }

    let session;
    try {
        session = await stripe.checkout.sessions.create(
            {
                mode: "payment",
                line_items: [
                    {
                        quantity: 1,
                        price_data: {
                            currency: "usd",
                            unit_amount: plan.price_cents,
                            product_data: { name: `PulseFit ${plan.name}` },
                        },
                    },
                ],
                client_reference_id: orderId,
                metadata: { order_id: orderId },
                customer_email: req.user.email,
                // Stripe's minimum is 30 minutes; an unpaid order then expires.
                expires_at: Math.floor(Date.now() / 1000) + 30 * 60,
                success_url: `${clientUrl}/checkout/success?order=${orderId}`,
                cancel_url: `${clientUrl}/#membership`,
            },
            { idempotencyKey: `order-${orderId}` },
        );
    } catch (err) {
        console.error("Stripe could not create the session:", err.message);
        await pool.query("UPDATE orders SET status = 'expired' WHERE id = $1", [
            orderId,
        ]);
        return res
            .status(502)
            .json({ error: "Couldn't start checkout. Try again." });
    }

    await pool.query("UPDATE orders SET stripe_session_id = $1 WHERE id = $2", [
        session.id,
        orderId,
    ]);
    res.status(201).json({ url: session.url, orderId });
});
