/** @type {import('next').NextConfig} */
const nextConfig = {
  // Import TypeScript source directly from workspace packages.
  transpilePackages: ["@id/core", "@id/convex"],
};

export default nextConfig;
