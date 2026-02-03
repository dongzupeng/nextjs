export interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  author: Author;
  publishedAt: string;
  updatedAt?: string;
  category: Category;
  tags: Tag[];
  readingTime: number;
  views?: number;
}

export interface Author {
  id: string;
  name: string;
  avatar?: string;
  bio?: string;
  social?: SocialLinks;
}

export interface SocialLinks {
  github?: string;
  twitter?: string;
  linkedin?: string;
  email?: string;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  description?: string;
}

export interface Tag {
  id: string;
  slug: string;
  name: string;
}

export interface Pagination {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}
