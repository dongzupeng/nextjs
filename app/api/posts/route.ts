/**
 * 文章API - 使用Prisma
 */
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';

// 获取所有文章
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const tag = searchParams.get('tag');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    const skip = (page - 1) * limit;

    // 构建查询条件
    const where: any = {};
    if (category) {
      where.category = { slug: category };
    }
    if (tag) {
      where.tags = { some: { tag: { slug: tag } } };
    }

    // 查询文章
    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        include: {
          author: {
            select: { id: true, username: true },
          },
          category: true,
          tags: {
            include: { tag: true },
          },
        },
        orderBy: { publishedAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.post.count({ where }),
    ]);

    // 格式化返回数据
    const formattedPosts = posts.map(post => ({
      ...post,
      tags: post.tags.map(pt => pt.tag),
    }));

    return NextResponse.json({
      posts: formattedPosts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('获取文章列表错误:', error);
    return NextResponse.json(
      { error: '获取文章列表失败' },
      { status: 500 }
    );
  }
}

// 创建文章
export async function POST(request: NextRequest) {
  try {
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

    const body = await request.json();
    const { title, slug: providedSlug, excerpt, content, coverImage, categoryId, tagIds } = body;

    // 验证输入
    if (!title || !content || !coverImage) {
      return NextResponse.json(
        { error: '标题、内容和封面图片不能为空' },
        { status: 400 }
      );
    }

    // 自动生成 slug
    const slug = providedSlug || title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 50);

    // 检查slug是否已存在
    const existingPost = await prisma.post.findUnique({
      where: { slug },
    });

    if (existingPost) {
      return NextResponse.json(
        { error: '文章slug已存在' },
        { status: 400 }
      );
    }

    // 计算阅读时间
    const readingTime = Math.ceil(content.length / 500);

    // 创建文章
    const post = await prisma.post.create({
      data: {
        title,
        slug,
        excerpt,
        content,
        coverImage,
        readingTime,
        authorId: decoded.userId,
        categoryId: categoryId || 1,
        tags: {
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
      ...post,
      tags: post.tags.map(pt => pt.tag),
    }, { status: 201 });
  } catch (error) {
    console.error('创建文章错误:', error);
    return NextResponse.json(
      { error: '创建文章失败' },
      { status: 500 }
    );
  }
}
