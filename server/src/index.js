import "dotenv/config";
import express from "express";
import { pool } from "./db.js";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./auth.js";
import { studioRouter } from "./routes/studio.js";
import { savedRouter } from "./routes/saved.js";

const app = express();

// Railway/Render sit behind a proxy that terminates TLS.
app.set("trust proxy", 1);

// Better Auth reads the raw request body itself, so this goes before express.json().
app.all("/api/auth/*splat", toNodeHandler(auth));

app.use(express.json());

app.get("/api/health", async (_req, res) => {
    await pool.query("SELECT 1");
    res.json({ ok: true });
});

app.use("/api/saved", savedRouter);
app.use("/api", studioRouter);

app.use("/api", (_req, res) => res.status(404).json({ error: "Not found" }));

app.use((err, _req, res, _next) => {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`PulseFit API on :${port}`));
