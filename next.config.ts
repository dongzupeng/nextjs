import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* 缓存优化配置 */
  images: {
    domains: [], // 允许的图片域名
    minimumCacheTTL: 60 * 60 * 24, // 图片缓存时间（秒）
  },
  /* 静态资产优化 */
  generateBuildId: async () => {
    // 可以使用固定的构建ID，或者基于Git commit hash
    return process.env.BUILD_ID || 'development';
  },
  /* 压缩配置 */
  compress: true,
  /* 实验性特性 */
  experimental: {
    // 启用React Server Components的缓存
    serverActions: {
      bodySizeLimit: '1mb',
      allowedOrigins: ['localhost:3000'],
    },
  },
};

export default nextConfig;
