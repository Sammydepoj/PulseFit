import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
    plugins: [react(), tailwindcss()],
    server: {
        // In dev, forward /api to the Express server so the browser sees one origin.
        proxy: { "/api": "http://localhost:4000" },
    },
});
