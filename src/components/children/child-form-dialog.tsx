"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormError } from "@/components/ui/form-error";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { childFormSchema, type ChildFormData } from "@/lib/validations/forms";

const EMOJI_OPTIONS = [
  "👦", "👧", "👶", "🧒", "👱‍♂️", "👱‍♀️",
  "🐱", "🐶", "🦊", "🐼", "🐰", "🦁",
  "⭐", "🌟", "💫", "🌈", "🎯", "🎨",
];

interface ChildData {
  id?: string;
  name: string;
  emoji: string;
  avatarUrl?: string | null;
  birthDate: string | null;
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: ChildData;
  onSuccess: () => void;
}

export function ChildFormDialog({ open, onOpenChange, initialData, onSuccess }: Props) {
  const [apiError, setApiError] = useState("");
  const isEdit = !!initialData?.id;

  const { register, handleSubmit, setValue, watch, reset, formState: { errors, isSubmitting } } = useForm<ChildFormData>({
    resolver: zodResolver(childFormSchema),
  });

  const emoji = watch("emoji", "👦");
  const avatarUrl = watch("avatarUrl", "");

  useEffect(() => {
    if (open) {
      reset({
        name: initialData?.name ?? "",
        emoji: initialData?.emoji ?? "👦",
        avatarUrl: initialData?.avatarUrl ?? "",
        birthDate: initialData?.birthDate?.split("T")[0] ?? "",
      });
      setApiError("");
    }
  }, [open, initialData, reset]);

  async function onSubmit(data: ChildFormData) {
    setApiError("");
    const url = isEdit ? `/api/children/${initialData!.id}` : "/api/children";
    const res = await fetch(url, {
      method: isEdit ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, avatarUrl: data.avatarUrl || null, birthDate: data.birthDate || null }),
    });
    if (!res.ok) {
      const err = await res.json();
      setApiError(err.error ? JSON.stringify(err.error) : "Có lỗi xảy ra");
      return;
    }
    onSuccess();
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-purple-100 flex items-center justify-center text-lg">{isEdit ? "✏️" : "👶"}</span>
            {isEdit ? "Sửa thông tin trẻ" : "Thêm trẻ em"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5 mt-2">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">Tên</label>
            <Input {...register("name")} placeholder="Nhập tên..." className="h-11 rounded-xl bg-white border-gray-200 text-base" />
            <FormError message={errors.name?.message} />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Biểu tượng</label>
            <div className="flex flex-wrap gap-1.5">
              {EMOJI_OPTIONS.map((e) => (
                <button key={e} type="button" onClick={() => setValue("emoji", e)}
                  className={`text-2xl w-11 h-11 rounded-xl border-2 transition-all cursor-pointer ${
                    emoji === e ? "border-purple-500 bg-purple-50 shadow-md shadow-purple-500/10 scale-110" : "border-gray-100 bg-white hover:border-purple-300"
                  }`}>{e}</button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">Ảnh đại diện (tùy chọn)</label>
            <div className="flex gap-3 items-start">
              <Input {...register("avatarUrl")} type="url" placeholder="Dán link ảnh vào đây..." className="h-11 rounded-xl bg-white border-gray-200 flex-1" />
              {avatarUrl && (
                <div className="w-14 h-14 rounded-xl overflow-hidden border-2 border-purple-200 bg-gray-50 shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={avatarUrl} alt="" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                </div>
              )}
            </div>
            <p className="text-xs text-gray-400 mt-1">Nếu có ảnh, ảnh sẽ thay thế biểu tượng emoji</p>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">Ngày sinh (tùy chọn)</label>
            <Input {...register("birthDate")} type="date" className="h-11 rounded-xl bg-white border-gray-200" />
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
