import { siteContent } from "@/data/site-content";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";

export function TravelStatsSection() {
  return (
    <section id="travel-stats" className="relative py-24">
      <div className="section-shell space-y-10">
        <Reveal>
          <SectionHeading
            eyebrow="Seyahat istatistikleri"
            title="Gezilen ülkeler ve şehirler"
            description="Şu ana kadar ziyaret ettiğim yerleri burada topladım. Kısa notlarla birlikte sade bir liste. Yeni yerler eklendikçe burası da güncelleniyor."
          />
        </Reveal>

        <Reveal delay={0.12}>
          <div className="glass-panel soft-outline rounded-[32px] p-6 lg:p-8">
            <div className="grid gap-6 lg:grid-cols-2">
              {siteContent.visitedPlaces.map((country) => (
                <div
                  key={country.country}
                  className="rounded-[26px] border border-white/10 bg-black/20 p-5"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-display text-2xl font-semibold">
                        {country.country}
                      </p>
                      <p className="mt-1 text-sm text-white/55">{country.note}</p>
                    </div>
                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.28em] text-[var(--color-accent)]">
                      {country.cities.length} şehir
                    </span>
                  </div>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {country.cities.map((city) => (
                      <span
                        key={`${country.country}-${city.name}`}
                        className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/70"
                      >
                        {city.name}
                        {"date" in city && city.date ? ` · ${city.date}` : ""}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
