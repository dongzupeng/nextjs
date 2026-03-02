/**
 * 文章管理列表页面
 * 使用API获取数据
 */
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Post } from '@/types/blog';

export default function PostsManagementPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [currentUser, setCurrentUser] = useState<{ id: number; username: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // 加载文章列表和用户信息
  useEffect(() => {
    Promise.all([loadPosts(), loadCurrentUser()])
      .finally(() => setIsLoading(false));
  }, []);

  const loadCurrentUser = async () => {
    try {
      const response = await fetch('/api/auth/me');
      if (response.ok) {
        const data = await response.json();
        setCurrentUser(data.user);
      }
    } catch (error) {
      console.error('获取用户信息失败:', error);
    }
  };

  const loadPosts = async () => {
    try {
      const response = await fetch('/api/posts');
      if (!response.ok) {
        throw new Error('获取文章列表失败');
      }
      const data = await response.json();
      setPosts(data.posts || []);
    } catch (err: any) {
      setError(err.message);
    }
  };

  // 删除文章
  const handleDelete = async (id: number) => {
    if (confirm('确定要删除这篇文章吗？')) {
      try {
        const response = await fetch(`/api/posts/${id}`, {
          method: 'DELETE',
        });
        
        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || '删除文章失败');
        }
        
        loadPosts();
      } catch (err: any) {
        alert(err.message);
      }
    }
  };

  // 格式化日期
  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    return d.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  // 检查是否为文章作者
  const isAuthor = (post: Post) => {
    return currentUser && post.authorId === currentUser.id;
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
        <h1 className="text-3xl font-bold">文章管理</h1>
        <Link
          href="/admin/posts/new"
          className="rounded-lg bg-primary px-4 py-2 text-primary-foreground transition-colors hover:bg-primary/90"
        >
          新建文章
        </Link>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-destructive/10 p-4 text-destructive">
          {error}
        </div>
      )}

      {posts.length === 0 ? (
        <div className="rounded-lg bg-card p-8 text-center shadow-md">
          <p className="text-muted-foreground">暂无文章，点击上方按钮创建新文章</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg shadow-lg">
          <table className="w-full">
            <thead className="bg-muted shadow-sm">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium">标题</th>
                <th className="px-4 py-3 text-left text-sm font-medium">作者</th>
                <th className="px-4 py-3 text-left text-sm font-medium">分类</th>
                <th className="px-4 py-3 text-left text-sm font-medium">发布时间</th>
                <th className="px-4 py-3 text-left text-sm font-medium">操作</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post: Post) => (
                <tr key={post.id} className="bg-card transition-colors hover:bg-accent/50">
                  <td className="px-4 py-3">
                    <div>
                      <div className="font-medium">{post.title}</div>
                      <div className="text-sm text-muted-foreground">{post.slug}</div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-medium text-primary">{post.author.username}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-secondary px-2 py-1 text-xs shadow-sm">
                      {post.category.name}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    {formatDate(post.publishedAt)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      {isAuthor(post) && (
                        <Link
                          href={`/admin/posts/edit/${post.id}`}
                          className="rounded px-3 py-1 text-sm transition-all hover:bg-accent hover:shadow-md"
                        >
                          编辑
                        </Link>
                      )}
                      {isAuthor(post) && (
                        <button
                          onClick={() => handleDelete(post.id)}
                          className="rounded px-3 py-1 text-sm text-destructive transition-all hover:bg-destructive/10 hover:shadow-md"
                        >
                          删除
                        </button>
                      )}
                      {!isAuthor(post) && (
                        <span className="text-sm text-muted-foreground">无权限</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
