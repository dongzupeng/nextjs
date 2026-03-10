/**
 * 文章收藏API
 */
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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
    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      return NextResponse.json(
        { error: '文章不存在' },
        { status: 404 }
      );
    }

    // 检查是否已经收藏
    const existingBookmark = await prisma.postBookmark.findUnique({
      where: {
        postId_userId: {
          postId,
          userId: decoded.userId,
        },
      },
    });

    if (existingBookmark) {
      // 已收藏，取消收藏
      await prisma.postBookmark.delete({
        where: {
          postId_userId: {
            postId,
            userId: decoded.userId,
          },
        },
      });

      return NextResponse.json({
        message: '取消收藏成功',
        bookmarked: false,
      });
    } else {
      // 未收藏，添加收藏
      await prisma.postBookmark.create({
        data: {
          postId,
          userId: decoded.userId,
        },
      });

      return NextResponse.json({
        message: '收藏成功',
        bookmarked: true,
      });
    }
  } catch (error) {
    console.error('收藏操作错误:', error);
    return NextResponse.json(
      { error: '操作失败' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const postId = parseInt(id);

    // 获取收藏数量
    const bookmarkCount = await prisma.postBookmark.count({
      where: { postId },
    });

    // 检查当前用户是否已收藏
    let bookmarked = false;
    const token = request.cookies.get('auth_token')?.value;
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as {
          userId: number;
        };

        const existingBookmark = await prisma.postBookmark.findUnique({
          where: {
            postId_userId: {
              postId,
              userId: decoded.userId,
            },
          },
        });

        bookmarked = !!existingBookmark;
      } catch (error) {
        // Token 无效，忽略
      }
    }

    return NextResponse.json({
      bookmarkCount,
      bookmarked,
    });
  } catch (error) {
    console.error('获取收藏信息错误:', error);
    return NextResponse.json(
      { error: '获取收藏信息失败' },
      { status: 500 }
    );
  }
}
