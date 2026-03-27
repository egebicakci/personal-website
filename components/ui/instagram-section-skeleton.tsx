export function InstagramSectionSkeleton() {
  return (
    <section className="relative py-24">
      <div className="section-shell">
        <div className="glass-panel soft-outline animate-pulse rounded-[32px] p-6 lg:p-8">
          <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="space-y-4">
              <div className="h-8 w-32 rounded-full bg-white/8" />
              <div className="h-10 w-56 rounded-2xl bg-white/8" />
              <div className="h-20 w-full max-w-md rounded-[24px] bg-white/8" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="aspect-square rounded-[26px] bg-white/6"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
