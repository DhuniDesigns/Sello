import type { NextConfig } from "next";

// On GitHub Pages the site lives at /sello, so every path needs that prefix.
const basePath = process.env.GITHUB_PAGES === "true" ? "/sello" : "";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath,
  images: { unoptimized: true },
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
};

export default nextConfig;
