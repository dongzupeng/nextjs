/**
 * 首页
 * 使用 API 获取数据
 */
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { siteConfig } from '@/lib/config';
import { Post } from '@/types/blog';
import PostCard from '@/components/blog/PostCard';

export default function Home() {
  const [latestPosts, setLatestPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadLatestPosts = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/posts?limit=3');
      const data = await response.json();
      setLatestPosts(data.posts || []);
    } catch (err) {
      console.error('加载文章失败:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadLatestPosts();
  }, []);

  return (
    <div className="container mx-auto px-4 py-12">
      {/* 欢迎区域 */}
      <section className="mx-auto max-w-3xl text-center">
        <h1 className="mb-4 text-4xl font-bold sm:text-5xl">
          欢迎来到 {siteConfig.name}
        </h1>
        <p className="mb-8 text-lg text-muted-foreground">
          {siteConfig.description}
        </p>
        <div className="flex justify-center gap-4">
          <Link
            href="/blog"
            className="rounded-lg bg-primary px-6 py-3 text-primary-foreground transition-all duration-200 hover:bg-primary/90 hover:shadow-lg"
          >
            浏览博客
          </Link>
          <Link
            href="/admin"
            className="rounded-lg px-6 py-3 transition-all duration-200 hover:bg-accent hover:shadow-lg"
          >
            后台管理
          </Link>
        </div>
      </section>

      {/* 最新文章区域 */}
      <section className="mx-auto mt-16 max-w-6xl">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold">最新文章</h2>
          <Link
            href="/blog"
            className="text-sm text-primary hover:underline"
          >
            查看全部 →
          </Link>
        </div>

        {isLoading ? (
          <div className="text-center">
            <p className="text-muted-foreground">加载中...</p>
          </div>
        ) : latestPosts.length === 0 ? (
          <div className="rounded-lg bg-card p-8 text-center shadow-md">
            <p className="text-muted-foreground">暂无文章</p>
            <p className="mt-2 text-sm">
              访问 <a href="/admin/posts" className="text-primary hover:underline">后台管理</a> 创建新文章
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {latestPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </section>

      {/* 功能介绍区域 */}
      <section className="mx-auto mt-16 max-w-6xl">
        <h2 className="mb-8 text-2xl font-bold text-center">功能特性</h2>
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-lg bg-card p-6 text-center shadow-md transition-shadow hover:shadow-lg">
            <div className="mb-4 text-4xl">✍️</div>
            <h3 className="mb-2 text-lg font-semibold">文章管理</h3>
            <p className="text-sm text-muted-foreground">
              支持创建、编辑、删除文章，数据持久化存储
            </p>
          </div>
          <div className="rounded-lg bg-card p-6 text-center shadow-md transition-shadow hover:shadow-lg">
            <div className="mb-4 text-4xl">🏷️</div>
            <h3 className="mb-2 text-lg font-semibold">分类标签</h3>
            <p className="text-sm text-muted-foreground">
              支持文章分类和标签管理，便于内容组织
            </p>
          </div>
          <div className="rounded-lg bg-card p-6 text-center shadow-md transition-shadow hover:shadow-lg">
            <div className="mb-4 text-4xl">🎨</div>
            <h3 className="mb-2 text-lg font-semibold">主题切换</h3>
            <p className="text-sm text-muted-foreground">
              支持浅色/深色主题切换，适配不同场景
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
