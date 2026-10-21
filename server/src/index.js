import "dotenv/config";
import express from "express";
import { pool } from "./db.js";
import { loadUser } from "./session.js";
import { authRouter } from "./routes/auth.js";
import { studioRouter } from "./routes/studio.js";
import { savedRouter } from "./routes/saved.js";

const app = express();

// Railway/Render sit behind a proxy that terminates TLS.
app.set("trust proxy", 1);

app.use(express.json());

// Browsers send an Origin header on cross-site POSTs. Refuse state-changing
// requests from any site other than our frontend (CSRF defence, alongside
// SameSite=Lax on the session cookie).
if (!process.env.CLIENT_URL) throw new Error("CLIENT_URL is not set. See .env.example.");
const allowedOrigins = process.env.CLIENT_URL.split(",").map((s) => s.trim());
app.use((req, res, next) => {
    const origin = req.headers.origin;
    const safe = ["GET", "HEAD", "OPTIONS"].includes(req.method);
    if (!safe && origin && !allowedOrigins.includes(origin)) {
        return res.status(403).json({ error: "Origin not allowed" });
    }
    next();
});

app.use(loadUser);

app.get("/api/health", async (_req, res) => {
    await pool.query("SELECT 1");
    res.json({ ok: true });
});

app.use("/api/auth", authRouter);
app.use("/api/saved", savedRouter);
app.use("/api", studioRouter);

app.use("/api", (_req, res) => res.status(404).json({ error: "Not found" }));

app.use((err, _req, res, _next) => {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`PulseFit API on :${port}`));
