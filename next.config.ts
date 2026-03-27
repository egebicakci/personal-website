import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "scontent.cdninstagram.com",
      },
      {
        protocol: "https",
        hostname: "lookaside.instagram.com",
      },
      {
        protocol: "https",
        hostname: "instagram.fist6-1.fna.fbcdn.net",
      },
    ],
  },
};

export default nextConfig;
