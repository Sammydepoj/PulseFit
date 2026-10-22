import "dotenv/config";
import { betterAuth } from "better-auth";
import { pool } from "./db.js";

for (const key of ["BETTER_AUTH_SECRET", "BETTER_AUTH_URL", "CLIENT_URL"]) {
    if (!process.env[key]) throw new Error(`${key} is not set. See .env.example.`);
}

export const auth = betterAuth({
    // Better Auth talks to Postgres through the same pool as the rest of the app.
    database: pool,
    secret: process.env.BETTER_AUTH_SECRET,
    baseURL: process.env.BETTER_AUTH_URL,
    // Requests from these origins (the deployed frontend) are allowed to sign in.
    trustedOrigins: process.env.CLIENT_URL.split(",").map((s) => s.trim()),
    emailAndPassword: {
        enabled: true,
        minPasswordLength: 8,
    },
});
