"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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

interface CategoryFormProps {
  initialData?: {
    id: string;
    name: string;
    type: string;
    icon: string;
    levels: Level[];
  };
}

export function CategoryForm({ initialData }: CategoryFormProps) {
  const router = useRouter();
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

  const isEdit = !!initialData;

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
      ? `/api/categories/${initialData.id}`
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
          points:
            type === "PENALTY" && l.points > 0 ? -l.points : l.points,
        })),
      }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(typeof data.error === "string" ? data.error : JSON.stringify(data.error));
      setLoading(false);
      return;
    }

    router.push("/categories");
    router.refresh();
  }

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>
          {isEdit ? "Sửa danh mục" : "Thêm danh mục"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Loại</Label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant={type === "REWARD" ? "default" : "outline"}
                onClick={() => setType("REWARD")}
              >
                🎁 Thưởng
              </Button>
              <Button
                type="button"
                variant={type === "PENALTY" ? "destructive" : "outline"}
                onClick={() => setType("PENALTY")}
              >
                ⚠️ Phạt
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Tên danh mục</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={
                type === "REWARD" ? "VD: Làm bài tập" : "VD: Đánh nhau"
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Biểu tượng</Label>
            <div className="flex flex-wrap gap-2">
              {ICON_OPTIONS.map((i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setIcon(i)}
                  className={`text-2xl p-2 rounded-md border-2 transition-colors ${
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
                + Thêm cấp độ
              </Button>
            </div>

            <div className="space-y-2">
              {levels.map((level, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    placeholder="Tên cấp độ (VD: Tốt, Xuất sắc)"
                    value={level.label}
                    onChange={(e) =>
                      updateLevel(index, "label", e.target.value)
                    }
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
                      className="w-24"
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

          <div className="flex gap-2">
            <Button type="submit" disabled={loading}>
              {loading ? "Đang lưu..." : isEdit ? "Cập nhật" : "Thêm"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Hủy
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
