import { Post, Category, Tag } from '@/types/blog';

export const categories: Category[] = [
  {
    id: '1',
    slug: 'frontend',
    name: '前端开发',
    description: '前端开发相关技术文章',
  },
  {
    id: '2',
    slug: 'nextjs',
    name: 'Next.js',
    description: 'Next.js 框架相关内容',
  },
  {
    id: '3',
    slug: 'react',
    name: 'React',
    description: 'React 生态相关内容',
  },
];

export const tags: Tag[] = [
  { id: '1', slug: 'typescript', name: 'TypeScript' },
  { id: '2', slug: 'tailwind', name: 'Tailwind CSS' },
  { id: '3', slug: 'hooks', name: 'React Hooks' },
  { id: '4', slug: 'performance', name: '性能优化' },
  { id: '5', slug: 'tutorial', name: '教程' },
];

export const posts: Post[] = [
  {
    id: '1',
    slug: 'getting-started-with-nextjs',
    title: 'Next.js 入门指南',
    excerpt: '本文将带你了解 Next.js 的基础知识，包括项目创建、路由系统、数据获取等核心概念。',
    content: '这里是文章的完整内容...',
    author: {
      id: '1',
      name: 'Your Name',
      bio: '前端开发工程师',
    },
    publishedAt: '2024-01-15',
    category: categories[1],
    tags: [tags[0], tags[4]],
    readingTime: 8,
  },
  {
    id: '2',
    slug: 'react-hooks-best-practices',
    title: 'React Hooks 最佳实践',
    excerpt: '深入探讨 React Hooks 的使用技巧和最佳实践，帮助你写出更优雅的 React 代码。',
    content: '这里是文章的完整内容...',
    author: {
      id: '1',
      name: 'Your Name',
      bio: '前端开发工程师',
    },
    publishedAt: '2024-01-10',
    category: categories[2],
    tags: [tags[2], tags[4]],
    readingTime: 6,
  },
  {
    id: '3',
    slug: 'tailwind-css-tutorial',
    title: 'Tailwind CSS 实用教程',
    excerpt: '学习如何使用 Tailwind CSS 快速构建美观的用户界面，提高开发效率。',
    content: '这里是文章的完整内容...',
    author: {
      id: '1',
      name: 'Your Name',
      bio: '前端开发工程师',
    },
    publishedAt: '2024-01-05',
    category: categories[0],
    tags: [tags[1], tags[4]],
    readingTime: 10,
  },
];

export function getPostBySlug(slug: string): Post | undefined {
  return posts.find((post) => post.slug === slug);
}

export function getPostsByCategory(categorySlug: string): Post[] {
  return posts.filter((post) => post.category.slug === categorySlug);
}

export function getPostsByTag(tagSlug: string): Post[] {
  return posts.filter((post) => post.tags.some((tag) => tag.slug === tagSlug));
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((cat) => cat.slug === slug);
}

export function getTagBySlug(slug: string): Tag | undefined {
  return tags.find((tag) => tag.slug === slug);
}
