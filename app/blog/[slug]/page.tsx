/**
 * 文章详情页面
 * 使用 API 获取数据
 */
'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Post } from '@/types/blog';
import { formatDate } from '@/lib/utils';

export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;
  
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 加载文章
    fetch(`/api/posts/${slug}`)
      .then(res => {
        if (!res.ok) {
          throw new Error('文章不存在');
        }
        return res.json();
      })
      .then(data => {
        setPost(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error('加载文章失败:', err);
        setError(err.message);
        setIsLoading(false);
      });
  }, [slug]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <p className="text-muted-foreground">加载中...</p>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold">文章未找到</h1>
          <p className="mb-4 text-muted-foreground">抱歉，您访问的文章不存在。</p>
          <Link href="/blog" className="text-primary hover:underline">
            返回博客列表
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <article className="mx-auto max-w-3xl">
        {/* 文章标题 */}
        <h1 className="mb-4 text-4xl font-bold">{post.title}</h1>
        
        {/* 文章元信息 */}
        <div className="mb-8 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <span>{post.author.username}</span>
          <span>•</span>
          <span>{formatDate(post.publishedAt)}</span>
          <span>•</span>
          <span>{post.readingTime} 分钟阅读</span>
          {post.views !== undefined && (
            <>
              <span>•</span>
              <span>{post.views} 次阅读</span>
            </>
          )}
        </div>

        {/* 分类和标签 */}
        <div className="mb-8 flex flex-wrap items-center gap-4">
          <Link
            href={`/category/${post.category.slug}`}
            className="rounded-full bg-secondary px-3 py-1 text-sm text-secondary-foreground shadow-sm transition-all hover:bg-secondary/80 hover:shadow-md"
          >
            {post.category.name}
          </Link>
          {post.tags.map((tag) => (
            <Link
              key={tag.id}
              href={`/tag/${tag.slug}`}
              className="rounded-full bg-card px-3 py-1 text-sm shadow-sm transition-all hover:bg-accent hover:shadow-md"
            >
              {tag.name}
            </Link>
          ))}
        </div>

        {/* 文章摘要 */}
        {post.excerpt && (
          <div className="mb-8 rounded-lg bg-gradient-to-r from-primary/10 to-transparent p-4 shadow-md">
            <p className="text-muted-foreground italic">{post.excerpt}</p>
          </div>
        )}

        {/* 文章内容 */}
        <div className="prose prose-lg max-w-none">
          <div className="whitespace-pre-wrap">{post.content}</div>
        </div>

        {/* 返回按钮 */}
        <div className="mt-12">
          <Link
            href="/blog"
            className="rounded-lg bg-card px-4 py-2 shadow-sm transition-all hover:bg-accent hover:shadow-md"
          >
            ← 返回博客列表
          </Link>
        </div>
      </article>
    </div>
  );
}
