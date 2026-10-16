import { classes, hero } from "../data/studio.js";

const facts = [
    { value: "12", label: "people per class, max" },
    { value: "1", label: "coach who knows your name" },
    { value: "0", label: "mirrors on the floor" },
];

const nextClass = classes[0];

// Mobile: text, then photo. From lg: two columns, text left and a tall
// photo right.
export default function Hero() {
    return (
        <section
            id="hero"
            className="bg-gradient-to-b from-surface to-bg"
        >
            <div className="mx-auto grid max-w-[1100px] items-center gap-10 px-6 pt-12 pb-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14 lg:pt-20 lg:pb-20">
                <div>
                    <p className="mb-4 text-xs uppercase tracking-[0.2em] text-sage motion-safe:animate-fade-up [animation-delay:0ms]">
                        A small-group strength studio
                    </p>
                    <h1 className="text-5xl leading-[1.02] md:text-7xl motion-safe:animate-fade-up [animation-delay:100ms]">
                        Train hard.{" "}
                        <span className="italic text-sage">Keep it quiet.</span>
                    </h1>
                    <p className="mt-6 max-w-lg text-base text-ink-soft md:text-lg motion-safe:animate-fade-up [animation-delay:220ms]">
                        No mirrors, no shouting, no crowds. Every class is
                        capped at twelve people so your coach actually sees you
                        lift.
                    </p>
                    <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4 motion-safe:animate-fade-up [animation-delay:340ms]">
                        <a
                            href="#membership"
                            className="group inline-flex items-center gap-2 rounded-full bg-sage px-7 py-3.5 font-bold text-bg shadow-sm transition hover:bg-sage-deep hover:shadow-md"
                        >
                            Find your membership
                            <span className="transition-transform group-hover:translate-x-1">
                                →
                            </span>
                        </a>
                        <a
                            href="#schedule"
                            className="font-semibold text-ink underline decoration-sage/40 underline-offset-4 transition hover:decoration-sage"
                        >
                            See the schedule
                        </a>
                    </div>
                    <ul className="mt-10 motion-safe:animate-fade-up [animation-delay:460ms] flex flex-wrap gap-x-10 gap-y-4 border-t border-line pt-6 text-sm text-ink-soft">
                        {facts.map((fact) => (
                            <li key={fact.label} className="flex items-baseline gap-2">
                                <strong className="font-display text-4xl font-semibold text-sage">
                                    {fact.value}
                                </strong>
                                {fact.label}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="relative motion-safe:animate-fade-up [animation-delay:200ms]">
                    <img
                        src={hero.image}
                        alt={hero.imageAlt}
                        width="1000"
                        height="1500"
                        className="aspect-[4/3] w-full rounded-3xl object-cover object-[50%_70%] shadow-xl lg:aspect-[4/5] lg:object-[50%_35%]"
                    />
                    <div className="motion-safe:animate-float absolute bottom-4 left-4 right-4 rounded-2xl bg-bg/90 p-4 shadow-lg backdrop-blur sm:right-auto sm:w-64">
                        <p className="text-xs uppercase tracking-widest text-sage">
                            Next up
                        </p>
                        <p className="mt-1 font-display text-lg font-semibold">
                            {nextClass.name}
                        </p>
                        <p className="text-sm text-ink-soft">
                            {nextClass.day} {nextClass.time} · with {nextClass.coach}
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
