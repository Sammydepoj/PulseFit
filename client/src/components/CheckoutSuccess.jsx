import { useCallback, useEffect, useState } from "react";
import { api } from "../lib/api.js";
import { useAuth } from "../context/AuthContext.jsx";

const MAX_CHECKS = 8;
const CHECK_EVERY_MS = 2000;

const money = (cents) => `$${(cents / 100).toFixed(2)}`;

// Where Stripe sends people after paying. This page only reads the order: the
// server's webhook is what marks it paid, and it can land a moment after the
// redirect, so we check a few times before saying it is taking a while.
export default function CheckoutSuccess() {
    const orderId = new URLSearchParams(window.location.search).get("order");
    const { user, loading, openAuthDialog } = useAuth();
    // checking | paid | expired | waiting | notfound | signin | error
    const [state, setState] = useState("checking");
    const [order, setOrder] = useState(null);
    const [round, setRound] = useState(0);

    const checkAgain = useCallback(() => {
        setState("checking");
        setRound((r) => r + 1);
    }, []);

    useEffect(() => {
        if (loading) return;
        if (!user) {
            setState("signin");
            return;
        }
        if (!orderId) {
            setState("notfound");
            return;
        }

        let cancelled = false;
        let timer;

        async function check(attempt) {
            try {
                const found = await api(`/orders/${orderId}`);
                if (cancelled) return;
                setOrder(found);
                if (found.status === "paid") return setState("paid");
                if (found.status === "expired") return setState("expired");
            } catch (err) {
                if (cancelled) return;
                if (err.message === "No such order")
                    return setState("notfound");
                return setState("error");
            }
            if (attempt >= MAX_CHECKS) return setState("waiting");
            timer = setTimeout(() => check(attempt + 1), CHECK_EVERY_MS);
        }

        check(1);
        return () => {
            cancelled = true;
            clearTimeout(timer);
        };
    }, [loading, user, orderId, round]);

    return (
        <section className="mx-auto max-w-[640px] px-6 py-20 text-center">
            {state === "checking" && (
                <>
                    <h1 className="font-display text-3xl font-semibold">
                        Confirming your payment…
                    </h1>
                    <p className="mt-3 text-ink-soft" aria-live="polite">
                        This usually takes a few seconds. Please don’t close
                        this page.
                    </p>
                </>
            )}

            {state === "paid" && order && (
                <>
                    <p className="mx-auto flex size-14 items-center justify-center rounded-full bg-sage text-2xl font-bold text-bg">
                        ✓
                    </p>
                    <h1 className="mt-6 font-display text-3xl font-semibold">
                        Payment received
                    </h1>
                    <p className="mt-3 text-ink-soft">
                        Thanks, {user.name.split(" ")[0]}. Your membership is
                        confirmed.
                    </p>
                    <div className="mt-8 rounded-2xl border border-line bg-surface p-6 text-left">
                        {order.items.map((item) => (
                            <p
                                key={item.planId}
                                className="flex justify-between font-semibold"
                            >
                                <span>{item.planName}</span>
                                <span>{money(item.unitPriceCents)}</span>
                            </p>
                        ))}
                        <p className="mt-4 flex justify-between border-t border-line pt-4">
                            <span className="text-ink-soft">Total paid</span>
                            <span className="font-semibold">
                                {money(order.totalCents)}
                            </span>
                        </p>
                        <p className="mt-4 text-xs text-ink-soft">
                            Order {order.id}
                        </p>
                    </div>
                </>
            )}

            {state === "waiting" && (
                <>
                    <h1 className="font-display text-3xl font-semibold">
                        Still confirming
                    </h1>
                    <p className="mt-3 text-ink-soft">
                        Your payment is taking longer than usual to confirm. You
                        have not been charged twice. Check again in a moment.
                    </p>
                    <button
                        type="button"
                        onClick={checkAgain}
                        className="mt-6 rounded-full border border-sage px-6 py-2.5 font-semibold text-sage transition hover:bg-sage hover:text-bg"
                    >
                        Check again
                    </button>
                </>
            )}

            {state === "expired" && (
                <>
                    <h1 className="font-display text-3xl font-semibold">
                        This checkout expired
                    </h1>
                    <p className="mt-3 text-ink-soft">
                        No payment was taken. You can start again from the
                        membership section.
                    </p>
                </>
            )}

            {state === "signin" && (
                <>
                    <h1 className="font-display text-3xl font-semibold">
                        Sign in to see your order
                    </h1>
                    <button
                        type="button"
                        onClick={openAuthDialog}
                        className="mt-6 rounded-full border border-sage bg-sage px-6 py-2.5 font-semibold text-bg transition hover:opacity-90"
                    >
                        Sign in
                    </button>
                </>
            )}

            {state === "notfound" && (
                <>
                    <h1 className="font-display text-3xl font-semibold">
                        We couldn’t find that order
                    </h1>
                    <p className="mt-3 text-ink-soft">
                        It may belong to a different account.
                    </p>
                </>
            )}

            {state === "error" && (
                <>
                    <h1 className="font-display text-3xl font-semibold">
                        Couldn’t check your order
                    </h1>
                    <button
                        type="button"
                        onClick={checkAgain}
                        className="mt-6 rounded-full border border-sage px-6 py-2.5 font-semibold text-sage transition hover:bg-sage hover:text-bg"
                    >
                        Try again
                    </button>
                </>
            )}

            <a
                href="/"
                className="mt-10 inline-block text-sm text-ink-soft underline hover:text-sage"
            >
                Back to PulseFit
            </a>
        </section>
    );
}
