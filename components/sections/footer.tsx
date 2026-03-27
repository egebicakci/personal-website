import Link from "next/link";
import type { CSSProperties } from "react";
import { siteContent } from "@/data/site-content";
import { BrandIcon, getBrandTheme } from "@/components/brand-icons";

const CURRENT_YEAR = 2026;

export function Footer() {
  return (
    <footer className="border-t border-white/8 py-10">
      <div className="section-shell flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <p className="font-display text-xl font-semibold tracking-tight">
            {siteContent.name}
          </p>
          <p className="text-sm text-white/50">
            © {CURRENT_YEAR} {siteContent.footer.tagline}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          {siteContent.socialLinks.map((social) => (
            <Link
              key={social.platform}
              href={social.href}
              target="_blank"
              rel="noreferrer"
              aria-label={social.label}
              className="glass-panel soft-outline flex h-[50px] w-[50px] items-center justify-center overflow-hidden rounded-[16px] p-0 transition duration-300 hover:-translate-y-0.5"
              style={
                {
                  "--hover-glow": getBrandTheme(social.platform).glow,
                } as CSSProperties
              }
            >
              <BrandIcon platform={social.platform} />
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
