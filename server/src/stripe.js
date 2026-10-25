import "dotenv/config";
import Stripe from "stripe";

const key = process.env.STRIPE_SECRET_KEY;

if (!key) {
    console.warn("STRIPE_SECRET_KEY is not set: checkout is disabled until it is.");
} else if (!key.startsWith("sk_test_") && process.env.NODE_ENV !== "production") {
    // Stops a live key being used by accident while developing.
    throw new Error("STRIPE_SECRET_KEY is not a test key (sk_test_...).");
}

export const stripe = key ? new Stripe(key) : null;

// Frontend base URL Stripe sends people back to (first entry of CLIENT_URL).
export const clientUrl = process.env.CLIENT_URL?.split(",")[0].trim();
