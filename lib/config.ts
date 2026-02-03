export interface SiteConfig {
  name: string;
  description: string;
  url: string;
  ogImage: string;
  links: {
    github?: string;
    twitter?: string;
    linkedin?: string;
  };
  author: {
    name: string;
    email: string;
  };
}

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
