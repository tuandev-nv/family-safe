import { NextRequest, NextResponse } from "next/server";
import { createToken, getAuthCookieName, validateCredentials } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { username, password } = body;

  if (!username || !password) {
    return NextResponse.json(
      { error: "Vui lòng nhập tên đăng nhập và mật khẩu" },
      { status: 400 }
    );
  }

  if (!validateCredentials(username, password)) {
    return NextResponse.json(
      { error: "Sai tên đăng nhập hoặc mật khẩu" },
      { status: 401 }
    );
  }

  const token = await createToken();

  const response = NextResponse.json({ success: true });
  response.cookies.set(getAuthCookieName(), token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  });

  return response;
}
