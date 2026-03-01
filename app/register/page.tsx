/**
 * 注册页面
 */
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // 验证密码
    if (formData.password !== formData.confirmPassword) {
      setError('两次输入的密码不一致');
      return;
    }

    if (formData.password.length < 6) {
      setError('密码长度至少6位');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '注册失败');
      }

      router.push('/login?registered=true');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">注册</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            创建一个新账户开始使用
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
              用户名
            </label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              className="w-full rounded-lg bg-background px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary transition-shadow hover:shadow-md"
              placeholder="请输入用户名"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              邮箱
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full rounded-lg bg-background px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary transition-shadow hover:shadow-md"
              placeholder="请输入邮箱"
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
              placeholder="请输入密码（至少6位）"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              确认密码
            </label>
            <input
              type="password"
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
              className="w-full rounded-lg bg-background px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary transition-shadow hover:shadow-md"
              placeholder="请再次输入密码"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-lg bg-primary px-4 py-2 text-primary-foreground transition-all duration-200 hover:bg-primary/90 hover:shadow-lg disabled:opacity-50"
          >
            {isLoading ? '注册中...' : '注册'}
          </button>

          <div className="text-center text-sm">
            <span className="text-muted-foreground">已有账户？</span>
            <Link
              href="/login"
              className="ml-2 text-primary hover:underline"
            >
              立即登录
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
