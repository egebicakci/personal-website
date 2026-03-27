type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
}: SectionHeadingProps) {
  return (
    <div className="max-w-3xl space-y-4">
      <p className="text-xs uppercase tracking-[0.45em] text-[var(--color-accent)]">
        {eyebrow}
      </p>
      <h2 className="font-display text-4xl font-semibold tracking-[-0.04em] text-white sm:text-5xl">
        {title}
      </h2>
      <p className="max-w-2xl text-base leading-8 text-[var(--color-text-muted)] sm:text-lg">
        {description}
      </p>
    </div>
  );
}
