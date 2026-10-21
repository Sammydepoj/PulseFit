import { createAuthClient } from "better-auth/react";

// Same origin as the page; /api is proxied to the server (see lib/api.js).
export const authClient = createAuthClient({
    baseURL: window.location.origin,
});
