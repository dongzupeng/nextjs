/**
 * 分类详情页面
 * 使用 API 获取数据
 */
'use client';

import { useState, useEffect } from 'react';
import { useParams, notFound } from 'next/navigation';
import { Post, Category } from '@/types/blog';
import PostListItem from '@/components/blog/PostListItem';

export default function CategoryDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  
  const [category, setCategory] = useState<Category | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 加载分类和文章
    Promise.all([
      fetch('/api/categories').then(res => res.json()),
      fetch(`/api/posts?category=${slug}`).then(res => res.json()),
    ])
      .then(([categoriesData, postsData]) => {
        const foundCategory = categoriesData.categories?.find((c: Category) => c.slug === slug);
        setCategory(foundCategory || null);
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

  if (!category) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="mb-8 text-4xl font-bold">{category.name}</h1>
      {posts.length === 0 ? (
        <div className="text-center text-muted-foreground">
          <p>该分类下暂无文章</p>
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
