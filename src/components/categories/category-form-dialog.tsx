"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const ICON_OPTIONS = [
  "⭐", "📚", "🏃", "🧹", "🍎", "💤", "🎵", "🎨",
  "⚠️", "👊", "📱", "🗣️", "😤", "🚫", "💢", "🙈",
];

interface Level {
  id?: string;
  label: string;
  points: number;
  sortOrder: number;
}

interface CategoryData {
  id?: string;
  name: string;
  type: string;
  icon: string;
  levels: Level[];
}

interface CategoryFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: CategoryData;
  onSuccess: () => void;
}

export function CategoryFormDialog({
  open,
  onOpenChange,
  initialData,
  onSuccess,
}: CategoryFormDialogProps) {
  const [name, setName] = useState("");
  const [type, setType] = useState<"REWARD" | "PENALTY">("REWARD");
  const [icon, setIcon] = useState("⭐");
  const [levels, setLevels] = useState<Level[]>([{ label: "", points: 0, sortOrder: 0 }]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isEdit = !!initialData?.id;

  useEffect(() => {
    if (open) {
      setName(initialData?.name ?? "");
      setType((initialData?.type as "REWARD" | "PENALTY") ?? "REWARD");
      setIcon(initialData?.icon ?? "⭐");
      setLevels(initialData?.levels ?? [{ label: "", points: 0, sortOrder: 0 }]);
      setError("");
    }
  }, [open, initialData]);

  function addLevel() {
    setLevels((prev) => [...prev, { label: "", points: 0, sortOrder: prev.length }]);
  }

  function removeLevel(index: number) {
    setLevels((prev) => prev.filter((_, i) => i !== index));
  }

  function updateLevel(index: number, field: keyof Level, value: string | number) {
    setLevels((prev) => prev.map((level, i) => i === index ? { ...level, [field]: value } : level));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const url = isEdit ? `/api/categories/${initialData!.id}` : "/api/categories";

    const res = await fetch(url, {
      method: isEdit ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name, type, icon,
        levels: levels.map((l, i) => ({
          ...l, sortOrder: i,
          points: type === "PENALTY" && l.points > 0 ? -l.points : l.points,
        })),
      }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(typeof data.error === "string" ? data.error : JSON.stringify(data.error));
      setLoading(false);
      return;
    }

    setLoading(false);
    onSuccess();
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-purple-100 flex items-center justify-center text-lg">
              {isEdit ? "✏️" : "📋"}
            </span>
            {isEdit ? "Sửa danh mục" : "Thêm danh mục"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 mt-2">
          {/* Type selector */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Loại</label>
            <div className="flex gap-2">
              <button type="button" onClick={() => setType("REWARD")}
                className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                  type === "REWARD"
                    ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md shadow-emerald-500/20"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}>
                🎁 Thưởng
              </button>
              <button type="button" onClick={() => setType("PENALTY")}
                className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                  type === "PENALTY"
                    ? "bg-gradient-to-r from-rose-500 to-orange-500 text-white shadow-md shadow-rose-500/20"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}>
                ⚠️ Phạt
              </button>
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">Tên danh mục</label>
            <Input value={name} onChange={(e) => setName(e.target.value)}
              placeholder={type === "REWARD" ? "VD: Làm bài tập" : "VD: Đánh nhau"}
              required className="h-11 rounded-xl bg-white border-gray-200 text-base" />
          </div>

          {/* Icon */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Biểu tượng</label>
            <div className="flex flex-wrap gap-1.5">
              {ICON_OPTIONS.map((i) => (
                <button key={i} type="button" onClick={() => setIcon(i)}
                  className={`text-2xl w-11 h-11 rounded-xl border-2 transition-all cursor-pointer ${
                    icon === i
                      ? "border-purple-500 bg-purple-50 shadow-md shadow-purple-500/10 scale-110"
                      : "border-gray-100 bg-white hover:border-purple-300"
                  }`}>
                  {i}
                </button>
              ))}
            </div>
          </div>

          {/* Levels */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-bold text-gray-700">Cấp độ</label>
              <button type="button" onClick={addLevel}
                className="text-sm font-bold text-purple-600 hover:text-purple-800 transition-colors cursor-pointer">
                + Thêm cấp độ
              </button>
            </div>
            <div className="space-y-2">
              {levels.map((level, index) => (
                <div key={level.id ?? `new-${index}`} className="flex items-center gap-2">
                  <Input placeholder="Tên cấp độ" value={level.label}
                    onChange={(e) => updateLevel(index, "label", e.target.value)}
                    className="flex-1 h-10 rounded-xl bg-white border-gray-200" required />
                  <div className="flex items-center gap-1">
                    <span className={`text-sm font-bold ${type === "REWARD" ? "text-emerald-500" : "text-rose-500"}`}>
                      {type === "REWARD" ? "+" : "-"}
                    </span>
                    <Input type="number" min={0} placeholder="0" value={Math.abs(level.points)}
                      onChange={(e) => updateLevel(index, "points", parseInt(e.target.value) || 0)}
                      className="w-20 h-10 rounded-xl bg-white border-gray-200 text-center" required />
                  </div>
                  {levels.length > 1 && (
                    <button type="button" onClick={() => removeLevel(index)}
                      className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-rose-100 text-gray-400 hover:text-rose-500 transition-colors flex items-center justify-center cursor-pointer">
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-sm text-rose-600 font-medium">{error}</div>
          )}

          <div className="flex gap-3 justify-end pt-2 border-t border-gray-100">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="px-6 h-11 rounded-xl">
              Hủy
            </Button>
            <Button type="submit" disabled={loading}
              className="px-8 h-11 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg shadow-purple-500/25 text-base font-bold">
              {loading ? "Đang lưu..." : isEdit ? "Cập nhật" : "Thêm"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
