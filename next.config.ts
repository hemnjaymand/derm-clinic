import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        // کلمه https:// را از اینجا حذف کردم، فقط دامنه خالص باید باشد
        hostname: "bndaeqkqmtyimbmanubx.supabase.co", 
        port: "",
        pathname: "/**",
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: false,
  },
};

export default nextConfig;