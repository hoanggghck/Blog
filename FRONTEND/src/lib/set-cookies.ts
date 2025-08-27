// lib/cookies.ts
"use server";

import { cookies } from "next/headers";
const sevenDays = 60 * 60 * 24 * 7; // 7 ngày

export async function setAuthCookies(accessToken: string, refreshToken: string) {
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
}
