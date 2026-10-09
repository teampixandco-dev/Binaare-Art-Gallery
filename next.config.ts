import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  distDir: process.env.BINAARE_DIST_DIR || ".next",
  devIndicators: false,
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
    formats: ["image/avif", "image/webp"],
    dangerouslyAllowSVG: true,
    contentDispositionType: "inline",
  },
  experimental: {
    workerThreads: false,
    cpus: 1,
    optimizePackageImports: ["framer-motion", "lucide-react", "gsap"],
  },
  async headers() {
    return [
      {
        source: "/:path*.(mp4|webm|png|jpg|jpeg|webp|avif|svg|woff2)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
