import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { handleApiError } from "@/lib/api-error";
import { notDeleted } from "@/lib/soft-delete";
import { getMonthRange, parseMonthParams } from "@/lib/date-utils";

export async function GET(request: NextRequest) {
  try {
    const { year, month } = parseMonthParams(request.nextUrl.searchParams);
    const { gte, lt } = getMonthRange(year, month);
    const monthFilter = { createdAt: { gte, lt }, ...notDeleted };

    const [
      children,
      monthlyByChild,
      monthlyRewardByChild,
      monthlyPenaltyByChild,
      allTimeByChild,
      recentActivities,
      dailyActivities,
    ] = await Promise.all([
      prisma.child.findMany({
        where: notDeleted,
        select: { id: true, name: true, emoji: true, avatarUrl: true, birthDate: true, createdAt: true, updatedAt: true },
        orderBy: { createdAt: "asc" },
      }),
      prisma.activity.groupBy({
        by: ["childId"],
        where: monthFilter,
        _sum: { points: true },
      }),
      prisma.activity.groupBy({
        by: ["childId"],
        where: { ...monthFilter, category: { type: "REWARD" } },
        _sum: { points: true },
      }),
      prisma.activity.groupBy({
        by: ["childId"],
        where: { ...monthFilter, category: { type: "PENALTY" } },
        _sum: { points: true },
      }),
      prisma.activity.groupBy({
        by: ["childId"],
        where: notDeleted,
        _sum: { points: true },
      }),
      prisma.activity.findMany({
        where: monthFilter,
        include: { child: true, category: true, categoryLevel: true },
        orderBy: { createdAt: "desc" },
        take: 10,
      }),
      prisma.activity.findMany({
        where: monthFilter,
        select: { childId: true, points: true, createdAt: true },
        orderBy: { createdAt: "asc" },
      }),
    ]);

    const monthlyMap = new Map(monthlyByChild.map((p) => [p.childId, p._sum.points ?? 0]));
    const rewardMap = new Map(monthlyRewardByChild.map((p) => [p.childId, p._sum.points ?? 0]));
    const penaltyMap = new Map(monthlyPenaltyByChild.map((p) => [p.childId, p._sum.points ?? 0]));
    const allTimeMap = new Map(allTimeByChild.map((p) => [p.childId, p._sum.points ?? 0]));

    const childrenSummary = children.map((child) => ({
      ...child,
      monthlyPoints: monthlyMap.get(child.id) ?? 0,
      rewardPoints: rewardMap.get(child.id) ?? 0,
      penaltyPoints: penaltyMap.get(child.id) ?? 0,
      allTimePoints: allTimeMap.get(child.id) ?? 0,
    }));

    const dailyPoints: Record<string, Record<string, number>> = {};
    for (const activity of dailyActivities) {
      const date = activity.createdAt.toISOString().split("T")[0];
      if (!dailyPoints[date]) dailyPoints[date] = {};
      if (!dailyPoints[date][activity.childId]) dailyPoints[date][activity.childId] = 0;
      dailyPoints[date][activity.childId] += activity.points;
    }

    const dailyPointsArray = Object.entries(dailyPoints).flatMap(
      ([date, childPoints]) =>
        Object.entries(childPoints).map(([childId, points]) => ({ date, childId, points }))
    );

    return NextResponse.json({
      year,
      month,
      children: childrenSummary,
      recentActivities,
      dailyPoints: dailyPointsArray,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
