import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "bndaeqkqmtyimbmanubx.supabase.co", 
        pathname: "/storage/v1/object/public/**",
        port: "",
        // کلمه https:// را از اینجا حذف کردم، فقط دامنه خالص باید باشد
      

      },
    ],
  },
  typescript: {
    ignoreBuildErrors: false,
  },
};

export default nextConfig;