import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ['caravan-bucket.s3.us-east-2.amazonaws.com', 'images.unsplash.com'],
  },
};

export default nextConfig;
