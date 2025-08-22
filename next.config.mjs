!process.env.SKIP_ENV_VALIDATION && (await import("./src/env.mjs"));

import createMDX from "@next/mdx";

/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"],
};

const withMDX = createMDX({
  extension: /\.(md|mdx)$/,
  // Add markdown plugins here, as desired
});

export default withMDX(nextConfig);
