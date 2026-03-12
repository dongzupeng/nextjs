/**
 * 设置页面布局
 */
import type { Metadata } from 'next';

// 生成动态元数据
export const metadata: Metadata = {
  title: '设置',
  description: '修改个人资料和查看个人内容',
  openGraph: {
    title: '设置',
    description: '修改个人资料和查看个人内容',
    type: 'website',
    url: 'https://fishpondblog.com/settings',
  },
};

// 布局组件
export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
