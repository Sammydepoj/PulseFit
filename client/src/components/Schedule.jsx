import { useState } from "react";
import { DAYS, levels } from "../data/studio.js";
import { useStudio } from "../context/StudioContext.jsx";
import { useSavedClasses } from "../hooks/useSavedClasses.js";
import SectionStatus from "./SectionStatus.jsx";
import SectionHeading from "./SectionHeading.jsx";
import ClassSlot from "./ClassSlot.jsx";

const FILTERS = ["all", ...levels];
export default function Schedule() {
    const { status, classes } = useStudio();
    const [level, setLevel] = useState("all");
    const { savedIds, toggleSaved, signedIn } = useSavedClasses(
        classes,
        status === "ready",
    );

    const visible =
        level === "all" ? classes : classes.filter((c) => c.level === level);

    return (
        <section
            id="schedule"
            className="mx-auto max-w-[1100px] border-t border-line px-6 py-12"
        >
            <SectionHeading
                number="01"
                label="Schedule"
                title="The week at a glance"
                intro="Two sessions a day, early or after work. The left edge of each card shows how hard it is, so you can plan a week that has some recovery in it."
            />

            {status !== "ready" ? (
                <SectionStatus />
            ) : (
                <>
                    <div className="mb-6 flex flex-wrap items-center gap-2">
                        {FILTERS.map((f) => (
                            <button
                                key={f}
                                type="button"
                                aria-pressed={level === f}
                                onClick={() => setLevel(f)}
                                className={`rounded-full border px-4 py-1.5 text-sm capitalize transition-colors ${
                                    level === f
                                        ? "border-sage bg-sage text-bg"
                                        : "border-line bg-surface text-ink-soft hover:border-sage"
                                }`}
                            >
                                {f}
                            </button>
                        ))}
                        <p
                            className="ml-1 text-sm text-ink-soft"
                            aria-live="polite"
                        >
                            {visible.length} of {classes.length} classes
                            {savedIds.length > 0 &&
                                ` · ${savedIds.length} saved`}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-3 lg:grid-cols-6">
                        {DAYS.map((day) => {
                            const slots = visible.filter((c) => c.day === day);
                            return (
                                <div
                                    key={day}
                                    className={`row-span-3 grid-rows-subgrid ${
                                        slots.length === 0
                                            ? "hidden sm:grid"
                                            : "grid"
                                    }`}
                                >
                                    <h3 className="text-sm font-semibold text-ink-soft">
                                        {day}
                                    </h3>
                                    {slots.map((item) => (
                                        <ClassSlot
                                            key={item.id}
                                            item={item}
                                            saved={savedIds.includes(item.id)}
                                            onToggleSaved={() =>
                                                toggleSaved(item.id)
                                            }
                                        />
                                    ))}
                                </div>
                            );
                        })}
                    </div>
                </>
            )}
        </section>
    );
}
