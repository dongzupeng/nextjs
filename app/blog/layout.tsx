/**
 * 博客列表页面布局
 */
import type { Metadata, ResolvingMetadata } from 'next';
import { siteConfig } from '@/lib/config';

// 生成博客列表页面元数据
export async function generateMetadata(
  _: unknown,
  parent: ResolvingMetadata
): Promise<Metadata> {
  return {
    title: '博客',
    description: '查看所有博客文章，包括技术、生活、随笔等分类',
    openGraph: {
      title: '博客 | ' + siteConfig.name,
      description: '查看所有博客文章，包括技术、生活、随笔等分类',
      type: 'website',
      url: `${siteConfig.url}/blog`,
      siteName: siteConfig.name,
    },
  };
}

// 布局组件
export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children;
}
