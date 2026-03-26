"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const EMOJI_OPTIONS = [
  "👦", "👧", "👶", "🧒", "👱‍♂️", "👱‍♀️",
  "🐱", "🐶", "🦊", "🐼", "🐰", "🦁",
  "⭐", "🌟", "💫", "🌈", "🎯", "🎨",
];

interface ChildFormProps {
  initialData?: {
    id: string;
    name: string;
    emoji: string;
    birthDate: string | null;
  };
}

export function ChildForm({ initialData }: ChildFormProps) {
  const router = useRouter();
  const [name, setName] = useState(initialData?.name ?? "");
  const [emoji, setEmoji] = useState(initialData?.emoji ?? "👦");
  const [birthDate, setBirthDate] = useState(
    initialData?.birthDate?.split("T")[0] ?? ""
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isEdit = !!initialData;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const url = isEdit
      ? `/api/children/${initialData.id}`
      : "/api/children";

    const res = await fetch(url, {
      method: isEdit ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        emoji,
        birthDate: birthDate || null,
      }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ? JSON.stringify(data.error) : "Có lỗi xảy ra");
      setLoading(false);
      return;
    }

    router.push("/children");
    router.refresh();
  }

  return (
    <Card className="max-w-lg">
      <CardHeader>
        <CardTitle>{isEdit ? "Sửa thông tin" : "Thêm trẻ em"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Tên</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nhập tên..."
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Biểu tượng</Label>
            <div className="flex flex-wrap gap-2">
              {EMOJI_OPTIONS.map((e) => (
                <button
                  key={e}
                  type="button"
                  onClick={() => setEmoji(e)}
                  className={`text-2xl p-2 rounded-md border-2 transition-colors ${
                    emoji === e
                      ? "border-primary bg-primary/10"
                      : "border-transparent hover:border-muted"
                  }`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="birthDate">Ngày sinh (tùy chọn)</Label>
            <Input
              id="birthDate"
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
            />
          </div>

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}

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
