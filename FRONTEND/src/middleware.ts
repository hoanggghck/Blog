// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const accessToken = request.cookies.get('accessToken')?.value;
  const refreshToken = request.cookies.get('refreshToken')?.value;
  const requestHeaders = new Headers(request.headers);
  if (accessToken) {
    requestHeaders.set('Authorization', accessToken);
  }
  if (refreshToken) {
    requestHeaders.set('refreshToken', refreshToken);
  }
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}