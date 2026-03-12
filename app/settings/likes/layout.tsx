/**
 * 我的点赞页面布局
 */
import type { Metadata } from 'next';

// 生成动态元数据
export const metadata: Metadata = {
  title: '我的点赞',
  description: '查看我点赞的文章',
  openGraph: {
    title: '我的点赞',
    description: '查看我点赞的文章',
    type: 'website',
    url: 'https://fishpondblog.com/settings/likes',
  },
};

// 布局组件
export default function LikesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
