import { z } from "zod";

export const categoryLevelSchema = z.object({
  id: z.string().optional(),
  label: z.string().min(1, "Tên cấp độ không được để trống"),
  points: z.number().int(),
  sortOrder: z.number().int().default(0),
});

export const categorySchema = z.object({
  name: z.string().min(1, "Tên danh mục không được để trống").max(100),
  type: z.enum(["REWARD", "PENALTY"]),
  icon: z.string().min(1).max(4).default("⭐"),
  levels: z.array(categoryLevelSchema).min(1, "Cần ít nhất 1 cấp độ"),
});

export type CategoryLevelInput = z.infer<typeof categoryLevelSchema>;
export type CategoryInput = z.infer<typeof categorySchema>;
