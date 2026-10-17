// A CONTROLLED component: it holds no state of its own.
//   - `saved` (prop)    -> what it shows
//   - `onToggle` (prop) -> what it calls when clicked
// The parent decides what "saved" means and passes the answer back down,
// so the same button can be reused on every class card.
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
