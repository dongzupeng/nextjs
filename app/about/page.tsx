'use client';

import { useState, useEffect } from 'react';

export default function AboutPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<{ username: string; email: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    try {
      const response = await fetch('/api/auth/me');
      if (response.ok) {
        const data = await response.json();
        setIsLoggedIn(true);
        setUser({
          username: data.user.username,
          email: data.user.email
        });
      }
    } catch (error) {
      setIsLoggedIn(false);
      setUser(null);
    } finally {
      setIsLoading(false);
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

  if (!isLoggedIn) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <article className="mx-auto max-w-3xl">
        <h1 className="mb-8 text-4xl font-bold">关于我</h1>
        <div className="prose prose-lg max-w-none">
          <p>
            你好！我是 {user?.username}，欢迎来到我的个人博客。
          </p>
          <p>
            我的邮箱地址是: {user?.email}
          </p>
          <p>
            这里我会分享关于前端开发、Next.js、React 以及其他技术相关的内容。
          </p>
        </div>
      </article>
    </div>
  );
}
