import { siteContent, travelStats } from "@/data/site-content";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { InteractiveGlobe } from "@/components/ui/interactive-globe";

export function GlobeSection() {
  return (
    <section id="travel-map" className="relative py-24">
      <div className="section-glow right-[12%] top-24 h-64 w-64 bg-[rgba(255,94,0,0.12)]" />
      <div className="section-shell-wide grid gap-8 xl:grid-cols-[0.82fr_1.18fr]">
        <Reveal>
          <div className="space-y-8">
            <SectionHeading
              eyebrow="Gezilen Dünya"
              title="Gittiğim Yerler"
              description="Küreyi çevirerek gittiğim yerleri inceleyebilirsin. Her pin, farklı bir şehir ve farklı bir deneyim. Bazıları planlı, bazıları tamamen spontane. Hepsinin ortak noktası: iyi ki gitmişim."
            />
            <div className="section-grid sm:grid-cols-3">
              {[
                {
                  label: "Ülke",
                  value: travelStats.totalCountries.toString(),
                },
                {
                  label: "Şehir",
                  value: travelStats.totalCities.toString(),
                },
                {
                  label: "İşaret",
                  value: siteContent.travelPins.length.toString(),
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="glass-panel soft-outline rounded-[24px] p-5"
                >
                  <p className="text-sm text-white/55">{item.label}</p>
                  <p className="mt-4 font-display text-3xl font-semibold">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
            <div className="glass-panel soft-outline rounded-[28px] p-5 sm:p-6">
              <p className="text-xs uppercase tracking-[0.32em] text-white/45">
                Etkileşim
              </p>
              <p className="mt-4 text-sm leading-7 text-white/72">
                Küreyi çevirmek için sürükleyin, işaretlerin üzerine gelerek ya da
                dokunarak destinasyonları inceleyin.{" "}
                <span className="font-semibold text-white [text-shadow:0_0_18px_rgba(255,94,0,0.28)]">
                  Ülkelerin üzerine tıkladığında, o yerde çekilen fotoğrafların galerisi açılır.
                </span>
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.06}>
          <InteractiveGlobe pins={siteContent.travelPins} />
        </Reveal>
      </div>
    </section>
  );
}
