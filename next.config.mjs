!process.env.SKIP_ENV_VALIDATION && (await import("./src/env.mjs"));

/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"],
};

export default nextConfig;
