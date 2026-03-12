/**
 * 标签列表页面布局
 */
import type { Metadata } from 'next';

// 生成动态元数据
export const metadata: Metadata = {
  title: '标签',
  description: '浏览所有文章标签',
  openGraph: {
    title: '标签',
    description: '浏览所有文章标签',
    type: 'website',
    url: 'https://fishpondblog.com/tag',
  },
};

// 布局组件
export default function TagLayout({ children }: { children: React.ReactNode }) {
  return children;
}
