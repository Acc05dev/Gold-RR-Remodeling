import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [390, 640, 828, 1080, 1280, 1536],
    imageSizes: [96, 160, 240, 320, 480],
    qualities: [60, 75, 82],
  },
  experimental: {
    serverActions: { bodySizeLimit: "6mb" },
  },
  // Files the OG image route reads from disk at request time
  outputFileTracingIncludes: {
    "/og": ["./assets/fonts/*", "./public/brand/logo-dark.svg"],
  },
  async headers() {
    return [
      {
        source: "/media/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
