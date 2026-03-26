import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { handleApiError } from "@/lib/api-error";
import { notDeleted } from "@/lib/soft-delete";

export async function GET() {
  try {
    const children = await prisma.child.findMany({
      where: notDeleted,
      include: {
        activities: {
          where: notDeleted,
          select: { points: true, category: { select: { type: true } } },
        },
      },
      orderBy: { createdAt: "asc" },
    });

    const childrenSummary = children.map(({ activities, ...child }) => ({
      ...child,
      totalPoints: activities.reduce((sum, a) => sum + a.points, 0),
      rewardPoints: activities
        .filter((a) => a.category.type === "REWARD")
        .reduce((sum, a) => sum + a.points, 0),
      penaltyPoints: activities
        .filter((a) => a.category.type === "PENALTY")
        .reduce((sum, a) => sum + a.points, 0),
    }));

    const recentActivities = await prisma.activity.findMany({
      where: notDeleted,
      include: {
        child: true,
        category: true,
        categoryLevel: true,
      },
      orderBy: { createdAt: "desc" },
      take: 10,
    });

    // Daily points for last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const dailyActivities = await prisma.activity.findMany({
      where: { createdAt: { gte: thirtyDaysAgo }, ...notDeleted },
      select: {
        childId: true,
        points: true,
        createdAt: true,
      },
      orderBy: { createdAt: "asc" },
    });

    const dailyPoints: Record<string, Record<string, number>> = {};
    for (const activity of dailyActivities) {
      const date = activity.createdAt.toISOString().split("T")[0];
      if (!dailyPoints[date]) dailyPoints[date] = {};
      if (!dailyPoints[date][activity.childId])
        dailyPoints[date][activity.childId] = 0;
      dailyPoints[date][activity.childId] += activity.points;
    }

    const dailyPointsArray = Object.entries(dailyPoints).flatMap(
      ([date, childPoints]) =>
        Object.entries(childPoints).map(([childId, points]) => ({
          date,
          childId,
          points,
        }))
    );

    return NextResponse.json({
      children: childrenSummary,
      recentActivities,
      dailyPoints: dailyPointsArray,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
