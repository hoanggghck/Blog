// app/api/protected/route.ts
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const res = await fetch(`${process.env.API_URL}/refresh`, { method: "GET" });
  const data = await res.json();

  if (res.ok) {
    // gắn cookie mới cho cả client lẫn server
    (await cookies()).set("accessToken", data.result.accessToken, { httpOnly: true });
    (await cookies()).set("refreshToken", data.result.refreshToken, { httpOnly: true });

    // gọi tiếp API bằng token mới
    const user = await fetch(`${process.env.API_URL}/me`, {
      headers: { Authorization: `Bearer ${data.result.accessToken}` },
    }).then((r) => r.json());

    return NextResponse.json({ user });
  }

  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}