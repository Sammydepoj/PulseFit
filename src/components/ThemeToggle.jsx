import { useEffect, useState } from "react";

export default function ThemeToggle() {
    const [dark, setDark] = useState(() =>
        document.documentElement.classList.contains("dark"),
    );

    useEffect(() => {
        document.documentElement.classList.toggle("dark", dark);
        try {
            localStorage.setItem("theme", dark ? "dark" : "light");
        } catch {}
    }, [dark]);

    return (
        <button
            type="button"
            role="switch"
            aria-checked={dark}
            aria-label="Dark mode"
            onClick={() => setDark((d) => !d)}
            className="relative flex size-9 items-center justify-center rounded-full border border-line text-ink-soft transition-colors hover:border-sage hover:text-sage"
        >
            {/* both icons stay mounted; the hidden one is faded and rotated */}
            <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                aria-hidden="true"
                className={`absolute size-[18px] transition duration-300 ${dark ? "scale-50 -rotate-90 opacity-0" : "opacity-100"}`}
            >
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
            </svg>
            <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                className={`absolute size-[18px] transition duration-300 ${dark ? "opacity-100" : "scale-50 rotate-90 opacity-0"}`}
            >
                <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
            </svg>
        </button>
    );
}
