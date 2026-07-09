import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  transpilePackages: ["@stadiummind/shared"],
  outputFileTracingRoot: path.join(process.cwd(), "..")
};

export default nextConfig;
