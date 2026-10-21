// All requests go to /api on the same origin: Vite proxies it in dev, and a
// Vercel rewrite forwards it to the server in production. Same-origin means
// the session cookie is first-party and works in every browser.
export async function api(path, { method = "GET", body } = {}) {
    const res = await fetch(`/api${path}`, {
        method,
        credentials: "include",
        headers: body ? { "Content-Type": "application/json" } : undefined,
        body: body ? JSON.stringify(body) : undefined,
    });
    if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Request failed (${res.status})`);
    }
    return res.status === 204 ? null : res.json();
}
