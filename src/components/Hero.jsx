const facts = [
    { value: "12", label: "people per class, max" },
    { value: "1", label: "coach who knows your name" },
    { value: "0", label: "mirrors on the floor" },
];

export default function Hero() {
    return (
        <section
            id="hero"
            className="mx-auto max-w-[1100px] px-6 pt-12 pb-10 md:pt-20 md:pb-16"
        >
            <p className="mb-4 text-xs uppercase tracking-[0.15em] text-sage">
                A small-group strength studio
            </p>
            <h1 className="max-w-160 text-4xl leading-[1.05] md:text-6xl">
                Train hard. <span className="text-sage">Keep it quiet.</span>
            </h1>
            <p className="mt-5 max-w-lg text-base text-ink-soft md:text-lg">
                No mirrors, no shouting, no crowds. Every class is capped at
                twelve people so your coach actually sees you lift.
            </p>
            <ul className="mt-8 flex flex-wrap gap-x-10 gap-y-3 text-sm text-ink-soft">
                {facts.map((fact) => (
                    <li key={fact.label}>
                        <strong className="mr-1 font-display text-3xl text-sage">
                            {fact.value}
                        </strong>
                        {fact.label}
                    </li>
                ))}
            </ul>
            <a
                href="#membership"
                className="mt-8 inline-block rounded-full bg-sage px-7 py-3.5 font-bold text-bg transition hover:-translate-y-px hover:bg-sage-deep"
            >
                Find your membership
            </a>
        </section>
    );
}
