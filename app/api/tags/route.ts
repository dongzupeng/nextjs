/**
 * 标签API - 使用Prisma
 */
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// 获取所有标签
export async function GET() {
  try {
    const tags = await prisma.tag.findMany({
      include: {
        _count: {
          select: { posts: true },
        },
      },
      orderBy: { name: 'asc' },
    });

    // 格式化返回数据
    const formattedTags = tags.map(tag => ({
      ...tag,
      postCount: tag._count.posts,
    }));

    return NextResponse.json({ tags: formattedTags });
  } catch (error) {
    console.error('获取标签列表错误:', error);
    return NextResponse.json(
      { error: '获取标签列表失败' },
      { status: 500 }
    );
  }
}

// 创建标签
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, slug } = body;

    // 验证输入
    if (!name || !slug) {
      return NextResponse.json(
        { error: '标签名称和slug不能为空' },
        { status: 400 }
      );
    }

    // 检查slug是否已存在
    const existingTag = await prisma.tag.findUnique({
      where: { slug },
    });

    if (existingTag) {
      return NextResponse.json(
        { error: '标签slug已存在' },
        { status: 400 }
      );
    }

    // 创建标签
    const tag = await prisma.tag.create({
      data: {
        name,
        slug,
      },
    });

    return NextResponse.json(tag, { status: 201 });
  } catch (error) {
    console.error('创建标签错误:', error);
    return NextResponse.json(
      { error: '创建标签失败' },
      { status: 500 }
    );
  }
}
