import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { activitySchema } from "@/lib/validations/activity";
import { handleApiError } from "@/lib/api-error";
import { notDeleted } from "@/lib/soft-delete";
import { getMonthRange } from "@/lib/date-utils";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const childId = searchParams.get("childId");
    const type = searchParams.get("type");
    const from = searchParams.get("from");
    const to = searchParams.get("to");
    const monthParam = searchParams.get("month");
    const yearParam = searchParams.get("year");
    const page = parseInt(searchParams.get("page") ?? "1");
    const limit = parseInt(searchParams.get("limit") ?? "20");

    const where: Record<string, unknown> = { ...notDeleted };

    if (childId) where.childId = childId;
    if (type) where.category = { type, ...notDeleted };

    // Month/year filter takes precedence over from/to
    if (monthParam && yearParam) {
      const { gte, lt } = getMonthRange(parseInt(yearParam), parseInt(monthParam));
      where.createdAt = { gte, lt };
    } else if (from || to) {
      where.createdAt = {
        ...(from ? { gte: new Date(from) } : {}),
        ...(to ? { lte: new Date(to) } : {}),
      };
    }

    const [activities, total] = await Promise.all([
      prisma.activity.findMany({
        where,
        include: {
          child: true,
          category: true,
          categoryLevel: true,
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.activity.count({ where }),
    ]);

    return NextResponse.json({ activities, total, page, limit });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = activitySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const level = await prisma.categoryLevel.findFirst({
      where: { id: parsed.data.categoryLevelId, ...notDeleted },
    });

    if (!level) {
      return NextResponse.json(
        { error: "Cấp độ không tồn tại" },
        { status: 400 }
      );
    }

    const activity = await prisma.activity.create({
      data: {
        childId: parsed.data.childId,
        categoryId: parsed.data.categoryId,
        categoryLevelId: parsed.data.categoryLevelId,
        points: level.points,
        note: parsed.data.note ?? null,
      },
      include: {
        child: true,
        category: true,
        categoryLevel: true,
      },
    });

    return NextResponse.json(activity, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
