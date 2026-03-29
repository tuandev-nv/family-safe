import { z } from "zod";

export const activitySchema = z.object({
  childId: z.string().min(1, "Chọn trẻ em"),
  categoryId: z.string().min(1, "Chọn danh mục"),
  categoryLevelId: z.string().min(1, "Chọn cấp độ").optional(),
  customLabel: z.string().min(1).max(100).optional(),
  customPoints: z.number().int().optional(),
  note: z.string().max(500).optional(),
}).refine(
  (data) => data.categoryLevelId || (data.customLabel && data.customPoints !== undefined),
  { message: "Chọn cấp độ hoặc tự nhập", path: ["categoryLevelId"] },
);

export type ActivityInput = z.infer<typeof activitySchema>;
