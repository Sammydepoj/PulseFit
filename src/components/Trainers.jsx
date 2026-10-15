import { trainers } from "../data/studio.js";
import TrainerCard from "./TrainerCard.jsx";

/* WHY FLEXBOX: a one-dimensional list whose length will change as coaches
   join or leave. flex-[1_1_220px] lets each card grow to fill its row and
   wrap on its own with no breakpoints. In Grid, a leftover card on the last
   row would sit in a fixed column and leave a hole. */
export default function Trainers() {
    return (
        <section
            id="trainers"
            className="mx-auto max-w-[1100px] border-t border-line px-6 py-12"
        >
            <h2 className="mb-4 text-3xl">Four coaches, one philosophy</h2>
            <p className="mb-6 max-w-xl text-ink-soft">
                Each coach has a quote on their card because it is the first
                thing they say in class.
            </p>
            <div className="flex flex-wrap gap-6">
                {trainers.map((t) => (
                    <TrainerCard key={t.id} trainer={t} />
                ))}
            </div>
        </section>
    );
}
