import Image from "next/image";
import type { CSSProperties } from "react";
import { Sparkles } from "lucide-react";

type BrandIconProps = {
  platform: string;
  className?: string;
};

type BrandTheme = {
  glow: string;
  image: string;
  alt: string;
  background: string;
  imageClassName?: string;
};

const brandThemes: Record<string, BrandTheme> = {
  kick: {
    glow: "#39ff14",
    image: "/images/social/kick.avif",
    alt: "Kick",
    background: "#10130d",
    imageClassName: "object-cover",
  },
  facebook: {
    glow: "#1877f2",
    image: "/images/social/facebook.webp",
    alt: "Facebook",
    background: "#0d1b33",
    imageClassName: "object-cover",
  },
  x: {
    glow: "#f5f5f5",
    image: "/images/social/x.avif",
    alt: "X",
    background: "#050505",
    imageClassName: "object-cover",
  },
  discord: {
    glow: "#8ea1ff",
    image: "/images/social/discord.webp",
    alt: "Discord",
    background: "#1a1f3d",
    imageClassName: "object-cover",
  },
  steam: {
    glow: "#66c0f4",
    image: "/images/social/steam.jpg",
    alt: "Steam",
    background: "#0b131c",
    imageClassName: "object-cover",
  },
  spotify: {
    glow: "#1db954",
    image: "/images/social/spotify.png",
    alt: "Spotify",
    background: "#08140d",
    imageClassName: "object-contain p-1.5",
  },
  instagram: {
    glow: "#833ab4",
    image: "/images/social/instagram.jpg",
    alt: "Instagram",
    background: "#22111d",
    imageClassName: "object-cover",
  },
};

export function getBrandTheme(platform: string) {
  return (
    brandThemes[platform] ?? {
      glow: "#ff5e00",
      image: "",
      alt: platform,
      background: "#111318",
    }
  );
}

export function BrandIcon({ platform, className }: BrandIconProps) {
  const theme = getBrandTheme(platform);

  if (!theme.image) {
    return <Sparkles className={className ?? "h-8 w-8"} strokeWidth={1.8} />;
  }

  return (
    <div
      className={`relative h-full w-full ${className ?? ""}`}
      style={{ backgroundColor: theme.background } as CSSProperties}
    >
      <Image
        src={theme.image}
        alt={theme.alt}
        fill
        className={theme.imageClassName ?? "object-cover"}
        sizes="80px"
      />
    </div>
  );
}
