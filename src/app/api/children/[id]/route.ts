import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { childSchema } from "@/lib/validations/child";
import { handleApiError } from "@/lib/api-error";
import { notDeleted } from "@/lib/soft-delete";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const child = await prisma.child.findFirst({
      where: { id, ...notDeleted },
      include: {
        activities: {
          where: notDeleted,
          include: { category: true, categoryLevel: true },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!child) {
      return NextResponse.json({ error: "Không tìm thấy" }, { status: 404 });
    }

    const totalPoints = child.activities.reduce((sum, a) => sum + a.points, 0);
    const rewardPoints = child.activities
      .filter((a) => a.points > 0)
      .reduce((sum, a) => sum + a.points, 0);
    const penaltyPoints = child.activities
      .filter((a) => a.points < 0)
      .reduce((sum, a) => sum + a.points, 0);

    return NextResponse.json({
      ...child,
      totalPoints,
      rewardPoints,
      penaltyPoints,
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
