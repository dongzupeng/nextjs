/**
 * 认证代理
 * 保护需要登录的页面
 */
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// JWT密钥 - 必须与登录API使用相同的密钥
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this-in-production';

/**
 * 简单的JWT验证函数（Edge Runtime兼容）
 * 只验证签名，不验证过期时间等复杂逻辑
 */
async function verifyToken(token: string): Promise<boolean> {
  try {
    // 分割token
    const parts = token.split('.');
    if (parts.length !== 3) return false;

    const [header, payload, signature] = parts;

    // 创建签名验证数据
    const data = `${header}.${payload}`;
    
    // 使用 Web Crypto API 验证签名 (Edge Runtime 支持)
    const encoder = new TextEncoder();
    const keyData = encoder.encode(JWT_SECRET);
    const messageData = encoder.encode(data);

    // 导入密钥
    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );

    // 生成签名
    const signatureBuffer = await crypto.subtle.sign('HMAC', cryptoKey, messageData);
    const computedSignature = btoa(String.fromCharCode(...new Uint8Array(signatureBuffer)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');

    // 比较签名
    return computedSignature === signature;
  } catch (error) {
    console.log('[Middleware] Token验证失败:', error);
    return false;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 获取token
  const token = request.cookies.get('auth_token')?.value;
  const isValidToken = token ? await verifyToken(token) : false;

  console.log(`[Proxy] Path: ${pathname}, HasToken: ${!!token}, Valid: ${isValidToken}`);

  // 只保护 /admin 路径
  if (pathname.startsWith('/admin')) {
    if (!isValidToken) {
      // 未登录或token无效，重定向到登录页
      console.log(`[Proxy] 未登录，重定向到登录页`);
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
    // token有效，允许访问
    console.log(`[Proxy] 允许访问 /admin`);
    return NextResponse.next();
  }

  // 其他页面不做限制
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
