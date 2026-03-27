"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { siteContent } from "@/data/site-content";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";

export function GallerySection() {
  const [activeFilter, setActiveFilter] = useState("Tümü");
  const [activeImageId, setActiveImageId] = useState<string | null>(null);

  const filters = useMemo(
    () => ["Tümü", ...siteContent.galleryFilters],
    [],
  );

  const items = useMemo(() => {
    if (activeFilter === "Tümü") return siteContent.galleryItems;

    return siteContent.galleryItems.filter(
      (item) =>
        item.country === activeFilter ||
        item.city === activeFilter ||
        item.tags.includes(activeFilter),
    );
  }, [activeFilter]);

  const activeImage =
    siteContent.galleryItems.find((item) => item.id === activeImageId) ?? null;

  return (
    <section id="gallery" className="relative py-24">
      <div className="section-shell space-y-10">
        <Reveal>
          <SectionHeading
            eyebrow="Seyahat galerisi"
            title="Temiz ve sinematik bir ritimle seçilmiş yolculuk kareleri."
            description="Kendi fotoğraflarınızı `public/images/gallery` klasörüne ekleyip ilgili kayıtları `data/site-content.ts` içinden güncelleyebilirsiniz."
          />
        </Reveal>

        <Reveal delay={0.08}>
          <div className="flex flex-wrap gap-3">
            {filters.map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                className={`glow-hover rounded-full border px-4 py-2 text-sm transition duration-300 ${
                  activeFilter === filter
                    ? "border-[var(--color-accent)] bg-[rgba(255,94,0,0.16)] text-white"
                    : "border-white/10 bg-white/4 text-white/70 hover:border-white/20 hover:text-white"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.12}>
          <div className="masonry-grid">
            {items.map((item, index) => (
              <motion.button
                key={item.id}
                type="button"
                onClick={() => setActiveImageId(item.id)}
                className="masonry-item glass-panel soft-outline group relative w-full overflow-hidden rounded-[28px] text-left"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.45, delay: index * 0.04 }}
                whileHover={{ y: -6 }}
              >
                <div className="relative aspect-[4/5] overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.alt}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-[1.04]"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent px-5 pb-5 pt-16">
                    <p className="font-display text-lg font-semibold">{item.city}</p>
                    <p className="text-sm text-white/65">
                      {item.country} · {item.caption}
                    </p>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </Reveal>
      </div>

      {activeImage ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/86 px-4 py-8 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
          aria-label={activeImage.alt}
          onClick={() => setActiveImageId(null)}
        >
          <button
            type="button"
            className="glow-hover absolute right-4 top-4 rounded-full border border-white/10 bg-white/10 p-3 text-white transition hover:bg-white/20"
            onClick={() => setActiveImageId(null)}
            aria-label="Galeri ışık kutusunu kapat"
          >
            <X className="h-5 w-5" />
          </button>

          <div
            className="glass-panel soft-outline relative w-full max-w-5xl overflow-hidden rounded-[30px]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="grid gap-0 lg:grid-cols-[1.4fr_0.7fr]">
              <div className="relative min-h-[420px]">
                <Image
                  src={activeImage.image}
                  alt={activeImage.alt}
                  fill
                  className="object-cover"
                  sizes="100vw"
                  priority
                />
              </div>
              <div className="flex flex-col justify-end gap-4 p-6 md:p-8">
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-[var(--color-accent)]">
                    {activeImage.country}
                  </p>
                  <h3 className="mt-3 font-display text-3xl font-semibold">
                    {activeImage.city}
                  </h3>
                </div>
                <p className="text-sm leading-7 text-white/70">
                  {activeImage.caption}
                </p>
                <div className="flex flex-wrap gap-2">
                  {activeImage.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/65"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
