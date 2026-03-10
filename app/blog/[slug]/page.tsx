/**
 * 文章详情页面
 * 使用 API 获取数据
 */
'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import MarkdownRenderer from '@/components/blog/MarkdownRenderer';
import { Post } from '@/types/blog';
import { formatDate } from '@/lib/utils';

export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;
  
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // 点赞和收藏状态
  const [likeCount, setLikeCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const [bookmarkCount, setBookmarkCount] = useState(0);
  const [bookmarked, setBookmarked] = useState(false);
  const [isLoadingInteraction, setIsLoadingInteraction] = useState(false);

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

  // 加载点赞和收藏信息
  useEffect(() => {
    if (post) {
      // 加载点赞信息
      fetch(`/api/posts/${post.id}/like`)
        .then(res => res.json())
        .then(data => {
          setLikeCount(data.likeCount);
          setLiked(data.liked);
        })
        .catch(err => console.error('加载点赞信息失败:', err));

      // 加载收藏信息
      fetch(`/api/posts/${post.id}/bookmark`)
        .then(res => res.json())
        .then(data => {
          setBookmarkCount(data.bookmarkCount);
          setBookmarked(data.bookmarked);
        })
        .catch(err => console.error('加载收藏信息失败:', err));
    }
  }, [post]);

  // 处理点赞
  const handleLike = async () => {
    if (!post || isLoadingInteraction) return;

    setIsLoadingInteraction(true);
    try {
      const response = await fetch(`/api/posts/${post.id}/like`, {
        method: 'POST',
      });
      const data = await response.json();

      if (response.ok) {
        setLiked(data.liked);
        setLikeCount(prev => data.liked ? prev + 1 : prev - 1);
      } else {
        // 未登录，跳转到登录页
        if (data.error === '未登录') {
          window.location.href = `/login?redirect=/blog/${slug}`;
        }
      }
    } catch (error) {
      console.error('点赞操作失败:', error);
    } finally {
      setIsLoadingInteraction(false);
    }
  };

  // 处理收藏
  const handleBookmark = async () => {
    if (!post || isLoadingInteraction) return;

    setIsLoadingInteraction(true);
    try {
      const response = await fetch(`/api/posts/${post.id}/bookmark`, {
        method: 'POST',
      });
      const data = await response.json();

      if (response.ok) {
        setBookmarked(data.bookmarked);
        setBookmarkCount(prev => data.bookmarked ? prev + 1 : prev - 1);
      } else {
        // 未登录，跳转到登录页
        if (data.error === '未登录') {
          window.location.href = `/login?redirect=/blog/${slug}`;
        }
      }
    } catch (error) {
      console.error('收藏操作失败:', error);
    } finally {
      setIsLoadingInteraction(false);
    }
  };

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
        {/* 封面图片 */}
        {post.coverImage && (
          <div className="mb-8 rounded-lg overflow-hidden shadow-lg">
            <img 
              src={post.coverImage} 
              alt={post.title} 
              className="w-full h-auto object-cover"
            />
          </div>
        )}
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
        <MarkdownRenderer content={post.content} />

        {/* 点赞和收藏按钮 */}
        <div className="mt-8 flex items-center gap-6">
          <button
            onClick={handleLike}
            disabled={isLoadingInteraction}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 transition-all ${liked ? 'bg-primary text-primary-foreground shadow-md' : 'bg-card shadow-sm hover:bg-accent hover:shadow-md'}`}
          >
            <span>{liked ? '❤️' : '🤍'}</span>
            <span>{likeCount}</span>
            <span>{liked ? '已点赞' : '点赞'}</span>
          </button>
          <button
            onClick={handleBookmark}
            disabled={isLoadingInteraction}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 transition-all ${bookmarked ? 'bg-primary text-primary-foreground shadow-md' : 'bg-card shadow-sm hover:bg-accent hover:shadow-md'}`}
          >
            <span>{bookmarked ? '⭐' : '☆'}</span>
            <span>{bookmarkCount}</span>
            <span>{bookmarked ? '已收藏' : '收藏'}</span>
          </button>
        </div>

        {/* 返回按钮 */}
        <div className="mt-8">
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
