/**
 * 用户登出API
 */
import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ message: '登出成功' });
  
  // 清除cookie - 使用与设置时相同的配置
  const isProduction = process.env.NODE_ENV === 'production';
  
  response.cookies.set('auth_token', '', {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'strict' : 'lax',
    maxAge: 0, // 立即过期
    path: '/',
  });
  
  console.log('[Logout API] Cookie已清除');
  
  return response;
}
