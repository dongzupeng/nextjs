/**
 * 关于页面布局
 */
import type { Metadata } from 'next';

// 生成动态元数据
export const metadata: Metadata = {
  title: '关于我',
  description: '关于博客作者的信息',
  openGraph: {
    title: '关于我',
    description: '关于博客作者的信息',
    type: 'website',
    url: 'https://fishpondblog.com/about',
  },
};

// 布局组件
export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
