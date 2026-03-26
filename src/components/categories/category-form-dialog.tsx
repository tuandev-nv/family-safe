"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  const [name, setName] = useState(initialData?.name ?? "");
  const [type, setType] = useState<"REWARD" | "PENALTY">(
    (initialData?.type as "REWARD" | "PENALTY") ?? "REWARD"
  );
  const [icon, setIcon] = useState(initialData?.icon ?? "⭐");
  const [levels, setLevels] = useState<Level[]>(
    initialData?.levels ?? [{ label: "", points: 0, sortOrder: 0 }]
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isEdit = !!initialData?.id;

  function resetForm() {
    setName(initialData?.name ?? "");
    setType((initialData?.type as "REWARD" | "PENALTY") ?? "REWARD");
    setIcon(initialData?.icon ?? "⭐");
    setLevels(
      initialData?.levels ?? [{ label: "", points: 0, sortOrder: 0 }]
    );
    setError("");
  }

  function addLevel() {
    setLevels((prev) => [
      ...prev,
      { label: "", points: 0, sortOrder: prev.length },
    ]);
  }

  function removeLevel(index: number) {
    setLevels((prev) => prev.filter((_, i) => i !== index));
  }

  function updateLevel(index: number, field: keyof Level, value: string | number) {
    setLevels((prev) =>
      prev.map((level, i) =>
        i === index ? { ...level, [field]: value } : level
      )
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const url = isEdit
      ? `/api/categories/${initialData!.id}`
      : "/api/categories";

    const res = await fetch(url, {
      method: isEdit ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        type,
        icon,
        levels: levels.map((l, i) => ({
          ...l,
          sortOrder: i,
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
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (v) resetForm();
        onOpenChange(v);
      }}
    >
      <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Sửa danh mục" : "Thêm danh mục"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Loại</Label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant={type === "REWARD" ? "default" : "outline"}
                onClick={() => setType("REWARD")}
                size="sm"
              >
                🎁 Thưởng
              </Button>
              <Button
                type="button"
                variant={type === "PENALTY" ? "destructive" : "outline"}
                onClick={() => setType("PENALTY")}
                size="sm"
              >
                ⚠️ Phạt
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cat-name">Tên danh mục</Label>
            <Input
              id="cat-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={type === "REWARD" ? "VD: Làm bài tập" : "VD: Đánh nhau"}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Biểu tượng</Label>
            <div className="flex flex-wrap gap-1.5">
              {ICON_OPTIONS.map((i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setIcon(i)}
                  className={`text-xl p-1.5 rounded-lg border-2 transition-colors ${
                    icon === i
                      ? "border-primary bg-primary/10"
                      : "border-transparent hover:border-muted"
                  }`}
                >
                  {i}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Cấp độ</Label>
              <Button type="button" variant="outline" size="sm" onClick={addLevel}>
                + Thêm
              </Button>
            </div>
            <div className="space-y-2">
              {levels.map((level, index) => (
                <div key={level.id ?? `new-${index}`} className="flex items-center gap-2">
                  <Input
                    placeholder="Tên cấp độ"
                    value={level.label}
                    onChange={(e) => updateLevel(index, "label", e.target.value)}
                    className="flex-1"
                    required
                  />
                  <div className="flex items-center gap-1">
                    <span className="text-sm text-muted-foreground">
                      {type === "REWARD" ? "+" : "-"}
                    </span>
                    <Input
                      type="number"
                      min={0}
                      placeholder="Điểm"
                      value={Math.abs(level.points)}
                      onChange={(e) =>
                        updateLevel(index, "points", parseInt(e.target.value) || 0)
                      }
                      className="w-20"
                      required
                    />
                  </div>
                  {levels.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeLevel(index)}
                    >
                      ✕
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <div className="flex gap-2 justify-end pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Đang lưu..." : isEdit ? "Cập nhật" : "Thêm"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
