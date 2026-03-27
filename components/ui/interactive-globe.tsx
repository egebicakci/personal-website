"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import type { ComponentType } from "react";
import { X } from "lucide-react";
import type { TravelPin } from "@/data/site-content";

const Globe = dynamic(() => import("react-globe.gl"), { ssr: false }) as ComponentType<Record<string, unknown>>;

type InteractiveGlobeProps = {
  pins: TravelPin[];
};

type GlobeInstance = {
  controls: () => {
    autoRotate: boolean;
    autoRotateSpeed: number;
    enablePan: boolean;
    minDistance: number;
    maxDistance: number;
  };
  pointOfView: (
    coords: { altitude: number; lat?: number; lng?: number },
    durationMs?: number,
  ) => void;
};

export function InteractiveGlobe({ pins }: InteractiveGlobeProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const globeRef = useRef<GlobeInstance | null>(null);
  const rotationSpeedRef = useRef(0.45);
  const [dimensions, setDimensions] = useState({ width: 420, height: 520 });
  const [activePin, setActivePin] = useState<TravelPin | null>(pins[0] ?? null);
  const [galleryPin, setGalleryPin] = useState<TravelPin | null>(null);
  const [activeGalleryIndex, setActiveGalleryIndex] = useState(0);
  const [isPointerOverGlobe, setIsPointerOverGlobe] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    const updateSize = () => {
      const element = containerRef.current;
      if (!element) return;

      const styles = window.getComputedStyle(element);
      const horizontalPadding =
        Number.parseFloat(styles.paddingLeft) + Number.parseFloat(styles.paddingRight);
      const availableWidth = Math.max(280, element.clientWidth - horizontalPadding);
      const width = Math.min(availableWidth, 760);

      setDimensions({
        width,
        height: Math.max(340, Math.min(620, Math.round(width * 0.9))),
      });
    };

    updateSize();
    const observer = new ResizeObserver(updateSize);
    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let frameId = 0;

    const applyControls = () => {
      const globe = globeRef.current;
      if (!globe) {
        frameId = window.requestAnimationFrame(applyControls);
        return;
      }

      const isCompact = dimensions.width < 640;
      const controls = globe.controls();
      rotationSpeedRef.current = isCompact ? 0.4 : 0.45;
      controls.autoRotate = true;
      controls.autoRotateSpeed = rotationSpeedRef.current;
      controls.enablePan = false;
      controls.minDistance = isCompact ? 210 : 180;
      controls.maxDistance = isCompact ? 320 : 300;
      globe.pointOfView(
        {
          lat: 28,
          lng: 36,
          altitude: isCompact ? 2.35 : 2.2,
        },
        0,
      );
    };

    applyControls();

    return () => {
      if (frameId) window.cancelAnimationFrame(frameId);
    };
  }, [dimensions.width]);

  useEffect(() => {
    const controls = globeRef.current?.controls();
    if (!controls) return;

    controls.autoRotate = !isPointerOverGlobe;
    controls.autoRotateSpeed = rotationSpeedRef.current;
  }, [isPointerOverGlobe]);

  const markerRings = useMemo(
    () =>
      pins.map((pin) => ({
        ...pin,
        lat: pin.displayLat ?? pin.lat,
        lng: pin.displayLng ?? pin.lng,
        color: pin.emphasis === "high" ? "#ffb088" : "#ff7a2f",
      })),
    [pins],
  );

  const activeGalleryImage = galleryPin?.gallery?.[activeGalleryIndex] ?? null;
  const previousGalleryImage =
    galleryPin?.gallery?.length && galleryPin.gallery.length > 1 && activeGalleryIndex > 0
      ? galleryPin.gallery[activeGalleryIndex - 1]
      : null;
  const nextGalleryImage =
    galleryPin?.gallery?.length &&
    galleryPin.gallery.length > 1 &&
    activeGalleryIndex < galleryPin.gallery.length - 1
      ? galleryPin.gallery[activeGalleryIndex + 1]
      : null;

  const openPinGallery = (pin: TravelPin) => {
    if (!pin.gallery?.length) return;
    setGalleryPin(pin);
    setActiveGalleryIndex(0);
  };

  const closePinGallery = () => {
    setGalleryPin(null);
    setActiveGalleryIndex(0);
  };

  const showPreviousImage = () => {
    const galleryLength = galleryPin?.gallery?.length ?? 0;
    if (!galleryLength) return;
    setActiveGalleryIndex((current) =>
      current === 0 ? galleryLength - 1 : current - 1,
    );
  };

  const showNextImage = () => {
    const galleryLength = galleryPin?.gallery?.length ?? 0;
    if (!galleryLength) return;
    setActiveGalleryIndex((current) =>
      current === galleryLength - 1 ? current : current + 1,
    );
  };

  useEffect(() => {
    if (!galleryPin) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closePinGallery();
        return;
      }

      if (event.key === "ArrowLeft") {
        showPreviousImage();
        return;
      }

      if (event.key === "ArrowRight") {
        showNextImage();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [galleryPin]);

  return (
    <div
      ref={containerRef}
      className="glass-panel soft-outline relative overflow-hidden rounded-[32px] p-3 sm:p-4"
      onMouseEnter={() => setIsPointerOverGlobe(true)}
      onMouseLeave={() => setIsPointerOverGlobe(false)}
      onTouchStart={() => setIsPointerOverGlobe(true)}
      onTouchEnd={() => setIsPointerOverGlobe(false)}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_38%,rgba(255,94,0,0.14),transparent_38%)]" />
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white/6 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/70 to-transparent" />

      <div className="relative flex w-full justify-center overflow-hidden">
        <Globe
          ref={globeRef}
          width={dimensions.width}
          height={dimensions.height}
          globeImageUrl="/textures/earth-night.jpg"
          bumpImageUrl="/textures/earth-topology.png"
          backgroundColor="rgba(0,0,0,0)"
          htmlElementsData={pins.map((pin) => ({
            ...pin,
            lat: pin.displayLat ?? pin.lat,
            lng: pin.displayLng ?? pin.lng,
          }))}
          htmlElement={(pin: object) => {
            const markerPin = pin as TravelPin;
            const element = document.createElement("button");
            const label = document.createElement("span");
            element.type = "button";
            element.setAttribute("aria-label", `${markerPin.country} ${markerPin.city}`);
            element.textContent = "";
            element.style.width = markerPin.emphasis === "high" ? "34px" : "30px";
            element.style.height = markerPin.emphasis === "high" ? "34px" : "30px";
            element.style.border = "1px solid rgba(255,255,255,0.18)";
            element.style.borderRadius = "9999px";
            element.style.background = "rgba(10,12,18,0.92)";
            element.style.boxShadow =
              markerPin.emphasis === "high"
                ? "0 0 0 1px rgba(255,94,0,0.34), 0 0 28px rgba(255,94,0,0.26)"
                : "0 0 0 1px rgba(255,94,0,0.18), 0 0 18px rgba(255,94,0,0.16)";
            element.style.display = "grid";
            element.style.placeItems = "center";
            element.style.fontSize = markerPin.emphasis === "high" ? "17px" : "15px";
            element.style.cursor = "pointer";
            element.style.backdropFilter = "blur(8px)";
            element.style.padding = "0";
            element.style.overflow = "hidden";
            element.style.transform = "translate(-50%, -50%)";
            element.style.pointerEvents = "auto";
            element.style.zIndex = markerPin.emphasis === "high" ? "3" : "2";
            label.textContent = markerPin.marker ?? "•";
            label.style.fontSize = markerPin.emphasis === "high" ? "18px" : "16px";
            label.style.lineHeight = "1";
            label.style.transform = "translateY(-0.5px)";
            label.style.pointerEvents = "none";
            element.appendChild(label);
            element.onmouseenter = () => setActivePin(markerPin);
            element.onclick = (event) => {
              event.preventDefault();
              event.stopPropagation();
              setActivePin(markerPin);
              openPinGallery(markerPin);
            };
            element.onpointerdown = (event) => {
              event.preventDefault();
              event.stopPropagation();
              setActivePin(markerPin);
              openPinGallery(markerPin);
            };
            element.ontouchstart = (event) => {
              event.preventDefault();
              setActivePin(markerPin);
              openPinGallery(markerPin);
            };
            return element;
          }}
          ringsData={markerRings}
          ringColor={() => (t: number) => `rgba(255,94,0,${Math.max(0, 0.28 - t * 0.28)})`}
          ringMaxRadius={4.2}
          ringPropagationSpeed={1.15}
          ringRepeatPeriod={1500}
          atmosphereColor="#ff5e00"
          atmosphereAltitude={0.14}
          onPointHover={(point: object | null) => setActivePin((point as TravelPin | null) ?? null)}
          onPointClick={(point: object | null) => setActivePin((point as TravelPin | null) ?? null)}
        />
      </div>

      <div className="pointer-events-none absolute inset-x-3 bottom-3 sm:inset-x-4 sm:bottom-4">
        <div className="ml-auto max-w-sm rounded-[24px] border border-white/10 bg-[rgba(8,10,16,0.84)] p-4 backdrop-blur-xl">
          {activePin ? (
            <>
              <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-accent)]">
                {activePin.country}
              </p>
              <p className="mt-2 font-display text-xl font-semibold text-white">
                {activePin.city}
              </p>
              {activePin.date ? (
                <p className="mt-2 text-sm text-white/55">{activePin.date}</p>
              ) : null}
              {activePin.note ? (
                <p className="mt-3 text-sm leading-6 text-white/70">{activePin.note}</p>
              ) : null}
            </>
          ) : (
            <p className="text-sm text-white/60">
              Seyahat notunu görmek için işaretlerin üzerine gelin ya da dokunun.
            </p>
          )}
        </div>
      </div>

      {galleryPin && activeGalleryImage ? (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center bg-black/78 p-3 sm:p-6"
          onClick={closePinGallery}
        >
          <div
            className="glass-panel soft-outline relative flex max-h-[92%] w-full max-w-5xl flex-col gap-4 overflow-hidden rounded-[28px] p-4 sm:p-5"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={closePinGallery}
              className="glow-hover absolute right-4 top-4 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-black/55 text-white/80 transition hover:text-white"
              aria-label="Galeriyi kapat"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="pr-14">
              <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-accent)]">
                {galleryPin.country}
              </p>
              <h3 className="mt-2 font-display text-2xl font-semibold text-white">
                {galleryPin.city} fotoğrafları
              </h3>
            </div>

            <div className="relative overflow-hidden rounded-[24px] border border-white/10 bg-black/40">
              {previousGalleryImage ? (
                <>
                  <button
                    type="button"
                    onClick={showPreviousImage}
                    className="absolute left-[4.75rem] top-1/2 z-10 h-14 w-14 -translate-y-1/2 overflow-hidden rounded-[14px] border border-white/10 bg-black/55 transition hover:border-white/25"
                    aria-label="Önceki fotoğraf önizlemesi"
                  >
                    <div className="relative h-full w-full">
                      <Image
                        src={previousGalleryImage.image}
                        alt={previousGalleryImage.alt}
                        fill
                        className="object-cover"
                        sizes="56px"
                      />
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={showPreviousImage}
                    className="glow-hover absolute left-4 top-1/2 z-10 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/60 text-2xl text-white/85 transition hover:text-white"
                    aria-label="Önceki fotoğraf"
                  >
                    ‹
                  </button>
                </>
              ) : null}
              {nextGalleryImage ? (
                <>
                  <button
                    type="button"
                    onClick={showNextImage}
                    className="glow-hover absolute right-4 top-1/2 z-10 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/60 text-2xl text-white/85 transition hover:text-white"
                    aria-label="Sonraki fotoğraf"
                  >
                    ›
                  </button>
                  <button
                    type="button"
                    onClick={showNextImage}
                    className="absolute right-[4.75rem] top-1/2 z-10 h-14 w-14 -translate-y-1/2 overflow-hidden rounded-[14px] border border-white/10 bg-black/55 transition hover:border-white/25"
                    aria-label="Sonraki fotoğraf önizlemesi"
                  >
                    <div className="relative h-full w-full">
                      <Image
                        src={nextGalleryImage.image}
                        alt={nextGalleryImage.alt}
                        fill
                        className="object-cover"
                        sizes="56px"
                      />
                    </div>
                  </button>
                </>
              ) : null}
              <div className="flex h-[58vh] w-full items-center justify-center p-2 sm:h-[64vh] sm:p-3">
                <Image
                  src={activeGalleryImage.image}
                  alt={activeGalleryImage.alt}
                  width={1600}
                  height={1600}
                  className="h-full w-full object-contain object-center"
                  sizes="(max-width: 1024px) 100vw, 920px"
                />
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
