/**
 * 站点配置类型定义
 */
export interface SiteConfig {
  name: string;             // 站点名称
  description: string;      // 站点描述
  url: string;              // 站点URL
  ogImage: string;          // 社交媒体预览图片
  links: {
    github?: string;        // GitHub链接（可选）
    twitter?: string;       // Twitter链接（可选）
    linkedin?: string;      // LinkedIn链接（可选）
  };
  author: {
    name: string;           // 作者名称
    email: string;          // 作者邮箱
  };
}

/**
 * 站点配置实例
 */
export const siteConfig: SiteConfig = {
  name: 'My Blog',
  description: 'A personal blog built with Next.js',
  url: 'https://yourdomain.com',
  ogImage: '/og-image.png',
  links: {
    github: 'https://github.com/yourusername',
    twitter: 'https://twitter.com/yourusername',
  },
  author: {
    name: 'Your Name',
    email: 'your.email@example.com',
  },
};
