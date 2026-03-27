import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { ArrowRight } from "lucide-react";
import { BrandIcon, getBrandTheme } from "@/components/brand-icons";
import { siteContent } from "@/data/site-content";
import { Reveal } from "@/components/ui/reveal";
import { TravelGalleryLauncher } from "@/components/ui/travel-gallery-launcher";

export function HeroSection() {
  return (
    <section className="relative isolate overflow-hidden px-0 pb-16 pt-8 sm:pt-12 lg:pb-20">
      <div className="hero-noise absolute inset-0 opacity-30" />
      <div className="hero-vignette absolute inset-0 opacity-90" />
      <div className="absolute left-1/2 top-20 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,94,0,0.16),transparent_64%)] blur-3xl" />
      <div className="absolute right-[10%] top-[18%] h-60 w-60 rounded-full bg-[radial-gradient(circle,rgba(255,94,0,0.14),transparent_65%)] blur-3xl" />
      <div className="section-glow left-[8%] top-[18%] h-44 w-44 bg-[rgba(255,94,0,0.12)]" />

      <div className="section-shell-wide grid min-h-[88vh] items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <Reveal className="relative z-10">
          <div className="max-w-3xl space-y-8">
            <span className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/6 px-4 py-2 text-xs uppercase tracking-[0.35em] text-white/65">
              Hakkımda
              <span className="h-2 w-2 rounded-full bg-[var(--color-accent)] shadow-[0_0_16px_var(--color-accent)]" />
            </span>
            <div className="space-y-6">
              <p className="text-sm uppercase tracking-[0.45em] text-[var(--color-accent)]">
                {siteContent.hero.kicker}
              </p>
              <h1 className="font-display text-5xl font-semibold tracking-[-0.04em] text-white sm:text-6xl lg:text-7xl">
                {siteContent.name}
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-[var(--color-text-muted)] sm:text-xl">
                {siteContent.subtitle}
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <Link
                href="#travel-map"
                className="glow-hover group inline-flex items-center gap-2 rounded-full border border-[var(--color-accent)]/40 bg-[rgba(255,94,0,0.14)] px-5 py-3 text-sm font-semibold text-white transition duration-300 hover:-translate-y-0.5 hover:bg-[rgba(255,94,0,0.2)]"
              >
                Seyahat haritasını keşfet
                <ArrowRight className="h-4 w-4 transition duration-300 group-hover:translate-x-0.5" />
              </Link>
              <TravelGalleryLauncher />
            </div>

            <div className="flex flex-wrap gap-3">
              {siteContent.socialLinks.map((social) => (
                <Link
                  key={social.platform}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={social.label}
                  className="glass-panel soft-outline group flex h-[54px] w-[54px] items-center justify-center overflow-hidden rounded-[18px] p-0 transition duration-300 hover:-translate-y-1.5"
                  style={
                    {
                      "--hover-glow": "#4da3ff",
                    } as CSSProperties
                  }
                >
                  <BrandIcon platform={social.platform} />
                </Link>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.08} className="relative z-10">
          <div className="mx-auto w-full max-w-[640px]">
            <div className="glass-panel soft-outline relative overflow-hidden rounded-[34px] p-5 sm:p-6">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,94,0,0.18),transparent_38%)]" />
              <div className="relative space-y-5">
                <div className="text-center">
                  <p className="text-xs uppercase tracking-[0.32em] text-[var(--color-accent)]">
                    Profil kartı
                  </p>
                </div>
                <div className="relative mx-auto overflow-hidden rounded-[30px] border border-white/10">
                  <Image
                    src={siteContent.profile.image}
                    alt={siteContent.profile.alt}
                    width={900}
                    height={1100}
                    priority
                    className="h-auto w-full bg-[#0b0e14] object-contain"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/36 via-black/10 to-transparent" />
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
