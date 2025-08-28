import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

const sevenDays = 7 * 24 * 60 * 60;

export async function POST(request: Request) {
  const { accessToken, refreshToken } = await request.json();
  const cookieStore = await cookies();
  cookieStore.set({
    name: "accessToken",
    value: accessToken,
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: sevenDays,
  });
  cookieStore.set({
    name: "refreshToken",
    value: refreshToken,
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: sevenDays,
  });
  return NextResponse.json({ success: true });
}
