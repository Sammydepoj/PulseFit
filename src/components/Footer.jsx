import { navLinks, trainers, hero } from "../data/studio.js";

const credits = [...new Set([hero.credit, ...trainers.map((t) => t.credit)])];

export default function Footer() {
    const exploreLinks = navLinks.filter((l) =>
        ["#schedule", "#trainers", "#membership"].includes(l.href),
    );

    return (
        <footer id="contact" className="bg-ink text-bg">
            <div className="mx-auto grid max-w-[1100px] gap-10 px-6 pt-12 pb-8 md:grid-cols-[2fr_1fr_1fr] md:gap-8">
                <div>
                    <p className="text-lg font-extrabold">
                        Pulse<span className="text-level-gentle">Fit</span>
                    </p>
                    <p className="mt-2 max-w-sm text-sm text-bg/65">
                        Small-group classes and coaches who care.
                    </p>
                </div>
                <div>
                    <h3 className="mb-3 text-sm font-semibold">Explore</h3>
                    <ul className="flex flex-col gap-2 text-sm text-bg/65">
                        {exploreLinks.map((link) => (
                            <li key={link.href}>
                                <a href={link.href} className="hover:text-bg">
                                    {link.label}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
                <div>
                    <h3 className="mb-3 text-sm font-semibold">Visit us</h3>
                    <div className="space-y-1 text-sm text-bg/65">
                        <p>hello@pulsefit.example</p>
                        <p>45 Muscle Lane, Lagos</p>
                        <p>Mon–Fri 6am–9pm · Sat 8am–1pm</p>
                    </div>
                </div>
            </div>
            <div className="mx-auto max-w-[1100px] space-y-1 border-t border-bg/15 px-6 py-6 text-xs text-bg/55">
                <p>&copy; 2026 PulseFit. Built as a learning project.</p>
                <p>Photos from Unsplash: {credits.join(", ")}.</p>
            </div>
        </footer>
    );
}
