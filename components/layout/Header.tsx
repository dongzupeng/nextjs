/**
 * 页面头部组件
 */
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { siteConfig } from '@/lib/config';
import { getTheme, setTheme, initTheme } from '@/lib/theme';

/**
 * 头部组件，包含站点标题和导航链接
 */
export default function Header() {
  const router = useRouter();
  // 初始状态设置为'system'，与服务器端保持一致
  const [theme, setCurrentTheme] = useState<'light' | 'dark' | 'system'>('system');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // 客户端初始化
  useEffect(() => {
    // 获取实际的主题设置
    const actualTheme = getTheme();
    setCurrentTheme(actualTheme);
    initTheme();

    // 检查登录状态
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    try {
      const response = await fetch('/api/auth/me');
      if (response.ok) {
        const data = await response.json();
        setIsLoggedIn(true);
        setUsername(data.user.username);
      }
    } catch (error) {
      setIsLoggedIn(false);
    }
  };

  // 处理主题切换
  const handleThemeToggle = () => {
    const themes: Array<'light' | 'dark' | 'system'> = ['light', 'dark', 'system'];
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    const nextTheme = themes[nextIndex];
    
    setTheme(nextTheme);
    setCurrentTheme(nextTheme);
  };

  // 处理登出确认
  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  // 处理登出
  const handleLogout = async () => {
    setShowLogoutConfirm(false);
    
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setIsLoggedIn(false);
      setUsername('');
      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('登出失败:', error);
    }
  };

  // 取消登出
  const handleCancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  // 获取主题图标
  const getThemeIcon = () => {
    switch (theme) {
      case 'light':
        return '🌞';
      case 'dark':
        return '🌙';
      case 'system':
        return '⚙️';
      default:
        return '🌞';
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* 站点标题 */}
          <Link href="/" className="text-2xl font-bold transition-colors hover:text-primary">
            {siteConfig.name}
          </Link>
          
          <div className="flex items-center gap-6">
            {/* 导航菜单 */}
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/" className="text-sm font-medium transition-colors hover:text-primary">
                首页
              </Link>
              <Link href="/blog" className="text-sm font-medium transition-colors hover:text-primary">
                博客
              </Link>
              <Link href="/category" className="text-sm font-medium transition-colors hover:text-primary">
                分类
              </Link>
              <Link href="/tag" className="text-sm font-medium transition-colors hover:text-primary">
                标签
              </Link>
              <Link href="/about" className="text-sm font-medium transition-colors hover:text-primary">
                关于
              </Link>
              {isLoggedIn && (
                <Link 
                  href="/admin" 
                  className="rounded-lg bg-primary/10 px-3 py-1 text-sm font-medium text-primary transition-colors hover:bg-primary/20"
                >
                  后台
                </Link>
              )}
            </nav>
            
            {/* 用户信息和主题切换 */}
            <div className="flex items-center gap-4">
              {isLoggedIn ? (
                <>
                  <span className="text-sm text-muted-foreground">
                    {username}
                  </span>
                  <button
                    onClick={handleLogoutClick}
                    className="rounded-lg border px-3 py-1 text-sm font-medium transition-colors hover:bg-accent"
                    aria-label="登出"
                  >
                    登出
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  登录
                </Link>
              )}
              
              {/* 主题切换按钮 */}
              <button
                onClick={handleThemeToggle}
                className="flex items-center justify-center rounded-full p-2 transition-colors hover:bg-accent"
                aria-label="切换主题"
              >
                <span className="text-xl">{getThemeIcon()}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 登出确认对话框 */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/50 backdrop-blur-sm transition-opacity">
          <div className="bg-background rounded-lg p-6 w-full max-w-md shadow-2xl border animate-in fade-in zoom-in-95 duration-200">
            <div className="text-center mb-6">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
                <span className="text-2xl">⚠️</span>
              </div>
              <h3 className="mt-4 text-lg font-semibold">确认登出</h3>
              <p className="mt-2 text-sm text-muted-foreground">确定要登出您的账户吗？</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleCancelLogout}
                className="flex-1 rounded-lg border px-4 py-2 text-sm font-medium transition-colors hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                取消
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 rounded-lg bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground transition-colors hover:bg-destructive/90 focus:outline-none focus:ring-2 focus:ring-destructive focus:ring-offset-2"
              >
                确认登出
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
