import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { RATE_LIMIT_MAX, RATE_LIMIT_WINDOW_MS } from '@/utils/env';

const ipRequestCounts = new Map<string, { count: number; resetTime: number }>();

export function middleware(request: NextRequest) {
  if (!request.nextUrl.pathname.startsWith('/api')) {
    return NextResponse.next();
  }
  
  const ip = request.headers.get('x-forwarded-for') || 
    request.headers.get('x-real-ip') || 
    'anonymous';
  const now = Date.now();

  if (ipRequestCounts.has(ip)) {
    const data = ipRequestCounts.get(ip)!;
    if (now > data.resetTime) {
      ipRequestCounts.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    } else {
      data.count += 1;
      if (data.count > RATE_LIMIT_MAX) {
        return new NextResponse('Too Many Requests', {
          status: 429,
          headers: {
            'Retry-After': `${Math.ceil((data.resetTime - now) / 1000)}`,
          },
        });
      }
    }
  } else {
    ipRequestCounts.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
  }

  const response = NextResponse.next();
  response.headers.set('X-RateLimit-Limit', RATE_LIMIT_MAX.toString());
  response.headers.set(
    'X-RateLimit-Remaining',
    Math.max(0, RATE_LIMIT_MAX - (ipRequestCounts.get(ip)?.count || 0)).toString()
  );

  return response;
}

export const config = {
  matcher: '/api/:path*',
};