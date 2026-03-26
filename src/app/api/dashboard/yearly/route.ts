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
    const yearFilter = { createdAt: { gte: yearStart, lt: yearEnd }, ...notDeleted };

    const [children, activities, redemptions] = await Promise.all([
      prisma.child.findMany({
        where: notDeleted,
        select: { id: true, name: true, emoji: true, avatarUrl: true },
        orderBy: { createdAt: "asc" },
      }),
      prisma.activity.findMany({
        where: yearFilter,
        select: { childId: true, points: true, createdAt: true },
      }),
      prisma.redemption.findMany({
        where: yearFilter,
        select: { childId: true, points: true },
      }),
    ]);

    // Group activities by child + month
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

    // Group redemptions by child
    const redeemedByChild: Record<string, number> = {};
    for (const r of redemptions) {
      redeemedByChild[r.childId] = (redeemedByChild[r.childId] ?? 0) + r.points;
    }

    return NextResponse.json({ year, children, monthlyData, redeemedByChild });
  } catch (error) {
    return handleApiError(error);
  }
}
