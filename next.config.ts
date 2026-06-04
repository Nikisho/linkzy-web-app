import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ['wffeinvprpdyobervinr.supabase.co'],
    minimumCacheTTL: 2678400, // 31 days
  },
};

export default nextConfig;
