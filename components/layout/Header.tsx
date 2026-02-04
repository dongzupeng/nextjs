/**
 * 页面头部组件
 */
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { siteConfig } from '@/lib/config';
import { getTheme, setTheme, initTheme } from '@/lib/theme';

/**
 * 头部组件，包含站点标题和导航链接
 */
export default function Header() {
  // 初始状态设置为'system'，与服务器端保持一致
  const [theme, setCurrentTheme] = useState<'light' | 'dark' | 'system'>('system');
  // 跟踪是否已经完成客户端初始化
  const [isClientInitialized, setIsClientInitialized] = useState(false);

  // 客户端初始化
  useEffect(() => {
    // 获取实际的主题设置
    const actualTheme = getTheme();
    setCurrentTheme(actualTheme);
    initTheme();
    setIsClientInitialized(true);
  }, []);

  // 处理主题切换
  const handleThemeToggle = () => {
    const themes: Array<'light' | 'dark' | 'system'> = ['light', 'dark', 'system'];
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    const nextTheme = themes[nextIndex];
    
    setTheme(nextTheme);
    setCurrentTheme(nextTheme);
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
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* 站点标题 */}
          <Link href="/" className="text-2xl font-bold">
            {siteConfig.name}
          </Link>
          
          <div className="flex items-center gap-6">
            {/* 导航菜单 */}
            <nav className="flex items-center gap-6">
              <Link href="/" className="text-sm font-medium hover:text-primary">
                首页
              </Link>
              <Link href="/blog" className="text-sm font-medium hover:text-primary">
                博客
              </Link>
              <Link href="/category" className="text-sm font-medium hover:text-primary">
                分类
              </Link>
              <Link href="/tag" className="text-sm font-medium hover:text-primary">
                标签
              </Link>
              <Link href="/about" className="text-sm font-medium hover:text-primary">
                关于
              </Link>
            </nav>
            
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
    </header>
  );
}
