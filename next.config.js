/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    // Photos are resized ahead of time by scripts/optimize-images.mjs and
    // picked per screen size by lib/imageLoader.js — no paid image service
    // and nothing counted against Vercel's image-optimization quota.
    loader: "custom",
    loaderFile: "./lib/imageLoader.js",
    deviceSizes: [640, 1280],
    imageSizes: [320],
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "**.githubusercontent.com" }
    ]
  },
  experimental: {
    optimizePackageImports: []
  }
};

module.exports = nextConfig;
