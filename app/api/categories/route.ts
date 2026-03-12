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

    const response = NextResponse.json({ categories: formattedCategories });

    // 设置缓存控制头 - 缓存1小时
    response.headers.set('Cache-Control', 'public, max-age=3600, s-maxage=3600');

    return response;
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

// 更新分类
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name, slug, description } = body;

    // 验证输入
    if (!id || !name || !slug) {
      return NextResponse.json(
        { error: '分类ID、名称和slug不能为空' },
        { status: 400 }
      );
    }

    // 检查分类是否存在
    const existingCategory = await prisma.category.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingCategory) {
      return NextResponse.json(
        { error: '分类不存在' },
        { status: 404 }
      );
    }

    // 检查slug是否已被其他分类使用
    const existingSlug = await prisma.category.findFirst({
      where: { slug, id: { not: parseInt(id) } },
    });

    if (existingSlug) {
      return NextResponse.json(
        { error: '分类slug已存在' },
        { status: 400 }
      );
    }

    // 更新分类
    const updatedCategory = await prisma.category.update({
      where: { id: parseInt(id) },
      data: {
        name,
        slug,
        description,
      },
    });

    return NextResponse.json(updatedCategory);
  } catch (error) {
    console.error('更新分类错误:', error);
    return NextResponse.json(
      { error: '更新分类失败' },
      { status: 500 }
    );
  }
}

// 删除分类
export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();

    // 验证输入
    if (!id) {
      return NextResponse.json(
        { error: '分类ID不能为空' },
        { status: 400 }
      );
    }

    // 检查分类是否存在
    const existingCategory = await prisma.category.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingCategory) {
      return NextResponse.json(
        { error: '分类不存在' },
        { status: 404 }
      );
    }

    // 检查分类是否有文章
    const postCount = await prisma.post.count({
      where: { categoryId: parseInt(id) },
    });

    if (postCount > 0) {
      return NextResponse.json(
        { error: '该分类下有文章，无法删除' },
        { status: 400 }
      );
    }

    // 删除分类
    await prisma.category.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ message: '删除分类成功' });
  } catch (error) {
    console.error('删除分类错误:', error);
    return NextResponse.json(
      { error: '删除分类失败' },
      { status: 500 }
    );
  }
}
