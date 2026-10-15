import { useState } from "react";
import { DAYS, classes, levels } from "../data/studio.js";
import ClassSlot from "./ClassSlot.jsx";

const FILTERS = ["all", ...levels];

/* WHY GRID: a timetable is two-dimensional (days across, morning/evening
   down). Each day is a subgrid that borrows the parent's rows, so a class
   name that wraps in one column makes that row taller in every column.
   Columns: 1 on phones, 3 from sm, 6 from lg. */
export default function Schedule() {
    // `level` is the one piece of state the filter owns. Clicking a button
    // calls setLevel, React re-runs this function, and `visible` is
    // recomputed from the new value.
    const [level, setLevel] = useState("all");

    const visible =
        level === "all" ? classes : classes.filter((c) => c.level === level);

    return (
        <section
            id="schedule"
            className="mx-auto max-w-[1100px] border-t border-line px-6 py-12"
        >
            <h2 className="mb-4 text-3xl">The week at a glance</h2>
            <p className="mb-5 max-w-xl text-ink-soft">
                Two sessions a day, early or after work. The left edge of each
                card shows how hard it is, so you can plan a week that has some
                recovery in it.
            </p>

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
                <p className="ml-1 text-sm text-ink-soft" aria-live="polite">
                    {visible.length} of {classes.length} classes
                </p>
            </div>

            <div className="grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-3 lg:grid-cols-6">
                {DAYS.map((day) => {
                    const slots = visible.filter((c) => c.day === day);
                    return (
                        <div
                            key={day}
                            className={`row-span-3 grid-rows-subgrid ${
                                slots.length === 0 ? "hidden sm:grid" : "grid"
                            }`}
                        >
                            <h3 className="text-sm font-semibold text-ink-soft">
                                {day}
                            </h3>
                            {slots.map((item) => (
                                <ClassSlot key={item.id} item={item} />
                            ))}
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
