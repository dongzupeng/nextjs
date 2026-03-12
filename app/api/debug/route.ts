/**
 * 调试API - 查看数据库中的文章
 */
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      select: {
        id: true,
        title: true,
        slug: true,
        publishedAt: true,
      },
      orderBy: { publishedAt: 'desc' },
      take: 10,
    });

    const response = NextResponse.json({ posts });

    // 设置缓存控制头 - 缓存1小时
    response.headers.set('Cache-Control', 'public, max-age=3600, s-maxage=3600');

    return response;
  } catch (error) {
    console.error('查询失败:', error);
    return NextResponse.json(
      { error: '查询失败' },
      { status: 500 }
    );
  }
}
