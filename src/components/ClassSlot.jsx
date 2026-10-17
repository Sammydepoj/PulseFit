import SaveToggle from "./SaveToggle.jsx";

const LEVEL_BORDER = {
    gentle: "border-l-level-gentle",
    steady: "border-l-level-steady",
    hard: "border-l-sage-deep",
};

const PERIOD_ROW = {
    morning: "row-start-2",
    evening: "row-start-3",
};

export default function ClassSlot({ item, saved, onToggleSaved }) {
    return (
        <article
            className={`reveal rounded-lg border border-line border-l-4 p-3.5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md ${saved ? "bg-sage/10" : "bg-surface"} ${LEVEL_BORDER[item.level]} ${PERIOD_ROW[item.period]}`}
        >
            <p className="text-xs font-bold text-sage">{item.time}</p>
            <p className="mt-0.5 font-semibold">{item.name}</p>
            <p className="text-sm text-ink-soft">
                with {item.coach} · <span className="capitalize">{item.level}</span>
            </p>
            <SaveToggle
                saved={saved}
                onToggle={onToggleSaved}
                label={`${item.name} on ${item.day}`}
            />
        </article>
    );
}
