/**
 * 后台管理首页
 */
import Link from 'next/link';

export default function AdminPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">后台管理</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* 文章管理卡片 */}
        <Link 
          href="/admin/posts"
          className="rounded-lg bg-card p-6 shadow-md transition-all hover:shadow-lg hover:scale-105"
        >
          <h2 className="mb-2 text-xl font-semibold">文章管理</h2>
          <p className="text-muted-foreground">
            创建、编辑和管理博客文章
          </p>
        </Link>
        
        {/* 分类管理卡片 */}
        <Link 
          href="/admin/categories"
          className="rounded-lg bg-card p-6 shadow-md transition-all hover:shadow-lg hover:scale-105"
        >
          <h2 className="mb-2 text-xl font-semibold">分类管理</h2>
          <p className="text-muted-foreground">
            创建、编辑和管理文章分类
          </p>
        </Link>
        
        {/* 标签管理卡片 */}
        <Link 
          href="/admin/tags"
          className="rounded-lg bg-card p-6 shadow-md transition-all hover:shadow-lg hover:scale-105"
        >
          <h2 className="mb-2 text-xl font-semibold">标签管理</h2>
          <p className="text-muted-foreground">
            创建、编辑和管理文章标签
          </p>
        </Link>
      </div>
    </div>
  );
}
