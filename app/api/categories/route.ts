/**
 * 分类API - 使用Prisma
 */
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// 获取所有分类
export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { posts: true },
        },
      },
      orderBy: { name: 'asc' },
    });

    // 格式化返回数据
    const formattedCategories = categories.map(category => ({
      ...category,
      postCount: category._count.posts,
    }));

    return NextResponse.json({ categories: formattedCategories });
  } catch (error) {
    console.error('获取分类列表错误:', error);
    return NextResponse.json(
      { error: '获取分类列表失败' },
      { status: 500 }
    );
  }
}

// 创建分类
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, slug, description } = body;

    // 验证输入
    if (!name || !slug) {
      return NextResponse.json(
        { error: '分类名称和slug不能为空' },
        { status: 400 }
      );
    }

    // 检查slug是否已存在
    const existingCategory = await prisma.category.findUnique({
      where: { slug },
    });

    if (existingCategory) {
      return NextResponse.json(
        { error: '分类slug已存在' },
        { status: 400 }
      );
    }

    // 创建分类
    const category = await prisma.category.create({
      data: {
        name,
        slug,
        description,
      },
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error('创建分类错误:', error);
    return NextResponse.json(
      { error: '创建分类失败' },
      { status: 500 }
    );
  }
}
