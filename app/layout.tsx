import type { Metadata } from "next";
import { Manrope, Space_Grotesk } from "next/font/google";
import "./globals.css";

const bodyFont = Manrope({
  variable: "--font-body",
  subsets: ["latin"],
});

const displayFont = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
});

const siteUrl = "https://egebicakci.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Ege Bıçakcı | Seyahat, İçerik ve Dijital Kimlik",
    template: "%s | Ege Bıçakcı",
  },
  description:
    "Ege Bıçakcı için hazırlanan, seyahat anıları, etkileşimli 3D küre, galeri ve Instagram entegrasyonu içeren karanlık temalı kişisel web sitesi.",
  keywords: [
    "Ege Bıçakcı",
    "kişisel web sitesi",
    "seyahat sitesi",
    "içerik üretici",
    "etkileşimli küre",
    "Instagram entegrasyonu",
  ],
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    title: "Ege Bıçakcı",
    description:
      "Seyahat hikayeleri, galeri bölümü ve güçlü bir dijital duruş sunan sinematik kişisel site deneyimi.",
    url: siteUrl,
    siteName: "egebicakci.com",
    locale: "tr_TR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ege Bıçakcı",
    description:
      "Seyahat, içerik üretimi ve premium karanlık arayüzü bir araya getiren kişisel web sitesi.",
  },
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className={`${bodyFont.variable} ${displayFont.variable}`}>
      <body>{children}</body>
    </html>
  );
}
