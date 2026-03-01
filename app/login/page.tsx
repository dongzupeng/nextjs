/**
 * 登录页面
 */
'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/admin/posts';
  
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '登录失败');
      }

      console.log('登录成功，准备跳转到:', redirect);
      
      // 延迟跳转，确保 cookie 已设置
      setTimeout(() => {
        window.location.href = redirect;
      }, 100);
    } catch (err: any) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">登录</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            欢迎回来，请登录您的账户
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="rounded-lg bg-destructive/10 p-4 text-sm text-destructive shadow-md">
              {error}
            </div>
          )}

          <div>
            <label className="mb-2 block text-sm font-medium">
              用户名/邮箱
            </label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              className="w-full rounded-lg bg-background px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary transition-shadow hover:shadow-md"
              placeholder="请输入用户名或邮箱"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              密码
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="w-full rounded-lg bg-background px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary transition-shadow hover:shadow-md"
              placeholder="请输入密码"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-lg bg-primary px-4 py-2 text-primary-foreground transition-all duration-200 hover:bg-primary/90 hover:shadow-lg disabled:opacity-50"
          >
            {isLoading ? '登录中...' : '登录'}
          </button>

          <div className="text-center text-sm">
            <span className="text-muted-foreground">还没有账户？</span>
            <Link
              href="/register"
              className="ml-2 text-primary hover:underline"
            >
              立即注册
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
