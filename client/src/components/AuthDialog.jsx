import { useEffect, useRef, useState } from "react";
import { authClient } from "../lib/auth-client.js";

const inputClass =
    "mt-1 w-full rounded-lg border border-line bg-bg px-3 py-2 text-ink focus:border-sage focus:outline-none";

export default function AuthDialog({ open, onClose }) {
    const dialogRef = useRef(null);
    const [mode, setMode] = useState("signin");
    const [error, setError] = useState("");
    const [busy, setBusy] = useState(false);

    useEffect(() => {
        const dialog = dialogRef.current;
        if (open && !dialog.open) dialog.showModal();
        if (!open && dialog.open) dialog.close();
    }, [open]);

    function switchMode(next) {
        setMode(next);
        setError("");
    }

    async function handleSubmit(e) {
        e.preventDefault();
        const formEl = e.currentTarget;
        const form = new FormData(formEl);
        setBusy(true);
        setError("");
        const email = form.get("email");
        const password = form.get("password");
        const { error: authError } =
            mode === "signup"
                ? await authClient.signUp.email({
                      name: form.get("name"),
                      email,
                      password,
                  })
                : await authClient.signIn.email({ email, password });
        setBusy(false);
        if (authError) {
            setError(authError.message || "Something went wrong. Try again.");
            return;
        }
        formEl.reset();
        onClose();
    }

    const signingUp = mode === "signup";

    return (
        <dialog
            ref={dialogRef}
            onClose={onClose}
            onClick={(e) => e.target === e.currentTarget && onClose()}
            className="m-auto w-[min(92vw,24rem)] rounded-2xl border border-line bg-surface p-0 text-ink shadow-xl backdrop:bg-black/50"
        >
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-6">
                <h2 className="font-display text-2xl font-semibold">
                    {signingUp ? "Create your account" : "Welcome back"}
                </h2>

                {signingUp && (
                    <label className="text-sm text-ink-soft">
                        Name
                        <input
                            name="name"
                            required
                            autoComplete="name"
                            className={inputClass}
                        />
                    </label>
                )}
                <label className="text-sm text-ink-soft">
                    Email
                    <input
                        name="email"
                        type="email"
                        required
                        autoComplete="email"
                        className={inputClass}
                    />
                </label>
                <label className="text-sm text-ink-soft">
                    Password
                    <input
                        name="password"
                        type="password"
                        required
                        minLength={8}
                        autoComplete={
                            signingUp ? "new-password" : "current-password"
                        }
                        className={inputClass}
                    />
                </label>

                {error && (
                    <p role="alert" className="text-sm text-clay">
                        {error}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={busy}
                    className="rounded-full border border-sage bg-sage px-6 py-2.5 font-bold text-bg transition hover:opacity-90 disabled:opacity-60"
                >
                    {busy ? "Please wait…" : signingUp ? "Sign up" : "Sign in"}
                </button>

                <p className="text-center text-sm text-ink-soft">
                    {signingUp ? "Already a member?" : "New here?"}{" "}
                    <button
                        type="button"
                        onClick={() =>
                            switchMode(signingUp ? "signin" : "signup")
                        }
                        className="font-semibold text-sage underline"
                    >
                        {signingUp ? "Sign in" : "Create an account"}
                    </button>
                </p>
            </form>
        </dialog>
    );
}
