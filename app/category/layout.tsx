/**
 * 分类列表页面布局
 */
import type { Metadata } from 'next';

// 生成动态元数据
export const metadata: Metadata = {
  title: '分类',
  description: '浏览所有文章分类',
  openGraph: {
    title: '分类',
    description: '浏览所有文章分类',
    type: 'website',
    url: 'https://fishpondblog.com/category',
  },
};

// 布局组件
export default function CategoryLayout({ children }: { children: React.ReactNode }) {
  return children;
}
