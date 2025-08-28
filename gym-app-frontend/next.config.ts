import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  images: {
    domains: [
      "gym-project-3m9w.onrender.com", // Production
      "localhost", // Développement local
    ],
  },
};

export default nextConfig;
