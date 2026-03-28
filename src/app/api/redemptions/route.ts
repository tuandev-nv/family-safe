import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { handleApiError } from "@/lib/api-error";
import { notDeleted } from "@/lib/soft-delete";
import { z } from "zod";

const redemptionSchema = z.object({
  childId: z.string().min(1),
  points: z.number().int().min(1, "Điểm phải lớn hơn 0"),
  description: z.string().min(1, "Mô tả không được để trống").max(200),
});

export async function GET(request: NextRequest) {
  try {
    const childId = request.nextUrl.searchParams.get("childId");
    const where: Record<string, unknown> = { ...notDeleted };
    if (childId) where.childId = childId;

    const redemptions = await prisma.redemption.findMany({
      where,
      include: { child: { select: { name: true, emoji: true, avatarUrl: true } } },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(redemptions);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = redemptionSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const redemption = await prisma.redemption.create({
      data: {
        childId: parsed.data.childId,
        points: parsed.data.points,
        description: parsed.data.description,
      },
      include: { child: { select: { name: true, emoji: true, avatarUrl: true } } },
    });

    return NextResponse.json(redemption, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
