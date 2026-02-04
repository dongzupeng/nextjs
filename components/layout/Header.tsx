/**
 * 页面头部组件
 */
import Link from 'next/link';
import { siteConfig } from '@/lib/config';

/**
 * 头部组件，包含站点标题和导航链接
 */
export default function Header() {
  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* 站点标题 */}
          <Link href="/" className="text-2xl font-bold">
            {siteConfig.name}
          </Link>
          
          {/* 导航菜单 */}
          <nav className="flex items-center gap-6">
            <Link href="/" className="text-sm font-medium hover:text-primary">
              首页
            </Link>
            <Link href="/blog" className="text-sm font-medium hover:text-primary">
              博客
            </Link>
            <Link href="/category" className="text-sm font-medium hover:text-primary">
              分类
            </Link>
            <Link href="/tag" className="text-sm font-medium hover:text-primary">
              标签
            </Link>
            <Link href="/about" className="text-sm font-medium hover:text-primary">
              关于
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
