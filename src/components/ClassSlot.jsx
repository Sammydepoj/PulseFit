// Written-out level text is shown too, so intensity is never color-only.
const LEVEL_BORDER = {
    gentle: "border-l-level-gentle",
    steady: "border-l-level-steady",
    hard: "border-l-sage-deep",
};

// morning sits in grid row 2, evening in row 3 (row 1 is the day name)
const PERIOD_ROW = {
    morning: "row-start-2",
    evening: "row-start-3",
};

export default function ClassSlot({ item }) {
    return (
        <article
            className={`rounded-lg border border-line border-l-4 bg-surface p-3.5 ${LEVEL_BORDER[item.level]} ${PERIOD_ROW[item.period]}`}
        >
            <p className="text-xs font-bold text-sage">{item.time}</p>
            <p className="mt-0.5 font-semibold">{item.name}</p>
            <p className="text-sm text-ink-soft">
                with {item.coach} · <span className="capitalize">{item.level}</span>
            </p>
        </article>
    );
}
