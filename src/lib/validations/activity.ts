import { z } from "zod";

export const activitySchema = z.object({
  childId: z.string().min(1, "Chọn trẻ em"),
  categoryId: z.string().min(1, "Chọn danh mục"),
  categoryLevelId: z.string().min(1, "Chọn cấp độ"),
  note: z.string().max(500).optional(),
});

export type ActivityInput = z.infer<typeof activitySchema>;
