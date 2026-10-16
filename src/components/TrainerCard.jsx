// Photo on top (a shot of the class they teach), the coach's initials badge
// overlapping the photo edge, then text. `group` lets the photo react when
// the whole card is hovered.
export default function TrainerCard({ trainer }) {
    return (
        <article className="group flex flex-[1_1_220px] flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
            <div className="relative aspect-[16/10] overflow-hidden sm:aspect-[4/3]">
                <img
                    src={trainer.image}
                    alt={trainer.imageAlt}
                    loading="lazy"
                    width="900"
                    height="600"
                    className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <span className="absolute top-3 left-3 rounded-full bg-bg/90 px-3 py-1 text-[0.7rem] uppercase tracking-wider text-sage backdrop-blur">
                    {trainer.specialty}
                </span>
            </div>
            <div className="relative flex flex-1 flex-col px-5 pt-9 pb-6">
                <div
                    aria-hidden="true"
                    className="absolute -top-7 left-5 flex size-14 items-center justify-center rounded-full border-4 border-surface bg-sage font-bold text-bg"
                >
                    {trainer.initials}
                </div>
                <h3 className="text-lg font-semibold">{trainer.name}</h3>
                <p className="mt-1 text-sm text-ink-soft">{trainer.bio}</p>
                <p className="mt-auto border-t border-line pt-4 font-display italic">
                    {trainer.quote}
                </p>
            </div>
        </article>
    );
}
