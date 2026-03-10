/**
 * 博客文章类型定义
 */
export interface Post {
  id: number;               // 文章ID
  slug: string;             // 文章别名（用于URL）
  title: string;            // 文章标题
  excerpt?: string;         // 文章摘要（可选）
  content: string;          // 文章内容
  coverImage?: string;      // 封面图片（可选）
  author: Author;           // 作者信息
  publishedAt: Date;       // 发布时间
  createdAt: Date;         // 创建时间
  updatedAt: Date;         // 更新时间
  category: Category;       // 文章分类
  tags: Tag[];              // 文章标签
  readingTime: number;      // 阅读时间（分钟）
  views: number;           // 浏览量
  authorId: number;        // 作者ID
  categoryId: number;       // 分类ID
  likeCount: number;        // 点赞数量
  bookmarkCount: number;    // 收藏数量
}

/**
 * 作者类型定义
 */
export interface Author {
  id: number;               // 作者ID
  username: string;         // 作者用户名
}

/**
 * 分类类型定义
 */
export interface Category {
  id: number;               // 分类ID
  slug: string;             // 分类别名（用于URL）
  name: string;             // 分类名称
  description?: string;     // 分类描述（可选）
  createdAt: Date;         // 创建时间
  updatedAt: Date;         // 更新时间
  postCount?: number;       // 文章数量（可选）
}

/**
 * 标签类型定义
 */
export interface Tag {
  id: number;               // 标签ID
  slug: string;             // 标签别名（用于URL）
  name: string;             // 标签名称
  createdAt: Date;         // 创建时间
  updatedAt: Date;         // 更新时间
  postCount?: number;       // 文章数量（可选）
}

/**
 * 分页类型定义
 */
export interface Pagination {
  page: number;             // 当前页码
  limit: number;            // 每页数量
  total: number;            // 总数量
  totalPages: number;       // 总页数
}
