import { pool } from "../db.js";
import { stripe } from "../stripe.js";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// The only place an order becomes 'paid'. Stripe calls this after a payment;
// the signature check proves the call really came from Stripe. The success
// page the browser lands on never changes an order.
export async function stripeWebhook(req, res) {
    const secret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!stripe || !secret) {
        return res.status(503).json({ error: "Webhook is not configured" });
    }

    let event;
    try {
        // req.body is the raw bytes (see express.raw in index.js); parsing it
        // first would change them and break the signature.
        event = stripe.webhooks.constructEvent(
            req.body,
            req.headers["stripe-signature"],
            secret,
        );
    } catch (err) {
        console.warn("Rejected webhook:", err.message);
        return res.status(400).json({ error: "Invalid signature" });
    }

    const session = event.data.object;
    switch (event.type) {
        case "checkout.session.completed":
        case "checkout.session.async_payment_succeeded":
            // "completed" can fire before money has moved (delayed methods).
            if (session.payment_status === "paid") await markPaid(session);
            break;
        case "checkout.session.expired":
            await pool.query(
                "UPDATE orders SET status = 'expired' WHERE stripe_session_id = $1 AND status = 'pending'",
                [session.id],
            );
            break;
    }

    // Any 2xx tells Stripe we got it; events we don't care about are fine too.
    res.json({ received: true });
}

async function markPaid(session) {
    const orderId = session.metadata?.order_id;
    if (!UUID.test(orderId ?? "")) {
        console.warn("Paid session without a valid order id:", session.id);
        return;
    }
    // Only a pending order, with this exact session and the amount we expected,
    // can be marked paid. Stripe retries events, so repeats change nothing.
    const { rowCount } = await pool.query(
        `UPDATE orders
            SET status = 'paid', paid_at = now(), stripe_payment_intent_id = $3
          WHERE id = $1 AND stripe_session_id = $2
            AND total_cents = $4 AND status = 'pending'`,
        [orderId, session.id, session.payment_intent, session.amount_total],
    );
    if (rowCount === 0) {
        console.warn(
            `Order ${orderId} not marked paid (unknown, already handled or amount mismatch).`,
        );
    }
}
