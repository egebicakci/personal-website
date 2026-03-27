"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronLeft, ChevronRight, Images, X } from "lucide-react";
import { siteContent, type TravelPin } from "@/data/site-content";

type GalleryPin = TravelPin & {
  gallery: NonNullable<TravelPin["gallery"]>;
};

const galleryPins: GalleryPin[] = siteContent.travelPins
  .filter((pin) => pin.gallery?.length)
  .map((pin) => ({
    ...pin,
    gallery: pin.gallery ?? [],
  }));

export function TravelGalleryLauncher() {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPin, setSelectedPin] = useState<GalleryPin | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const activeImage = selectedPin?.gallery[activeImageIndex] ?? null;
  const hasPrevious = activeImageIndex > 0;
  const hasNext = selectedPin ? activeImageIndex < selectedPin.gallery.length - 1 : false;

  const galleryCards = useMemo(
    () =>
      galleryPins.map((pin) => ({
        key: `${pin.country}-${pin.city}`,
        country: pin.country,
        city: pin.city,
        image: pin.gallery[0].image,
        alt: pin.gallery[0].alt,
        count: pin.gallery.length,
      })),
    [],
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (selectedPin) {
          setSelectedPin(null);
          setActiveImageIndex(0);
          return;
        }

        setIsOpen(false);
      }

      if (event.key === "ArrowLeft" && hasPrevious) {
        setActiveImageIndex((current) => current - 1);
      }

      if (event.key === "ArrowRight" && hasNext) {
        setActiveImageIndex((current) => current + 1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [hasNext, hasPrevious, isOpen, selectedPin]);

  const openGallery = (pin: GalleryPin) => {
    setSelectedPin(pin);
    setActiveImageIndex(0);
  };

  const closeModal = () => {
    setIsOpen(false);
    setSelectedPin(null);
    setActiveImageIndex(0);
  };

  const goBackToPlaces = () => {
    setSelectedPin(null);
    setActiveImageIndex(0);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="glow-hover inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-5 py-3 text-sm font-semibold text-white/75 transition duration-300 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/10 hover:text-white"
      >
        Galeri
      </button>

      {mounted && isOpen
        ? createPortal(
        <div
          className="fixed inset-0 z-[130] flex items-center justify-center bg-black/82 p-3 sm:p-6"
          onClick={closeModal}
        >
          <div
            className="glass-panel soft-outline relative flex max-h-[92vh] w-full max-w-6xl flex-col gap-5 overflow-hidden rounded-[30px] p-4 sm:p-6"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={closeModal}
              className="glow-hover absolute right-4 top-4 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-black/55 text-white/80 transition hover:text-white"
              aria-label="Galeriyi kapat"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="pr-14">
              <p className="text-xs uppercase tracking-[0.32em] text-[var(--color-accent)]">
                Gittiğim yerler
              </p>
              <h3 className="mt-2 font-display text-2xl font-semibold text-white sm:text-3xl">
                {selectedPin
                  ? `${selectedPin.country} / ${selectedPin.city}`
                  : "Gezi galerisi"}
              </h3>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/65">
                {selectedPin
                  ? "Yüklediğin fotoğraflar bu şehir için burada açılıyor."
                  : "Bir ülke veya şehir seç, yüklediğin fotoğraflar açılır pencerede görünsün."}
              </p>
            </div>

            {selectedPin && activeImage ? (
              <div className="flex min-h-0 flex-1 flex-col gap-4">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={goBackToPlaces}
                    className="glow-hover inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-4 py-2 text-sm font-medium text-white/80 transition hover:text-white"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Yerlere dön
                  </button>
                  <p className="text-xs uppercase tracking-[0.28em] text-white/40">
                    {activeImageIndex + 1} / {selectedPin.gallery.length}
                  </p>
                </div>

                <div className="relative min-h-0 flex-1 overflow-hidden rounded-[24px] border border-white/10 bg-black/45">
                  {hasPrevious ? (
                    <button
                      type="button"
                      onClick={() => setActiveImageIndex((current) => current - 1)}
                      className="glow-hover absolute left-4 top-1/2 z-10 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/60 text-white/85 transition hover:text-white"
                      aria-label="Önceki fotoğraf"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                  ) : null}

                  {hasNext ? (
                    <button
                      type="button"
                      onClick={() => setActiveImageIndex((current) => current + 1)}
                      className="glow-hover absolute right-4 top-1/2 z-10 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/60 text-white/85 transition hover:text-white"
                      aria-label="Sonraki fotoğraf"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  ) : null}

                  <div className="flex h-[50vh] w-full items-center justify-center p-2 sm:h-[56vh] sm:p-3">
                    <Image
                      src={activeImage.image}
                      alt={activeImage.alt}
                      width={1600}
                      height={1600}
                      className="h-full w-full object-contain object-center"
                      sizes="(max-width: 1280px) 100vw, 1100px"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid max-h-[65vh] gap-4 overflow-y-auto pr-1 sm:grid-cols-2 xl:grid-cols-3">
                {galleryCards.map((card) => (
                  <button
                    key={card.key}
                    type="button"
                    onClick={() => {
                      const targetPin = galleryPins.find(
                        (pin) => pin.country === card.country && pin.city === card.city,
                      );

                      if (targetPin) {
                        openGallery(targetPin);
                      }
                    }}
                    className="glass-panel soft-outline group overflow-hidden rounded-[24px] text-left transition duration-300 hover:-translate-y-1"
                  >
                    <div className="relative aspect-[5/4] overflow-hidden">
                      <Image
                        src={card.image}
                        alt={card.alt}
                        fill
                        className="object-cover transition duration-500 group-hover:scale-[1.03]"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                    </div>
                    <div className="relative -mt-16 space-y-3 p-4">
                      <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/45 px-3 py-1 text-[11px] uppercase tracking-[0.26em] text-[var(--color-accent)] backdrop-blur-xl">
                        <Images className="h-3.5 w-3.5" />
                        {card.count} fotoğraf
                      </span>
                      <div>
                        <p className="text-xs uppercase tracking-[0.28em] text-white/50">
                          {card.country}
                        </p>
                        <p className="mt-2 font-display text-2xl font-semibold text-white">
                          {card.city}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>,
        document.body,
      )
        : null}
    </>
  );
}
