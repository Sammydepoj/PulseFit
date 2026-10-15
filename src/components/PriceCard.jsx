export default function PriceCard({ plan }) {
    return (
        <article
            className={`relative flex flex-col rounded-2xl border bg-surface px-6 py-8 ${
                plan.featured
                    ? "border-sage shadow-lg"
                    : "border-line"
            }`}
        >
            {plan.featured && (
                <p className="absolute -top-3 left-6 rounded-full bg-clay px-3 py-0.5 text-xs font-bold text-white">
                    Best for most people
                </p>
            )}
            <h3 className="text-lg font-semibold">{plan.name}</h3>
            <p className="mt-2 font-display text-4xl font-extrabold">
                {plan.price}
                <span className="font-body text-sm font-normal text-ink-soft">
                    {plan.per}
                </span>
            </p>
            <p className="mt-1 mb-5 text-sm text-clay">{plan.note}</p>
            <ul className="mb-6 flex flex-col gap-2.5 text-sm text-ink-soft">
                {plan.perks.map((perk) => (
                    <li key={perk}>
                        <span className="mr-1 font-bold text-sage">✓</span>
                        {perk}
                    </li>
                ))}
            </ul>
            <a
                href="#contact"
                className={`mt-auto rounded-full border border-sage px-7 py-3.5 text-center font-bold transition ${
                    plan.featured
                        ? "bg-sage text-bg hover:bg-sage-deep"
                        : "text-sage hover:bg-sage hover:text-bg"
                }`}
            >
                {plan.cta}
            </a>
        </article>
    );
}
