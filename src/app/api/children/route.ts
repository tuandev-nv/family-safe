import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { childSchema } from "@/lib/validations/child";
import { handleApiError } from "@/lib/api-error";
import { notDeleted } from "@/lib/soft-delete";
import { getMonthRange, parseMonthParams } from "@/lib/date-utils";

export async function GET(request: NextRequest) {
  try {
    const { year, month } = parseMonthParams(request.nextUrl.searchParams);
    const { gte, lt } = getMonthRange(year, month);
    const monthFilter = { createdAt: { gte, lt }, ...notDeleted };

    const [children, monthlyByChild, allTimeByChild] = await Promise.all([
      prisma.child.findMany({ where: notDeleted, orderBy: { createdAt: "desc" } }),
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
      ...child,
      monthlyPoints: monthlyMap.get(child.id) ?? 0,
      allTimePoints: allTimeMap.get(child.id) ?? 0,
      // Keep totalPoints as alias for backward compat
      totalPoints: monthlyMap.get(child.id) ?? 0,
    }));

    return NextResponse.json(result);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = childSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const child = await prisma.child.create({
      data: {
        name: parsed.data.name,
        emoji: parsed.data.emoji,
        avatarUrl: parsed.data.avatarUrl || null,
        birthDate: parsed.data.birthDate ? new Date(parsed.data.birthDate) : null,
      },
    });

    return NextResponse.json(child, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
