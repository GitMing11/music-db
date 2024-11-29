import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,  // 리액트의 잠재적 문제를 빨리 발견
  compiler: {
    styledComponents: true,  // styled-components의 SSR 지원
  },
  webpack: (config, { dev }) => {
    if (dev) {
      // 개발 환경에서만 캐시 비활성화
      config.cache = false;
    }
    return config;
  },
};

export default nextConfig;
