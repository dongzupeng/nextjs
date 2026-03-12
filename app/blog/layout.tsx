/**
 * 博客列表页面布局
 */
import type { Metadata } from 'next';

// 生成动态元数据
export const metadata: Metadata = {
  title: '博客',
  description: '浏览所有博客文章',
  openGraph: {
    title: '博客',
    description: '浏览所有博客文章',
    type: 'website',
    url: 'https://fishpondblog.com/blog',
  },
};

// 布局组件
export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children;
}
