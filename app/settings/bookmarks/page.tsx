/**
 * 我的收藏页面
 */
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import PostCard from '@/components/blog/PostCard';
import { Post } from '@/types/blog';

export default function BookmarksPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  // 加载收藏文章
  useEffect(() => {
    loadBookmarkedPosts();
  }, [pagination.page]);

  const loadBookmarkedPosts = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/users/bookmarks?page=${pagination.page}&limit=${pagination.limit}`);
      
      if (!response.ok) {
        if (response.status === 401) {
          router.push('/login');
          return;
        }
        throw new Error('获取收藏列表失败');
      }
      
      const data = await response.json();
      setPosts(data.posts);
      setPagination({
        page: data.pagination.page,
        limit: data.pagination.limit,
        total: data.pagination.total,
        totalPages: data.pagination.totalPages,
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // 处理页码切换
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= pagination.totalPages) {
      setPagination(prev => ({ ...prev, page }));
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">加载中...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">我的收藏</h1>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-destructive/10 p-4 text-destructive shadow-md">
          {error}
        </div>
      )}

      {posts.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="mb-4 text-xl font-medium">还没有收藏的文章</h2>
          <p className="mb-6 text-muted-foreground">去浏览文章并收藏吧！</p>
          <Link
            href="/blog"
            className="rounded-lg bg-primary px-6 py-2 text-primary-foreground shadow-sm transition-all hover:bg-primary/90 hover:shadow-md"
          >
            去浏览文章
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>

          {/* 分页 */}
          {pagination.totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-2">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="rounded-lg bg-card px-3 py-1 shadow-sm transition-all hover:bg-accent hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                上一页
              </button>
              
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`rounded-lg px-3 py-1 transition-all ${pagination.page === page ? 'bg-primary text-primary-foreground shadow-md' : 'bg-card shadow-sm hover:bg-accent hover:shadow-md'}`}
                >
                  {page}
                </button>
              ))}
              
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
                className="rounded-lg bg-card px-3 py-1 shadow-sm transition-all hover:bg-accent hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                下一页
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
