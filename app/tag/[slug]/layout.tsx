/**
 * 标签详情页面布局
 */
import type { Metadata, ResolvingMetadata } from 'next';
import { prisma } from '@/lib/prisma';

// 服务器端函数：获取标签数据
async function getTagBySlug(slug: string) {
  return await prisma.tag.findFirst({
    where: { slug },
  });
}

// 生成动态元数据
export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const resolvedParams = await params;
  const tag = await getTagBySlug(resolvedParams.slug);
  
  if (!tag) {
    return {
      title: '标签未找到',
      description: '抱歉，您访问的标签不存在。',
    };
  }

  return {
    title: tag.name,
    description: `查看包含 ${tag.name} 标签的所有文章`,
    openGraph: {
      title: tag.name,
      description: `查看包含 ${tag.name} 标签的所有文章`,
      type: 'website',
      url: `https://fishpondblog.com/tag/${tag.slug}`,
    },
  };
}

// 布局组件
export default function TagDetailLayout({ children }: { children: React.ReactNode }) {
  return children;
}
