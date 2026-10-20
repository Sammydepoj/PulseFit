import { navLinks } from "../data/studio.js";
import ThemeToggle from "./ThemeToggle.jsx";

// Mobile-first: logo stacked above links; from sm: they share one row.
export default function Header() {
    return (
        <header className="sticky top-0 z-10 border-b border-line bg-bg/85 backdrop-blur">
            <nav className="mx-auto flex max-w-[1100px] flex-col items-center gap-3 p-4 sm:flex-row sm:justify-between sm:px-6">
                <a href="#hero" className="font-extrabold text-xl">
                    Pulse<span className="text-sage">Fit</span>
                </a>
                <div className="flex items-center gap-4 sm:gap-6">
                    <ul className="flex flex-wrap justify-center gap-4 sm:gap-6">
                        {navLinks.map((link) => (
                            <li key={link.href}>
                                <a
                                    href={link.href}
                                    className="relative text-sm text-ink-soft transition-colors hover:text-sage after:absolute after:inset-x-0 after:-bottom-1 after:h-px after:origin-left after:scale-x-0 after:bg-sage after:transition-transform hover:after:scale-x-100"
                                >
                                    {link.label}
                                </a>
                            </li>
                        ))}
                    </ul>
                    <ThemeToggle />
                </div>
            </nav>
        </header>
    );
}
