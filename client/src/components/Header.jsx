import { useEffect, useState } from "react";
import { navLinks } from "../data/studio.js";
import { useAuth } from "../context/AuthContext.jsx";
import ThemeToggle from "./ThemeToggle.jsx";
import AuthDialog from "./AuthDialog.jsx";

const linkClass =
    "relative text-sm text-ink-soft transition-colors hover:text-sage after:absolute after:inset-x-0 after:-bottom-1 after:h-px after:origin-left after:scale-x-0 after:bg-sage after:transition-transform hover:after:scale-x-100";

function AuthControls({ onSignIn, onSignOut, stacked = false }) {
    const { user, loading } = useAuth();
    if (loading) return null;

    if (user) {
        return (
            <div
                className={`flex items-center text-sm ${stacked ? "justify-between" : "gap-3"}`}
            >
                <span className="text-ink-soft">
                    Hi, {user.name.split(" ")[0]}
                </span>
                <button
                    type="button"
                    onClick={onSignOut}
                    className="rounded-full border border-line px-4 py-1.5 text-ink-soft transition-colors hover:border-sage hover:text-sage"
                >
                    Sign out
                </button>
            </div>
        );
    }

    return (
        <button
            type="button"
            onClick={onSignIn}
            className={`rounded-full border border-sage bg-sage px-4 py-1.5 text-sm font-semibold text-bg transition hover:opacity-90 ${stacked ? "w-full py-2.5" : ""}`}
        >
            Sign in
        </button>
    );
}

// Phones: logo, theme toggle and a hamburger that opens a dropdown panel.
// From md: links and account controls sit inline in one row.
export default function Header() {
    const { logout } = useAuth();
    const [authOpen, setAuthOpen] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        if (!menuOpen) return;
        const onKeyDown = (e) => e.key === "Escape" && setMenuOpen(false);
        document.addEventListener("keydown", onKeyDown);
        return () => document.removeEventListener("keydown", onKeyDown);
    }, [menuOpen]);

    function openSignIn() {
        setMenuOpen(false);
        setAuthOpen(true);
    }

    return (
        <header className="sticky top-0 z-10 border-b border-line bg-bg/85 backdrop-blur">
            <nav className="mx-auto flex max-w-[1100px] items-center justify-between p-4 md:px-6">
                <a href="#hero" className="font-extrabold text-xl">
                    Pulse<span className="text-sage">Fit</span>
                </a>

                <div className="flex items-center gap-3 md:gap-6">
                    <ul className="hidden gap-6 md:flex">
                        {navLinks.map((link) => (
                            <li key={link.href}>
                                <a href={link.href} className={linkClass}>
                                    {link.label}
                                </a>
                            </li>
                        ))}
                    </ul>
                    <ThemeToggle />
                    <div className="hidden md:block">
                        <AuthControls
                            onSignIn={openSignIn}
                            onSignOut={logout}
                        />
                    </div>
                    <button
                        type="button"
                        aria-label={menuOpen ? "Close menu" : "Open menu"}
                        aria-expanded={menuOpen}
                        aria-controls="mobile-menu"
                        onClick={() => setMenuOpen((open) => !open)}
                        className="flex size-9 items-center justify-center rounded-full border border-line text-ink-soft transition-colors hover:border-sage hover:text-sage md:hidden"
                    >
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            aria-hidden="true"
                            className="size-[18px]"
                        >
                            {menuOpen ? (
                                <path d="M6 6l12 12M18 6L6 18" />
                            ) : (
                                <path d="M4 7h16M4 12h16M4 17h16" />
                            )}
                        </svg>
                    </button>
                </div>
            </nav>

            {menuOpen && (
                <div
                    id="mobile-menu"
                    className="border-t border-line px-4 pb-5 md:hidden"
                >
                    <ul className="flex flex-col">
                        {navLinks.map((link) => (
                            <li
                                key={link.href}
                                className="border-b border-line"
                            >
                                <a
                                    href={link.href}
                                    onClick={() => setMenuOpen(false)}
                                    className="block py-3 text-ink-soft transition-colors hover:text-sage"
                                >
                                    {link.label}
                                </a>
                            </li>
                        ))}
                    </ul>
                    <div className="pt-4">
                        <AuthControls
                            stacked
                            onSignIn={openSignIn}
                            onSignOut={() => {
                                setMenuOpen(false);
                                logout();
                            }}
                        />
                    </div>
                </div>
            )}

            <AuthDialog open={authOpen} onClose={() => setAuthOpen(false)} />
        </header>
    );
}
