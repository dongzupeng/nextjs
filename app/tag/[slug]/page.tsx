/**
 * 标签详情页面
 * 使用 API 获取数据
 */
'use client';

import { useState, useEffect } from 'react';
import { useParams, notFound } from 'next/navigation';
import { Post, Tag } from '@/types/blog';
import PostListItem from '@/components/blog/PostListItem';

export default function TagDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  
  const [tag, setTag] = useState<Tag | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 加载标签和文章
    Promise.all([
      fetch('/api/tags').then(res => res.json()),
      fetch(`/api/posts?tag=${slug}`).then(res => res.json()),
    ])
      .then(([tagsData, postsData]) => {
        const foundTag = tagsData.tags?.find((t: Tag) => t.slug === slug);
        setTag(foundTag || null);
        setPosts(postsData.posts || []);
        setIsLoading(false);
      })
      .catch(err => {
        console.error('加载数据失败:', err);
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

  if (!tag) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="mb-8 text-4xl font-bold">{tag.name}</h1>
      {posts.length === 0 ? (
        <div className="text-center text-muted-foreground">
          <p>该标签下暂无文章</p>
        </div>
      ) : (
        <div className="mx-auto max-w-3xl">
          {posts.map((post) => (
            <PostListItem key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
