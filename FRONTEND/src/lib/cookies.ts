"use server";

import { cookies } from "next/headers";
const sevenDays = 60 * 60 * 24 * 7; // 7 ngày

export async function setCookies(accessToken: string, refreshToken: string) {
  try {
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
  } catch (error) {
    console.error('Error setting auth cookies:', error);
    return { success: false, error: 'Failed to set cookies' };
  }
}


export async function getCookies() {
  const cookieStore = await cookies();
  let accessToken = cookieStore.get("accessToken")?.value || '';
  let refreshToken = cookieStore.get("refreshToken")?.value || '';
  return { accessToken, refreshToken }
}