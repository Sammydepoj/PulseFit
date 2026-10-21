export default function SectionHeading({ number, label, title, intro }) {
    return (
        <div className="reveal mb-8 max-w-xl">
            <p className="mb-3 flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-sage">
                <span className="font-display text-base normal-case tracking-normal">
                    {number}
                </span>
                <span className="h-px w-8 bg-sage/50" />
                {label}
            </p>
            <h2 className="text-3xl md:text-4xl">{title}</h2>
            <p className="mt-3 text-ink-soft">{intro}</p>
        </div>
    );
}
