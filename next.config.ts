import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {hostname:'web.komdigi.go.id'},
      {hostname:'upload.wikimedia.org'}
    ]
  }
};

export default nextConfig;
