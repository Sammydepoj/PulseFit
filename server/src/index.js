import "dotenv/config";
import express from "express";
import { pool } from "./db.js";
import { studioRouter } from "./routes/studio.js";

const app = express();

// Railway/Render sit behind a proxy that terminates TLS.
app.set("trust proxy", 1);

app.get("/api/health", async (_req, res) => {
    await pool.query("SELECT 1");
    res.json({ ok: true });
});

app.use("/api", studioRouter);

app.use("/api", (_req, res) => res.status(404).json({ error: "Not found" }));

app.use((err, _req, res, _next) => {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`PulseFit API on :${port}`));
