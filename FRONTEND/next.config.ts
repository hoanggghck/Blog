import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
    qualities: [50, 60, 70, 80, 90, 100],
    formats: ["image/avif", "image/webp"],
  },
  reactStrictMode: false,
};

export default nextConfig;
