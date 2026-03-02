/**
 * 单个文章API - 使用Prisma
 */
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';

// 获取单个文章（支持 ID 或 slug）
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    let post;
    
    // 先尝试通过ID查询
    if (/^\d+$/.test(id)) {
      const postId = parseInt(id);
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
        where: { slug: id },
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
      return NextResponse.json(
        { error: '文章不存在' },
        { status: 404 }
      );
    }

    // 增加浏览量
    const postId = post.id;
    await prisma.post.update({
      where: { id: postId },
      data: { views: { increment: 1 } },
    });

    return NextResponse.json({
      ...post,
      tags: post.tags.map(pt => pt.tag),
      views: post.views + 1,
    });
  } catch (error) {
    console.error('获取文章错误:', error);
    return NextResponse.json(
      { error: '获取文章失败' },
      { status: 500 }
    );
  }
}

// 更新文章
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const postId = parseInt(id);

    // 验证用户
    const token = request.cookies.get('auth_token')?.value;
    if (!token) {
      return NextResponse.json(
        { error: '未登录' },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as {
      userId: number;
    };

    // 检查文章是否存在
    const existingPost = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!existingPost) {
      return NextResponse.json(
        { error: '文章不存在' },
        { status: 404 }
      );
    }

    // 检查权限
    if (existingPost.authorId !== decoded.userId) {
      return NextResponse.json(
        { error: '无权修改此文章' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { title, excerpt, content, categoryId, tagIds } = body;

    // 更新文章
    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: {
        title,
        excerpt,
        content,
        categoryId: parseInt(categoryId),
        // 先删除所有标签关联
        tags: {
          deleteMany: {},
          // 再创建新的标签关联
          create: tagIds?.map((tagId: number) => ({
            tag: { connect: { id: tagId } },
          })),
        },
      },
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

    return NextResponse.json({
      ...updatedPost,
      tags: updatedPost.tags.map(pt => pt.tag),
    });
  } catch (error) {
    console.error('更新文章错误:', error);
    return NextResponse.json(
      { error: '更新文章失败' },
      { status: 500 }
    );
  }
}

// 删除文章
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const postId = parseInt(id);

    // 验证用户
    const token = request.cookies.get('auth_token')?.value;
    if (!token) {
      return NextResponse.json(
        { error: '未登录' },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as {
      userId: number;
    };

    // 检查文章是否存在
    const existingPost = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!existingPost) {
      return NextResponse.json(
        { error: '文章不存在' },
        { status: 404 }
      );
    }

    // 检查权限
    if (existingPost.authorId !== decoded.userId) {
      return NextResponse.json(
        { error: '无权删除此文章' },
        { status: 403 }
      );
    }

    // 删除文章（关联的标签会自动删除）
    await prisma.post.delete({
      where: { id: postId },
    });

    return NextResponse.json({ message: '删除成功' });
  } catch (error) {
    console.error('删除文章错误:', error);
    return NextResponse.json(
      { error: '删除文章失败' },
      { status: 500 }
    );
  }
}
