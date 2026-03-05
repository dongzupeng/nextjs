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

    // 增加浏览量 - 防止重复增加
    const postId = post.id;
    
    // 使用一个Set来存储正在处理的文章ID，防止并发请求
    if (!(global as any).processingPosts) {
      (global as any).processingPosts = new Set();
    }
    
    // 检查是否正在处理该文章
    if (!(global as any).processingPosts.has(postId)) {
      try {
        // 标记为正在处理
        (global as any).processingPosts.add(postId);
        
        console.log(`Incrementing views for post ${postId}, current views: ${post.views}`);
        await prisma.post.update({
          where: { id: postId },
          data: { views: { increment: 1 } },
        });
      } finally {
        // 处理完成后移除标记
        setTimeout(() => {
          (global as any).processingPosts.delete(postId);
        }, 1000); // 1秒后移除标记
      }
    } else {
      console.log(`Skipping view increment for post ${postId} - already being processed`);
    }

    // 重新获取更新后的文章数据
    const updatedPost = await prisma.post.findUnique({
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

    return NextResponse.json({
      ...updatedPost!,
      tags: updatedPost!.tags.map(pt => pt.tag),
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
    const { title, excerpt, content, coverImage, categoryId, tagIds } = body;

    // 验证输入
    if (!title || !content || !coverImage) {
      return NextResponse.json(
        { error: '标题、内容和封面图片不能为空' },
        { status: 400 }
      );
    }

    // 更新文章
    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: {
        title,
        excerpt,
        content,
        coverImage,
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
