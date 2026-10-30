import { useState } from "react";
import { api } from "../lib/api.js";
import { useAuth } from "../context/AuthContext.jsx";

// Starts a purchase. The browser only says which plan; the server decides the
// price, then we send the visitor to Stripe's hosted checkout page.
export function useCheckout() {
    const { user, openAuthDialog } = useAuth();
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState("");

    async function buy(planId) {
        setError("");
        if (!user) {
            openAuthDialog();
            return;
        }
        setBusy(true);
        try {
            const { url } = await api("/checkout", {
                method: "POST",
                body: { planId },
            });
            window.location.assign(url);
        } catch (err) {
            setError(err.message);
            setBusy(false);
        }
    }

    return { buy, busy, error };
}
