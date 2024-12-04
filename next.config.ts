import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true, // React Strict Mode 활성화
  env: {
    JWT_SECRET: process.env.JWT_SECRET,
  },
  // appDir: true,  // app 디렉토리 기반 라우팅을 활성화
};

export default nextConfig;