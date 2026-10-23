import "dotenv/config";
import pg from "pg";

if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set. Copy .env.example to .env.");
}

// Hosted Postgres (Neon, Render) requires TLS; local Postgres does not.
const { hostname } = new URL(process.env.DATABASE_URL);
const isLocal = hostname === "localhost" || hostname === "127.0.0.1";

export const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: isLocal ? false : { rejectUnauthorized: true },
});
