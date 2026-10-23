import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../lib/api.js";

const AuthContext = createContext(null);

// Knows who is signed in. On load it asks the server (the session cookie does
// the rest), so you stay signed in after a refresh.
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api("/auth/me")
            .then((data) => setUser(data.user))
            .catch(() => setUser(null))
            .finally(() => setLoading(false));
    }, []);

    async function signup(name, email, password) {
        const data = await api("/auth/signup", {
            method: "POST",
            body: { name, email, password },
        });
        setUser(data.user);
    }

    async function login(email, password) {
        const data = await api("/auth/login", {
            method: "POST",
            body: { email, password },
        });
        setUser(data.user);
    }

    async function logout() {
        try {
            await api("/auth/logout", { method: "POST" });
        } finally {
            setUser(null);
        }
    }

    return (
        <AuthContext.Provider value={{ user, loading, signup, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const value = useContext(AuthContext);
    if (!value) throw new Error("useAuth must be used inside <AuthProvider>");
    return value;
}
