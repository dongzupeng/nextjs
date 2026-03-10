/**
 * 用户设置页面
 */
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // 表单状态
  const [formData, setFormData] = useState({
    username: '',
    avatar: '',
  });
  
  // 头像预览
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  // 上传状态
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // 加载用户信息
  useEffect(() => {
    loadUserInfo();
  }, []);

  const loadUserInfo = async () => {
    try {
      const response = await fetch('/api/users/settings');
      if (!response.ok) {
        if (response.status === 401) {
          router.push('/login');
          return;
        }
        throw new Error('获取用户信息失败');
      }
      const data = await response.json();
      setUser(data.user);
      setFormData({
        username: data.user.username,
        avatar: data.user.avatar || '',
      });
      setAvatarPreview(data.user.avatar || null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // 处理文件上传
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '上传失败');
      }

      setFormData(prev => ({ ...prev, avatar: data.url }));
      setAvatarPreview(data.url);
    } catch (err: any) {
      setUploadError(err.message);
    } finally {
      setIsUploading(false);
    }
  };

  // 处理表单提交
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.username) {
      setError('用户名不能为空');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/users/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '更新设置失败');
      }

      setUser(data.user);
      setSuccess('设置更新成功');
      
      // 3秒后清除成功提示
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">加载中...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold">用户信息不存在</h1>
          <p className="mb-4 text-muted-foreground">请重新登录</p>
          <Link href="/login" className="text-primary hover:underline">
            去登录
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">用户设置</h1>
        <Link
          href="/"
          className="rounded-lg bg-card px-4 py-2 shadow-sm transition-all hover:bg-accent hover:shadow-md"
        >
          返回首页
        </Link>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-destructive/10 p-4 text-destructive shadow-md">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 rounded-lg bg-success/10 p-4 text-success shadow-md">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 头像设置 */}
        <div>
          <label className="mb-2 block text-sm font-medium">头像</label>
          <div className="space-y-2">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              disabled={isUploading}
              className="w-full rounded-lg bg-background px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary transition-shadow hover:shadow-md"
            />
            {isUploading && (
              <div className="text-sm text-muted-foreground">上传中...</div>
            )}
            {uploadError && (
              <div className="text-sm text-destructive">{uploadError}</div>
            )}
            <div className="mt-4 flex items-center gap-4">
              <div className="relative h-20 w-20 rounded-full overflow-hidden shadow-md">
                {avatarPreview ? (
                  <img 
                    src={avatarPreview} 
                    alt="头像预览" 
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-secondary text-secondary-foreground">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div>
                <p className="text-sm text-muted-foreground">点击上传头像</p>
                <p className="text-xs text-muted-foreground">支持 JPG、PNG、GIF 格式，最大 5MB</p>
              </div>
            </div>
          </div>
        </div>

        {/* 用户名 */}
        <div>
          <label className="mb-2 block text-sm font-medium">
            用户名 <span className="text-destructive">*</span>
          </label>
          <input
            type="text"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            className="w-full rounded-lg bg-background px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary transition-shadow hover:shadow-md"
            placeholder="请输入用户名"
            required
          />
        </div>

        {/* 邮箱（只读） */}
        <div>
          <label className="mb-2 block text-sm font-medium">邮箱</label>
          <input
            type="email"
            value={user.email}
            readOnly
            className="w-full rounded-lg bg-muted px-4 py-2 shadow-sm text-muted-foreground cursor-not-allowed"
            disabled
          />
        </div>

        {/* 注册时间 */}
        <div>
          <label className="mb-2 block text-sm font-medium">注册时间</label>
          <input
            type="text"
            value={new Date(user.createdAt).toLocaleString()}
            readOnly
            className="w-full rounded-lg bg-muted px-4 py-2 shadow-sm text-muted-foreground cursor-not-allowed"
            disabled
          />
        </div>

        {/* 提交按钮 */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-lg bg-primary px-6 py-2 text-primary-foreground shadow-sm transition-all hover:bg-primary/90 hover:shadow-md disabled:opacity-50"
          >
            {isSubmitting ? '保存中...' : '保存设置'}
          </button>
          <Link
            href="/"
            className="rounded-lg bg-card px-6 py-2 shadow-sm transition-all hover:bg-accent hover:shadow-md"
          >
            取消
          </Link>
        </div>
      </form>
    </div>
  );
}
