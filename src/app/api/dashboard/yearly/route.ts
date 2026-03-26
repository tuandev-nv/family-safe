import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { handleApiError } from "@/lib/api-error";
import { notDeleted } from "@/lib/soft-delete";

export async function GET(request: NextRequest) {
  try {
    const yearParam = request.nextUrl.searchParams.get("year");
    const year = parseInt(yearParam ?? "") || new Date().getFullYear();

    const yearStart = new Date(year, 0, 1);
    const yearEnd = new Date(year + 1, 0, 1);

    const [children, activities] = await Promise.all([
      prisma.child.findMany({
        where: notDeleted,
        select: { id: true, name: true, emoji: true, avatarUrl: true },
        orderBy: { createdAt: "asc" },
      }),
      prisma.activity.findMany({
        where: {
          ...notDeleted,
          createdAt: { gte: yearStart, lt: yearEnd },
        },
        select: { childId: true, points: true, createdAt: true },
      }),
    ]);

    // Group by child + month
    const monthlyData: Record<string, Record<number, number>> = {};
    for (const child of children) {
      monthlyData[child.id] = {};
      for (let m = 1; m <= 12; m++) monthlyData[child.id][m] = 0;
    }

    for (const activity of activities) {
      const m = activity.createdAt.getMonth() + 1;
      if (monthlyData[activity.childId]) {
        monthlyData[activity.childId][m] += activity.points;
      }
    }

    return NextResponse.json({ year, children, monthlyData });
  } catch (error) {
    return handleApiError(error);
  }
}
