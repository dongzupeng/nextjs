/**
 * 结构化数据生成工具
 * 用于生成符合 Schema.org 标准的结构化数据
 */
import { siteConfig } from './config';
import { Post, Category, Tag } from '@/types/blog';

/**
 * 生成网站主页的结构化数据
 */
export function generateWebsiteStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    publisher: {
      '@type': 'Person',
      name: siteConfig.author.name,
      url: siteConfig.links.github,
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: `${siteConfig.url}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
}

/**
 * 生成博客文章的结构化数据
 */
export function generateArticleStructuredData(post: Post) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt || post.content.substring(0, 150),
    image: post.coverImage ? [post.coverImage] : [],
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    author: [
      {
        '@type': 'Person',
        name: post.author?.username || siteConfig.author.name,
      },
    ],
    publisher: {
      '@type': 'Person',
      name: siteConfig.author.name,
      url: siteConfig.url,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${siteConfig.url}/blog/${post.slug}`,
    },
    wordCount: post.content.length,
    readingTime: post.readingTime,
    articleSection: post.category?.name,
    keywords: post.tags?.map(tag => tag.name).join(', '),
  };
}

/**
 * 生成文章列表页面的结构化数据
 */
export function generateCollectionPageStructuredData(
  title: string,
  description: string,
  items: Post[],
  pathname: string
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: title,
    description: description,
    url: `${siteConfig.url}${pathname}`,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: items.map((post, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'Article',
          headline: post.title,
          url: `${siteConfig.url}/blog/${post.slug}`,
          datePublished: post.publishedAt,
          author: {
            '@type': 'Person',
            name: post.author?.username || siteConfig.author.name,
          },
        },
      })),
    },
  };
}
