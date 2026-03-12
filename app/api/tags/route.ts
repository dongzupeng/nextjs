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

    const response = NextResponse.json({ tags: formattedTags });

    // 设置缓存控制头 - 缓存1小时
    response.headers.set('Cache-Control', 'public, max-age=3600, s-maxage=3600');

    return response;
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

// 更新标签
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name, slug } = body;

    // 验证输入
    if (!id || !name || !slug) {
      return NextResponse.json(
        { error: '标签ID、名称和slug不能为空' },
        { status: 400 }
      );
    }

    // 检查标签是否存在
    const existingTag = await prisma.tag.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingTag) {
      return NextResponse.json(
        { error: '标签不存在' },
        { status: 404 }
      );
    }

    // 检查slug是否已被其他标签使用
    const existingSlug = await prisma.tag.findFirst({
      where: { slug, id: { not: parseInt(id) } },
    });

    if (existingSlug) {
      return NextResponse.json(
        { error: '标签slug已存在' },
        { status: 400 }
      );
    }

    // 更新标签
    const updatedTag = await prisma.tag.update({
      where: { id: parseInt(id) },
      data: {
        name,
        slug,
      },
    });

    return NextResponse.json(updatedTag);
  } catch (error) {
    console.error('更新标签错误:', error);
    return NextResponse.json(
      { error: '更新标签失败' },
      { status: 500 }
    );
  }
}

// 删除标签
export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();

    // 验证输入
    if (!id) {
      return NextResponse.json(
        { error: '标签ID不能为空' },
        { status: 400 }
      );
    }

    // 检查标签是否存在
    const existingTag = await prisma.tag.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingTag) {
      return NextResponse.json(
        { error: '标签不存在' },
        { status: 404 }
      );
    }

    // 检查标签是否有文章
    const postCount = await prisma.post.count({
      where: {
        tags: {
          some: {
            tagId: parseInt(id),
          },
        },
      },
    });

    if (postCount > 0) {
      return NextResponse.json(
        { error: '该标签下有文章，无法删除' },
        { status: 400 }
      );
    }

    // 删除标签
    await prisma.tag.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ message: '删除标签成功' });
  } catch (error) {
    console.error('删除标签错误:', error);
    return NextResponse.json(
      { error: '删除标签失败' },
      { status: 500 }
    );
  }
}
