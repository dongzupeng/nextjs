/**
 * 主题管理工具函数
 */

/**
 * 主题类型
 */
export type Theme = 'light' | 'dark' | 'system';

/**
 * 检查是否在浏览器环境中
 */
function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof document !== 'undefined';
}

/**
 * 获取当前主题
 * @returns 当前主题
 */
export function getTheme(): Theme {
  if (!isBrowser()) {
    return 'system';
  }
  
  const storedTheme = localStorage.getItem('theme') as Theme | null;
  return storedTheme || 'system';
}

/**
 * 设置主题
 * @param theme 要设置的主题
 */
export function setTheme(theme: Theme): void {
  if (!isBrowser()) {
    return;
  }
  
  localStorage.setItem('theme', theme);
  applyTheme(theme);
}

/**
 * 应用主题到文档
 * @param theme 要应用的主题
 */
export function applyTheme(theme: Theme): void {
  if (!isBrowser()) {
    return;
  }
  
  const root = document.documentElement;
  
  // 移除现有的主题类
  root.classList.remove('light', 'dark');
  
  if (theme === 'system') {
    // 使用系统主题
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    root.classList.add(systemTheme);
  } else {
    // 使用指定主题
    root.classList.add(theme);
  }
}

/**
 * 切换主题
 */
export function toggleTheme(): void {
  if (!isBrowser()) {
    return;
  }
  
  const currentTheme = getTheme();
  let nextTheme: Theme;
  
  switch (currentTheme) {
    case 'light':
      nextTheme = 'dark';
      break;
    case 'dark':
      nextTheme = 'system';
      break;
    case 'system':
      nextTheme = 'light';
      break;
    default:
      nextTheme = 'light';
  }
  
  setTheme(nextTheme);
}

/**
 * 初始化主题
 */
export function initTheme(): void {
  if (!isBrowser()) {
    return;
  }
  
  const theme = getTheme();
  applyTheme(theme);
  
  // 监听系统主题变化
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (getTheme() === 'system') {
      applyTheme('system');
    }
  });
}
