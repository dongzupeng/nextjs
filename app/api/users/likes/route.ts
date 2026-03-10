/**
 * 我的点赞API
 */
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
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

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    // 查询用户点赞的文章
    const [likes, total] = await Promise.all([
      prisma.postLike.findMany({
        where: { userId: decoded.userId },
        include: {
          post: {
            include: {
              author: {
                select: { id: true, username: true },
              },
              category: true,
              tags: {
                include: { tag: true },
              },
              likes: true,
              bookmarks: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.postLike.count({
        where: { userId: decoded.userId },
      }),
    ]);

    // 格式化返回数据
    const posts = likes.map(like => ({
      ...like.post,
      tags: like.post.tags.map(pt => pt.tag),
      likeCount: like.post.likes.length,
      bookmarkCount: like.post.bookmarks.length,
      liked: true,
    }));

    return NextResponse.json({
      posts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('获取我的点赞错误:', error);
    return NextResponse.json(
      { error: '获取点赞列表失败' },
      { status: 500 }
    );
  }
}
