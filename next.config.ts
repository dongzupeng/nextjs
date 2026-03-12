import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* 缓存优化配置 */
  images: {
    // 允许的图片域名
    domains: ['localhost'],
    // 图片缓存时间（秒）- 1小时
    minimumCacheTTL: 3600,
  },
  /* 自定义HTTP头 */
  headers: async () => [
    // 静态资产缓存
    {
      source: '/_next/static/:path*',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=3600, immutable',
        },
      ],
    },
    // 其他静态文件缓存
    {
      source: '/:path*.(js|css|json|ico|png|jpg|jpeg|gif|webp|svg)',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=3600, immutable',
        },
      ],
    },
  ],
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
