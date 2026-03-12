/**
 * 分类详情页面布局
 */
import type { Metadata, ResolvingMetadata } from 'next';
import { prisma } from '@/lib/prisma';

// 服务器端函数：获取分类数据
async function getCategoryBySlug(slug: string) {
  console.log('Looking for category with slug:', slug);
  const category = await prisma.category.findFirst({
    where: { slug },
  });
  console.log('Found category:', category);
  return category;
}

// 生成动态元数据
export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const resolvedParams = await params;
  const category = await getCategoryBySlug(resolvedParams.slug);
  
  if (!category) {
    return {
      title: '分类未找到',
      description: '抱歉，您访问的分类不存在。',
    };
  }

  return {
    title: category.name,
    description: `查看 ${category.name} 分类下的所有文章`,
    openGraph: {
      title: category.name,
      description: `查看 ${category.name} 分类下的所有文章`,
      type: 'website',
      url: `https://fishpondblog.com/category/${category.slug}`,
    },
  };
}

// 布局组件
export default function CategoryDetailLayout({ children }: { children: React.ReactNode }) {
  return children;
}
