/**
 * 博客文章类型定义
 */
export interface Post {
  id: string;               // 文章ID
  slug: string;             // 文章别名（用于URL）
  title: string;            // 文章标题
  excerpt: string;          // 文章摘要
  content: string;          // 文章内容
  coverImage?: string;      // 封面图片（可选）
  author: Author;           // 作者信息
  publishedAt: string;      // 发布时间
  updatedAt?: string;       // 更新时间（可选）
  category: Category;       // 文章分类
  tags: Tag[];              // 文章标签
  readingTime: number;      // 阅读时间（分钟）
  views?: number;           // 浏览量（可选）
}

/**
 * 作者类型定义
 */
export interface Author {
  id: string;               // 作者ID
  name: string;             // 作者名称
  avatar?: string;          // 作者头像（可选）
  bio?: string;             // 作者简介（可选）
  social?: SocialLinks;     // 社交链接（可选）
}

/**
 * 社交链接类型定义
 */
export interface SocialLinks {
  github?: string;          // GitHub链接（可选）
  twitter?: string;         // Twitter链接（可选）
  linkedin?: string;        // LinkedIn链接（可选）
  email?: string;           // 邮箱链接（可选）
}

/**
 * 分类类型定义
 */
export interface Category {
  id: string;               // 分类ID
  slug: string;             // 分类别名（用于URL）
  name: string;             // 分类名称
  description?: string;     // 分类描述（可选）
}

/**
 * 标签类型定义
 */
export interface Tag {
  id: string;               // 标签ID
  slug: string;             // 标签别名（用于URL）
  name: string;             // 标签名称
}

/**
 * 分页类型定义
 */
export interface Pagination {
  page: number;             // 当前页码
  pageSize: number;         // 每页数量
  total: number;            // 总数量
  totalPages: number;       // 总页数
}
