import { NextResponse } from "next/server";

export function handleApiError(error: unknown) {
  if (
    error &&
    typeof error === "object" &&
    "code" in error &&
    (error as { code: string }).code === "P2025"
  ) {
    return NextResponse.json({ error: "Không tìm thấy" }, { status: 404 });
  }

  console.error("API Error:", error);
  return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
}
