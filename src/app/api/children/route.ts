import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { childSchema } from "@/lib/validations/child";
import { handleApiError } from "@/lib/api-error";
import { notDeleted } from "@/lib/soft-delete";

export async function GET() {
  try {
    const children = await prisma.child.findMany({
      where: notDeleted,
      include: {
        activities: {
          where: notDeleted,
          select: { points: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const result = children.map(({ activities, ...child }) => ({
      ...child,
      totalPoints: activities.reduce((sum, a) => sum + a.points, 0),
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
        birthDate: parsed.data.birthDate
          ? new Date(parsed.data.birthDate)
          : null,
      },
    });

    return NextResponse.json(child, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
