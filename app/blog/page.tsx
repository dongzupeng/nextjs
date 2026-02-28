/**
 * 博客列表页面
 * 使用 API 获取数据
 */
'use client';

import { useState, useEffect } from 'react';
import PostCard from '@/components/blog/PostCard';
import { Post } from '@/types/blog';

export default function BlogPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 加载文章列表
    fetch('/api/posts')
      .then(res => res.json())
      .then(data => {
        setPosts(data.posts || []);
        setIsLoading(false);
      })
      .catch(err => {
        console.error('加载文章失败:', err);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <h1 className="mb-8 text-4xl font-bold">博客</h1>
        <div className="text-center">
          <p className="text-muted-foreground">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="mb-8 text-4xl font-bold">博客</h1>
      {posts.length === 0 ? (
        <div className="text-center text-muted-foreground">
          <p>暂无文章</p>
          <p className="mt-2 text-sm">
            访问 <a href="/admin/posts" className="text-primary hover:underline">后台管理</a> 创建新文章
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
