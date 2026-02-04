/**
 * 格式化日期为中文格式
 * @param date 日期字符串或Date对象
 * @returns 格式化后的日期字符串，如：2024年1月1日
 */
export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * 计算文章阅读时间
 * @param content 文章内容
 * @returns 阅读时间（分钟）
 */
export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200; // 每分钟阅读字数
  const words = content.split(/\s+/).length; // 统计字数
  return Math.ceil(words / wordsPerMinute); // 向上取整
}

/**
 * 将文本转换为slug格式（用于URL）
 * @param text 原始文本
 * @returns 转换后的slug字符串
 */
export function slugify(text: string): string {
  return text
    .toLowerCase() // 转为小写
    .replace(/[^\w\s-]/g, '') // 移除非单词、空格和连字符的字符
    .replace(/\s+/g, '-') // 将空格替换为连字符
    .replace(/-+/g, '-') // 合并多个连字符为一个
    .trim(); // 去除首尾空白
}
