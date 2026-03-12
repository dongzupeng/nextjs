/**
 * 我的收藏页面布局
 */
import type { Metadata } from 'next';

// 生成动态元数据
export const metadata: Metadata = {
  title: '我的收藏',
  description: '查看我收藏的文章',
  openGraph: {
    title: '我的收藏',
    description: '查看我收藏的文章',
    type: 'website',
    url: 'https://fishpondblog.com/settings/bookmarks',
  },
};

// 布局组件
export default function BookmarksLayout({ children }: { children: React.ReactNode }) {
  return children;
}
