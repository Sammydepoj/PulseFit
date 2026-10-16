import { plans } from "../data/studio.js";
import SectionHeading from "./SectionHeading.jsx";
import PriceCard from "./PriceCard.jsx";

/* WHY GRID: tiers are only comparable if they are the same width and their
   rows line up. One column on phones (same order), three equal columns from
   lg. The featured tier is marked by border and badge, not scaled up, so it
   never breaks the alignment. */
export default function Membership() {
    return (
        <section
            id="membership"
            className="mx-auto max-w-[1100px] border-t border-line px-6 py-12"
        >
            <SectionHeading
                number="03"
                label="Membership"
                title="Pay for the habit you have"
                intro="Most members train two to three times a week, so the middle plan is priced to be the obvious choice."
            />
            <div className="mx-auto grid max-w-md grid-cols-1 items-stretch gap-6 lg:max-w-none lg:grid-cols-3">
                {plans.map((p) => (
                    <PriceCard key={p.id} plan={p} />
                ))}
            </div>
        </section>
    );
}
