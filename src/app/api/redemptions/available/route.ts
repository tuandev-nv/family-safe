import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { handleApiError } from "@/lib/api-error";
import { notDeleted } from "@/lib/soft-delete";

export async function GET() {
  try {
    const now = new Date();
    const year = now.getFullYear();
    const yearStart = new Date(year, 0, 1);
    // End of last month = first day of current month
    const currentMonthStart = new Date(year, now.getMonth(), 1);

    const children = await prisma.child.findMany({
      where: notDeleted,
      select: { id: true, name: true, emoji: true, avatarUrl: true },
      orderBy: { createdAt: "asc" },
    });

    // Points earned from start of year to end of last month
    const [earnedByChild, redeemedByChild] = await Promise.all([
      prisma.activity.groupBy({
        by: ["childId"],
        where: {
          ...notDeleted,
          createdAt: { gte: yearStart, lt: currentMonthStart },
        },
        _sum: { points: true },
      }),
      prisma.redemption.groupBy({
        by: ["childId"],
        where: {
          ...notDeleted,
          createdAt: { gte: yearStart },
        },
        _sum: { points: true },
      }),
    ]);

    const earnedMap = new Map(earnedByChild.map((p) => [p.childId, p._sum.points ?? 0]));
    const redeemedMap = new Map(redeemedByChild.map((p) => [p.childId, p._sum.points ?? 0]));

    const result = children.map((child) => {
      const earned = earnedMap.get(child.id) ?? 0;
      const redeemed = redeemedMap.get(child.id) ?? 0;
      return {
        ...child,
        earned,
        redeemed,
        available: Math.max(0, earned - redeemed),
      };
    });

    return NextResponse.json(result);
  } catch (error) {
    return handleApiError(error);
  }
}
