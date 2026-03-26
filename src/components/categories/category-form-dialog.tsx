"use client";

import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormError } from "@/components/ui/form-error";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { categoryFormSchema, type CategoryFormData } from "@/lib/validations/forms";

const ICON_OPTIONS = [
  "⭐", "📚", "🏃", "🧹", "🍎", "💤", "🎵", "🎨",
  "⚠️", "👊", "📱", "🗣️", "😤", "🚫", "💢", "🙈",
];

interface CategoryData {
  id?: string;
  name: string;
  type: string;
  icon: string;
  levels: Array<{ id?: string; label: string; points: number; sortOrder: number }>;
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: CategoryData;
  onSuccess: () => void;
}

export function CategoryFormDialog({ open, onOpenChange, initialData, onSuccess }: Props) {
  const [apiError, setApiError] = useState("");
  const isEdit = !!initialData?.id;

  const { register, handleSubmit, setValue, watch, reset, control, formState: { errors, isSubmitting } } = useForm<CategoryFormData>({
    resolver: zodResolver(categoryFormSchema),
  });

  const { fields, append, remove } = useFieldArray({ control, name: "levels" });
  const type = watch("type", "REWARD");
  const icon = watch("icon", "⭐");

  useEffect(() => {
    if (open) {
      reset({
        name: initialData?.name ?? "",
        type: (initialData?.type as "REWARD" | "PENALTY") ?? "REWARD",
        icon: initialData?.icon ?? "⭐",
        levels: initialData?.levels ?? [{ label: "", points: 0, sortOrder: 0 }],
      });
      setApiError("");
    }
  }, [open, initialData, reset]);

  async function onSubmit(data: CategoryFormData) {
    setApiError("");
    const url = isEdit ? `/api/categories/${initialData!.id}` : "/api/categories";
    const res = await fetch(url, {
      method: isEdit ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...data,
        levels: data.levels.map((l, i) => ({
          ...l, sortOrder: i,
          points: data.type === "PENALTY" && l.points > 0 ? -l.points : l.points,
        })),
      }),
    });
    if (!res.ok) {
      const err = await res.json();
      setApiError(typeof err.error === "string" ? err.error : JSON.stringify(err.error));
      return;
    }
    onSuccess();
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-purple-100 flex items-center justify-center text-lg">{isEdit ? "✏️" : "📋"}</span>
            {isEdit ? "Sửa danh mục" : "Thêm danh mục"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5 mt-2">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Loại</label>
            <div className="flex gap-2">
              <button type="button" onClick={() => setValue("type", "REWARD")}
                className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                  type === "REWARD" ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md shadow-emerald-500/20" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}>🎁 Thưởng</button>
              <button type="button" onClick={() => setValue("type", "PENALTY")}
                className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                  type === "PENALTY" ? "bg-gradient-to-r from-rose-500 to-orange-500 text-white shadow-md shadow-rose-500/20" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}>⚠️ Phạt</button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">Tên danh mục</label>
            <Input {...register("name")} placeholder={type === "REWARD" ? "VD: Làm bài tập" : "VD: Đánh nhau"} className="h-11 rounded-xl bg-white border-gray-200 text-base" />
            <FormError message={errors.name?.message} />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Biểu tượng</label>
            <div className="flex flex-wrap gap-1.5">
              {ICON_OPTIONS.map((i) => (
                <button key={i} type="button" onClick={() => setValue("icon", i)}
                  className={`text-2xl w-11 h-11 rounded-xl border-2 transition-all cursor-pointer ${
                    icon === i ? "border-purple-500 bg-purple-50 shadow-md shadow-purple-500/10 scale-110" : "border-gray-100 bg-white hover:border-purple-300"
                  }`}>{i}</button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-bold text-gray-700">Cấp độ</label>
              <button type="button" onClick={() => append({ label: "", points: 0, sortOrder: fields.length })}
                className="text-sm font-bold text-purple-600 hover:text-purple-800 transition-colors cursor-pointer">+ Thêm cấp độ</button>
            </div>
            <FormError message={errors.levels?.message} />
            <div className="space-y-2">
              {fields.map((field, index) => (
                <div key={field.id} className="flex items-center gap-2">
                  <div className="flex-1">
                    <Input {...register(`levels.${index}.label`)} placeholder="Tên cấp độ" className="h-10 rounded-xl bg-white border-gray-200" />
                    <FormError message={errors.levels?.[index]?.label?.message} />
                  </div>
                  <div className="flex items-center gap-1">
                    <span className={`text-sm font-bold ${type === "REWARD" ? "text-emerald-500" : "text-rose-500"}`}>{type === "REWARD" ? "+" : "-"}</span>
                    <Input type="number" {...register(`levels.${index}.points`, { valueAsNumber: true })} placeholder="0" className="w-20 h-10 rounded-xl bg-white border-gray-200 text-center" />
                  </div>
                  {fields.length > 1 && (
                    <button type="button" onClick={() => remove(index)}
                      className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-rose-100 text-gray-400 hover:text-rose-500 transition-colors flex items-center justify-center cursor-pointer">✕</button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {apiError && <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-sm text-rose-600 font-medium">{apiError}</div>}

          <div className="flex gap-3 justify-end pt-2 border-t border-gray-100">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="px-6 h-11 rounded-xl">Hủy</Button>
            <Button type="submit" disabled={isSubmitting} className="px-8 h-11 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg shadow-purple-500/25 text-base font-bold">
              {isSubmitting ? "Đang lưu..." : isEdit ? "Cập nhật" : "Thêm"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
