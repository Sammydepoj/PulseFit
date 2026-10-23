import { useEffect, useState } from "react";
import { api } from "../lib/api.js";
import { useAuth } from "../context/AuthContext.jsx";

const STORAGE_KEY = "pulsefit-saved-classes";

function readLocal(classes) {
    try {
        const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
        if (!Array.isArray(stored)) return [];
        return stored.filter((id) => classes.some((c) => c.id === id));
    } catch {
        return [];
    }
}

function writeLocal(ids) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
    } catch {}
}

// Signed in: saved classes live in the database. Signed out: in localStorage.
// On sign-in, anything the guest saved is merged into their account.
export function useSavedClasses(classes, classesReady) {
    const { user, loading } = useAuth();
    const userId = user?.id ?? null;
    const [savedIds, setSavedIds] = useState([]);

    useEffect(() => {
        if (!classesReady || loading) return;
        const local = readLocal(classes);
        if (!userId) {
            setSavedIds(local);
            return;
        }
        let cancelled = false;
        (async () => {
            try {
                if (local.length > 0) {
                    await api("/saved", {
                        method: "POST",
                        body: { classIds: local },
                    });
                    writeLocal([]);
                }
                const ids = await api("/saved");
                if (!cancelled) setSavedIds(ids);
            } catch {
                if (!cancelled) setSavedIds(local);
            }
        })();
        return () => {
            cancelled = true;
        };
    }, [userId, loading, classesReady, classes]);

    function toggleSaved(id) {
        const wasSaved = savedIds.includes(id);
        const next = wasSaved
            ? savedIds.filter((x) => x !== id)
            : [...savedIds, id];
        setSavedIds(next);
        if (!userId) {
            writeLocal(next);
            return;
        }
        // Optimistic: roll back if the server rejects it.
        api(`/saved/${id}`, { method: wasSaved ? "DELETE" : "PUT" }).catch(() =>
            setSavedIds(savedIds),
        );
    }

    return { savedIds, toggleSaved, signedIn: Boolean(userId) };
}
