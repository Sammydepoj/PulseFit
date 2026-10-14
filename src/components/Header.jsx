import { navLinks } from "../data/studio.js";

// Mobile-first: logo stacked above links; from sm: they share one row.
export default function Header() {
    return (
        <header className="sticky top-0 z-10 border-b border-line bg-bg">
            <nav className="mx-auto flex max-w-[1100px] flex-col items-center gap-3 p-4 sm:flex-row sm:justify-between sm:px-6">
                <a href="#hero" className="font-extrabold text-xl">
                    Pulse<span className="text-sage">Fit</span>
                </a>
                <ul className="flex flex-wrap justify-center gap-4 sm:gap-6">
                    {navLinks.map((link) => (
                        <li key={link.href}>
                            <a
                                href={link.href}
                                className="text-sm text-ink-soft transition-colors hover:text-sage"
                            >
                                {link.label}
                            </a>
                        </li>
                    ))}
                </ul>
            </nav>
        </header>
    );
}
