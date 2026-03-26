import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { notDeleted } from "@/lib/soft-delete";
import { getMonthRange, getCurrentMonth } from "@/lib/date-utils";

export async function GET() {
  try {
    const { year, month } = getCurrentMonth();
    const { gte, lt } = getMonthRange(year, month);
    const monthFilter = { createdAt: { gte, lt }, ...notDeleted };

    const [children, monthlyByChild, allTimeByChild] = await Promise.all([
      prisma.child.findMany({
        where: notDeleted,
        select: {
          id: true,
          name: true,
          emoji: true,
          avatarUrl: true,
          activities: {
            where: monthFilter,
            select: {
              points: true,
              createdAt: true,
              category: { select: { name: true, type: true, icon: true } },
              categoryLevel: { select: { label: true } },
            },
            orderBy: { createdAt: "desc" },
            take: 5,
          },
        },
        orderBy: { createdAt: "asc" },
      }),
      prisma.activity.groupBy({
        by: ["childId"],
        where: monthFilter,
        _sum: { points: true },
      }),
      prisma.activity.groupBy({
        by: ["childId"],
        where: notDeleted,
        _sum: { points: true },
      }),
    ]);

    const monthlyMap = new Map(monthlyByChild.map((p) => [p.childId, p._sum.points ?? 0]));
    const allTimeMap = new Map(allTimeByChild.map((p) => [p.childId, p._sum.points ?? 0]));

    const result = children.map((child) => ({
      id: child.id,
      name: child.name,
      emoji: child.emoji,
      avatarUrl: child.avatarUrl,
      monthlyPoints: monthlyMap.get(child.id) ?? 0,
      allTimePoints: allTimeMap.get(child.id) ?? 0,
      recentActivities: child.activities.map((a) => ({
        points: a.points,
        createdAt: a.createdAt,
        categoryName: a.category.name,
        categoryIcon: a.category.icon,
        categoryType: a.category.type,
        levelLabel: a.categoryLevel.label,
      })),
    }));

    return NextResponse.json({ year, month, children: result });
  } catch {
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}
