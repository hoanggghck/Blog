import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

const sevenDays = 7 * 24 * 60 * 60;

export async function POST(request: Request) {
  const { accessToken, refreshToken, isServer } = await request.json();
  const response = NextResponse.json({ success: true });
  if (isServer) {
    response.headers.set("x-new-access-token", accessToken);
    response.headers.set("x-new-refresh-token", refreshToken);
  } else {
    const cookieStore = await cookies();
    cookieStore.set({
      name: 'accessToken',
      value: accessToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: sevenDays,
    });
    cookieStore.set({
      name: 'refreshToken',
      value: refreshToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: sevenDays,
    });
  }
  return response;
}