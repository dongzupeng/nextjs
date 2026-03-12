/**
 * 首页布局
 */
import type { Metadata, ResolvingMetadata } from 'next';
import { siteConfig } from '@/lib/config';

// 生成首页元数据
export async function generateMetadata(
  _: unknown,
  parent: ResolvingMetadata
): Promise<Metadata> {
  return {
    title: siteConfig.name,
    description: siteConfig.description,
    openGraph: {
      title: siteConfig.name,
      description: siteConfig.description,
      type: 'website',
      url: siteConfig.url,
      images: [
        {
          url: siteConfig.ogImage,
          width: 1200,
          height: 630,
          alt: siteConfig.name,
        },
      ],
      siteName: siteConfig.name,
    },
  };
}

// 布局组件
export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return children;
}
