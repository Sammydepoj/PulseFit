export default function TrainerCard({ trainer }) {
    return (
        <article className="flex flex-[1_1_220px] flex-col items-center rounded-2xl border border-line bg-surface px-5 py-7 text-center transition-shadow hover:shadow-lg">
            <div
                aria-hidden="true"
                className="mb-4 flex size-20 items-center justify-center rounded-full bg-sage text-2xl font-extrabold text-bg"
            >
                {trainer.initials}
            </div>
            <h3 className="text-lg font-semibold">{trainer.name}</h3>
            <p className="mt-1 mb-3 text-xs uppercase tracking-wider text-sage">
                {trainer.specialty}
            </p>
            <p className="text-sm text-ink-soft">{trainer.bio}</p>
            <p className="mt-auto pt-4 font-display italic">{trainer.quote}</p>
        </article>
    );
}
