"use server";

import { cookies } from "next/headers";
const sevenDays = 60 * 60 * 24 * 7; // 7 ngày

export async function setCookies(refreshToken: string) {
  try {
    const cookieStore = await cookies();
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
    return { success: false, error: 'Failed to set cookies' };
  }
}


export async function getCookies() {
  const cookieStore = await cookies();
  let refreshToken = cookieStore.get("refreshToken")?.value || '';
  return { refreshToken }
}

export async function removeCookies() {
  const cookieStore = await cookies();

  cookieStore.set("refreshToken", "", {
    path: "/",
    maxAge: 0,
  });
}
