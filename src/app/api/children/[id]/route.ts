import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { childSchema } from "@/lib/validations/child";
import { handleApiError } from "@/lib/api-error";
import { notDeleted } from "@/lib/soft-delete";
import { getMonthRange, parseMonthParams } from "@/lib/date-utils";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { year, month } = parseMonthParams(request.nextUrl.searchParams);
    const { gte, lt } = getMonthRange(year, month);
    const monthFilter = { childId: id, createdAt: { gte, lt }, ...notDeleted };

    const [child, activities, monthlyTotals, allTimeTotals] = await Promise.all([
      prisma.child.findFirst({ where: { id, ...notDeleted } }),
      prisma.activity.findMany({
        where: monthFilter,
        include: { category: true, categoryLevel: true },
        orderBy: { createdAt: "desc" },
      }),
      prisma.activity.aggregate({
        where: monthFilter,
        _sum: { points: true },
      }),
      prisma.activity.aggregate({
        where: { childId: id, ...notDeleted },
        _sum: { points: true },
      }),
    ]);

    if (!child) {
      return NextResponse.json({ error: "Không tìm thấy" }, { status: 404 });
    }

    const monthlyPoints = monthlyTotals._sum.points ?? 0;
    const allTimePoints = allTimeTotals._sum.points ?? 0;
    const rewardPoints = activities.filter((a) => a.points > 0).reduce((s, a) => s + a.points, 0);
    const penaltyPoints = activities.filter((a) => a.points < 0).reduce((s, a) => s + a.points, 0);

    return NextResponse.json({
      ...child,
      activities,
      monthlyPoints,
      allTimePoints,
      totalPoints: monthlyPoints,
      rewardPoints,
      penaltyPoints,
      year,
      month,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const parsed = childSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const child = await prisma.child.update({
      where: { id },
      data: {
        name: parsed.data.name,
        emoji: parsed.data.emoji,
        avatarUrl: parsed.data.avatarUrl || null,
        birthDate: parsed.data.birthDate
          ? new Date(parsed.data.birthDate)
          : null,
      },
    });

    return NextResponse.json(child);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Soft delete child and all their activities
    await prisma.$transaction([
      prisma.activity.updateMany({
        where: { childId: id, ...notDeleted },
        data: { deletedAt: new Date() },
      }),
      prisma.child.update({
        where: { id },
        data: { deletedAt: new Date() },
      }),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}
