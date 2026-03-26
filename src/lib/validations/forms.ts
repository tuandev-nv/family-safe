import { z } from "zod";

export const childFormSchema = z.object({
  name: z.string().min(1, "Vui lòng nhập tên"),
  emoji: z.string().min(1),
  avatarUrl: z.string().optional(),
  birthDate: z.string().optional(),
});

export const categoryFormSchema = z.object({
  name: z.string().min(1, "Vui lòng nhập tên danh mục"),
  type: z.enum(["REWARD", "PENALTY"]),
  icon: z.string().min(1),
  levels: z.array(z.object({
    id: z.string().optional(),
    label: z.string().min(1, "Vui lòng nhập tên cấp độ"),
    points: z.number(),
    sortOrder: z.number(),
  })).min(1, "Cần ít nhất 1 cấp độ"),
});

export const redemptionFormSchema = z.object({
  childId: z.string().min(1, "Vui lòng chọn bé"),
  points: z.number({ error: "Vui lòng nhập số điểm" }).int().min(1, "Điểm phải lớn hơn 0"),
  description: z.string().min(1, "Vui lòng nhập mô tả"),
});

export type ChildFormData = z.infer<typeof childFormSchema>;
export type CategoryFormData = z.infer<typeof categoryFormSchema>;
export type RedemptionFormData = z.infer<typeof redemptionFormSchema>;
