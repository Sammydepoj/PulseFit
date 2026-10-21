import { useStudio } from "../context/StudioContext.jsx";
import SectionStatus from "./SectionStatus.jsx";
import SectionHeading from "./SectionHeading.jsx";
import TrainerCard from "./TrainerCard.jsx";

export default function Trainers() {
    const { status, coaches } = useStudio();
    return (
        <section
            id="trainers"
            className="mx-auto max-w-[1100px] border-t border-line px-6 py-12"
        >
            <SectionHeading
                number="02"
                label="Coaches"
                title="Four coaches, one philosophy"
                intro="Each coach has a quote on their card because it is the first thing they say in class."
            />
            {status !== "ready" ? (
                <SectionStatus />
            ) : (
                <div className="flex flex-wrap gap-6">
                    {coaches.map((t) => (
                        <TrainerCard key={t.id} trainer={t} />
                    ))}
                </div>
            )}
        </section>
    );
}
