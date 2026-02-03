import Link from 'next/link';
import { siteConfig } from '@/lib/config';

export default function Header() {
  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold">
            {siteConfig.name}
          </Link>
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
