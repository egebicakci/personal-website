import { Suspense } from "react";
import { Footer } from "@/components/sections/footer";
import { GlobeSection } from "@/components/sections/globe-section";
import { HeroSection } from "@/components/sections/hero-section";
import { InstagramSection } from "@/components/sections/instagram-section";
import { InstagramSectionSkeleton } from "@/components/ui/instagram-section-skeleton";
import { SiteAudioPlayer } from "@/components/ui/site-audio-player";

export default function Home() {
  return (
    <main className="relative overflow-hidden bg-[var(--color-bg)] text-[var(--color-text)]">
      <SiteAudioPlayer />
      <HeroSection />
      <GlobeSection />
      <Suspense fallback={<InstagramSectionSkeleton />}>
        <InstagramSection />
      </Suspense>
      <Footer />
    </main>
  );
}
