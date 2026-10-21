import { useStudio } from "../context/StudioContext.jsx";

// Shown in place of a section's content until the API has answered.
export default function SectionStatus() {
    const { status, reload } = useStudio();
    if (status === "error") {
        return (
            <p className="text-ink-soft" role="alert">
                Couldn’t load this right now.{" "}
                <button
                    type="button"
                    onClick={reload}
                    className="font-semibold text-sage underline"
                >
                    Try again
                </button>
            </p>
        );
    }
    return (
        <p className="text-ink-soft" aria-live="polite">
            Loading…
        </p>
    );
}
