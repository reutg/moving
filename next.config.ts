import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // better-sqlite3 is a native module; keep it out of webpack bundling on the server.
  serverExternalPackages: ["better-sqlite3"],
};

export default nextConfig;
