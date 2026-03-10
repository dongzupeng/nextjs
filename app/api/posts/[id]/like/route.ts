/**
 * 文章点赞API
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

    // 检查是否已经点赞
    const existingLike = await prisma.postLike.findUnique({
      where: {
        postId_userId: {
          postId,
          userId: decoded.userId,
        },
      },
    });

    if (existingLike) {
      // 已点赞，取消点赞
      await prisma.postLike.delete({
        where: {
          postId_userId: {
            postId,
            userId: decoded.userId,
          },
        },
      });

      return NextResponse.json({
        message: '取消点赞成功',
        liked: false,
      });
    } else {
      // 未点赞，添加点赞
      await prisma.postLike.create({
        data: {
          postId,
          userId: decoded.userId,
        },
      });

      return NextResponse.json({
        message: '点赞成功',
        liked: true,
      });
    }
  } catch (error) {
    console.error('点赞操作错误:', error);
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

    // 获取点赞数量
    const likeCount = await prisma.postLike.count({
      where: { postId },
    });

    // 检查当前用户是否已点赞
    let liked = false;
    const token = request.cookies.get('auth_token')?.value;
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as {
          userId: number;
        };

        const existingLike = await prisma.postLike.findUnique({
          where: {
            postId_userId: {
              postId,
              userId: decoded.userId,
            },
          },
        });

        liked = !!existingLike;
      } catch (error) {
        // Token 无效，忽略
      }
    }

    return NextResponse.json({
      likeCount,
      liked,
    });
  } catch (error) {
    console.error('获取点赞信息错误:', error);
    return NextResponse.json(
      { error: '获取点赞信息失败' },
      { status: 500 }
    );
  }
}
