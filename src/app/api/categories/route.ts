import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { categorySchema } from "@/lib/validations/category";
import { handleApiError } from "@/lib/api-error";
import { notDeleted } from "@/lib/soft-delete";

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      where: notDeleted,
      include: {
        levels: {
          where: notDeleted,
          orderBy: { sortOrder: "asc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(categories);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = categorySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const category = await prisma.category.create({
      data: {
        name: parsed.data.name,
        type: parsed.data.type,
        icon: parsed.data.icon,
        levels: {
          create: parsed.data.levels.map((level, index) => ({
            label: level.label,
            points: level.points,
            sortOrder: level.sortOrder ?? index,
          })),
        },
      },
      include: {
        levels: { orderBy: { sortOrder: "asc" } },
      },
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
