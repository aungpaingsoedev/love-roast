import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Docker image needs standalone; Vercel uses its own Next.js runtime
  ...(process.env.DOCKER === "1" ? { output: "standalone" as const } : {}),
};

export default nextConfig;
