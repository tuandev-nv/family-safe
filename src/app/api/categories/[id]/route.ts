import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { categorySchema } from "@/lib/validations/category";
import { handleApiError } from "@/lib/api-error";
import { notDeleted } from "@/lib/soft-delete";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const category = await prisma.category.findFirst({
      where: { id, ...notDeleted },
      include: {
        levels: {
          where: notDeleted,
          orderBy: { sortOrder: "asc" },
        },
      },
    });

    if (!category) {
      return NextResponse.json({ error: "Không tìm thấy" }, { status: 404 });
    }

    return NextResponse.json(category);
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
    const parsed = categorySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const existingLevels = await prisma.categoryLevel.findMany({
      where: { categoryId: id, ...notDeleted },
    });

    const incomingIds = parsed.data.levels
      .map((l) => l.id)
      .filter((levelId): levelId is string => !!levelId);

    const toSoftDelete = existingLevels.filter((l) => !incomingIds.includes(l.id));

    // Check if levels to soft-delete have active activities
    for (const level of toSoftDelete) {
      const count = await prisma.activity.count({
        where: { categoryLevelId: level.id, ...notDeleted },
      });
      if (count > 0) {
        return NextResponse.json(
          {
            error: `Không thể xóa cấp độ "${level.label}" vì đã có ${count} hoạt động sử dụng`,
          },
          { status: 400 }
        );
      }
    }

    const category = await prisma.$transaction(async (tx) => {
      // Soft delete removed levels
      if (toSoftDelete.length > 0) {
        await tx.categoryLevel.updateMany({
          where: { id: { in: toSoftDelete.map((l) => l.id) } },
          data: { deletedAt: new Date() },
        });
      }

      // Upsert levels
      for (const level of parsed.data.levels) {
        if (level.id) {
          await tx.categoryLevel.update({
            where: { id: level.id },
            data: {
              label: level.label,
              points: level.points,
              sortOrder: level.sortOrder,
            },
          });
        } else {
          await tx.categoryLevel.create({
            data: {
              categoryId: id,
              label: level.label,
              points: level.points,
              sortOrder: level.sortOrder,
            },
          });
        }
      }

      return tx.category.update({
        where: { id },
        data: {
          name: parsed.data.name,
          type: parsed.data.type,
          icon: parsed.data.icon,
        },
        include: {
          levels: {
            where: notDeleted,
            orderBy: { sortOrder: "asc" },
          },
        },
      });
    });

    return NextResponse.json(category);
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

    const activityCount = await prisma.activity.count({
      where: { categoryId: id, ...notDeleted },
    });

    if (activityCount > 0) {
      return NextResponse.json(
        {
          error: `Không thể xóa danh mục này vì đã có ${activityCount} hoạt động sử dụng`,
        },
        { status: 400 }
      );
    }

    // Soft delete category and its levels
    await prisma.$transaction([
      prisma.categoryLevel.updateMany({
        where: { categoryId: id, ...notDeleted },
        data: { deletedAt: new Date() },
      }),
      prisma.category.update({
        where: { id },
        data: { deletedAt: new Date() },
      }),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}
