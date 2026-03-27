"use client";

import type { CSSProperties } from "react";
import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

export function SiteAudioPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [buttonPosition, setButtonPosition] = useState({ top: 24, right: 24 });

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const moveButton = () => {
    if (typeof window === "undefined") return;

    const buttonSize = 44;
    const padding = 16;
    const cornerOffset = 72;
    const maxRight = Math.max(padding, window.innerWidth - buttonSize - padding);
    const maxTop = Math.max(padding, window.innerHeight - buttonSize - padding);

    const corners = [
      { top: padding, right: padding },
      { top: padding, right: Math.max(padding, maxRight - cornerOffset) },
      { top: Math.max(padding, maxTop - cornerOffset), right: padding },
      {
        top: Math.max(padding, maxTop - cornerOffset),
        right: Math.max(padding, maxRight - cornerOffset),
      },
    ];

    const nextCorner = corners[Math.floor(Math.random() * corners.length)];

    setButtonPosition(nextCorner);
  };

  useEffect(() => {
    if (!hasMounted || !audioRef.current) return;

    const audio = audioRef.current;
    audio.volume = 0.45;
    audio.muted = isMuted;

    const tryPlay = async () => {
      try {
        await audio.play();
        setIsPlaying(true);
      } catch {
        setIsPlaying(false);
      }
    };

    void tryPlay();
  }, [hasMounted, isMuted]);

  useEffect(() => {
    if (!hasMounted || !audioRef.current) return;

    const audio = audioRef.current;

    const tryResumePlayback = async () => {
      if (audio.muted) return;

      try {
        await audio.play();
        setIsPlaying(true);
      } catch {
        setIsPlaying(false);
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        void tryResumePlayback();
      }
    };

    const handleFirstInteraction = () => {
      void tryResumePlayback();
    };

    window.addEventListener("pointerdown", handleFirstInteraction, { passive: true });
    window.addEventListener("keydown", handleFirstInteraction);
    window.addEventListener("focus", handleFirstInteraction);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("pointerdown", handleFirstInteraction);
      window.removeEventListener("keydown", handleFirstInteraction);
      window.removeEventListener("focus", handleFirstInteraction);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [hasMounted]);

  const escapeMuteAttempt = async () => {
    moveButton();

    if (!audioRef.current) return;

    audioRef.current.muted = false;

    try {
      await audioRef.current.play();
      setIsMuted(false);
      setIsPlaying(true);
    } catch {
      setIsMuted(false);
      setIsPlaying(false);
    }
  };

  if (!hasMounted) {
    return null;
  }

  return (
    <>
      <audio
        ref={audioRef}
        src="/audio/hero-loop.mp3"
        loop
        playsInline
        autoPlay
        preload="auto"
        aria-hidden="true"
      />

      <button
        type="button"
        onClick={escapeMuteAttempt}
        onMouseEnter={moveButton}
        onPointerDown={escapeMuteAttempt}
        onTouchStart={escapeMuteAttempt}
        className="glow-hover fixed z-[140] inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-[rgba(9,12,18,0.72)] text-white/80 backdrop-blur-xl transition hover:text-white"
        style={
          {
            "--hover-glow": "#4da3ff",
            top: `${buttonPosition.top}px`,
            right: `${buttonPosition.right}px`,
          } as CSSProperties
        }
        aria-label={isMuted || !isPlaying ? "Sesi aç" : "Sesi kapat"}
        title={isMuted || !isPlaying ? "Sesi aç" : "Sesi kapat"}
      >
        {isMuted || !isPlaying ? (
          <VolumeX className="h-4 w-4" />
        ) : (
          <Volume2 className="h-4 w-4" />
        )}
      </button>
    </>
  );
}
