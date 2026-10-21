export default function PriceCard({ plan }) {
    const f = plan.featured;
    return (
        <article
            className={`reveal relative flex flex-col rounded-2xl border px-6 py-8 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl ${
                f
                    ? "border-featured bg-featured text-on-featured shadow-lg"
                    : "border-line bg-surface"
            }`}
        >
            {f && (
                <p className="absolute -top-3 left-6 rounded-full bg-clay px-3 py-0.5 text-xs font-bold text-white">
                    Best for most people
                </p>
            )}
            <h3 className="text-lg font-semibold">{plan.name}</h3>
            <p className="mt-2 font-display text-5xl font-semibold">
                {`$${plan.priceCents / 100}`}
                <span
                    className={`font-body text-sm font-normal ${f ? "text-on-featured/70" : "text-ink-soft"}`}
                >
                    {plan.per}
                </span>
            </p>
            <p
                className={`mt-1 mb-5 text-sm ${f ? "text-[#e3b9a3]" : "text-clay"}`}
            >
                {plan.note}
            </p>
            <ul
                className={`mb-6 flex flex-col gap-2.5 border-t pt-5 text-sm ${f ? "border-on-featured/20 text-on-featured/85" : "border-line text-ink-soft"}`}
            >
                {plan.perks.map((perk) => (
                    <li key={perk}>
                        <span
                            className={`mr-1 font-bold ${f ? "text-on-featured" : "text-sage"}`}
                        >
                            ✓
                        </span>
                        {perk}
                    </li>
                ))}
            </ul>
            <a
                href="#contact"
                className={`mt-auto rounded-full border px-7 py-3.5 text-center font-bold transition ${
                    f
                        ? "border-on-featured bg-on-featured text-featured hover:opacity-90"
                        : "border-sage text-sage hover:bg-sage hover:text-bg"
                }`}
            >
                {plan.cta}
            </a>
        </article>
    );
}
