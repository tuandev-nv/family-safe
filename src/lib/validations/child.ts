import { z } from "zod";

export const childSchema = z.object({
  name: z.string().min(1, "Tên không được để trống").max(50),
  emoji: z.string().min(1).max(4).default("👦"),
  avatarUrl: z.string().url("URL không hợp lệ").nullable().optional().or(z.literal("")),
  birthDate: z.string().nullable().optional(),
});

export type ChildInput = z.infer<typeof childSchema>;
