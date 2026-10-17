export default function SaveToggle({ saved, onToggle, label }) {
    return (
        <button
            type="button"
            aria-pressed={saved}
            aria-label={`${saved ? "Unsave" : "Save"} ${label}`}
            onClick={onToggle}
            className={`mt-3 active:scale-95 rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${
                saved
                    ? "border-clay bg-clay text-white motion-safe:animate-pop"
                    : "border-line text-ink-soft hover:border-clay hover:text-clay"
            }`}
        >
            {saved ? "✓ Saved" : "+ Save"}
        </button>
    );
}
