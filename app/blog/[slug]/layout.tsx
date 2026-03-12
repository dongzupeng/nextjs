/**
 * 文章详情页面布局
 */
import type { Metadata, ResolvingMetadata } from 'next';
import { prisma } from '@/lib/prisma';

// 服务器端函数：获取文章数据
async function getPostBySlug(slug: string) {
  let post;
  
  // 先尝试通过ID查询
  if (/^\d+$/.test(slug)) {
    const postId = parseInt(slug);
    post = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        author: {
          select: { id: true, username: true },
        },
        category: true,
        tags: {
          include: { tag: true },
        },
      },
    });
  }
  
  // 如果通过ID没找到，尝试通过slug查询
  if (!post) {
    post = await prisma.post.findFirst({
      where: { slug },
      include: {
        author: {
          select: { id: true, username: true },
        },
        category: true,
        tags: {
          include: { tag: true },
        },
      },
    });
  }

  if (!post) {
    return null;
  }

  return {
    ...post,
    tags: post.tags.map(pt => pt.tag),
  };
}

// 生成动态元数据
export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const resolvedParams = await params;
  const post = await getPostBySlug(resolvedParams.slug);
  
  if (!post) {
    return {
      title: '文章未找到',
      description: '抱歉，您访问的文章不存在。',
    };
  }

  return {
    title: post.title,
    description: post.excerpt || post.content.substring(0, 150),
    openGraph: {
      title: post.title,
      description: post.excerpt || post.content.substring(0, 150),
      type: 'article',
      url: `https://fishpondblog.com/blog/${post.slug}`,
      images: post.coverImage ? [post.coverImage] : [],
    },
    twitter: {
      title: post.title,
      description: post.excerpt || post.content.substring(0, 150),
      card: 'summary_large_image',
      images: post.coverImage ? [post.coverImage] : [],
    },
  };
}

// 布局组件
export default function BlogPostLayout({ children }: { children: React.ReactNode }) {
  return children;
}
