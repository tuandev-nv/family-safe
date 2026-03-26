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

const EMOJI_OPTIONS = [
  "👦", "👧", "👶", "🧒", "👱‍♂️", "👱‍♀️",
  "🐱", "🐶", "🦊", "🐼", "🐰", "🦁",
  "⭐", "🌟", "💫", "🌈", "🎯", "🎨",
];

interface ChildData {
  id?: string;
  name: string;
  emoji: string;
  birthDate: string | null;
}

interface ChildFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: ChildData;
  onSuccess: () => void;
}

export function ChildFormDialog({
  open,
  onOpenChange,
  initialData,
  onSuccess,
}: ChildFormDialogProps) {
  const [name, setName] = useState(initialData?.name ?? "");
  const [emoji, setEmoji] = useState(initialData?.emoji ?? "👦");
  const [birthDate, setBirthDate] = useState(
    initialData?.birthDate?.split("T")[0] ?? ""
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isEdit = !!initialData?.id;

  // Reset form when dialog opens with new data
  function resetForm() {
    setName(initialData?.name ?? "");
    setEmoji(initialData?.emoji ?? "👦");
    setBirthDate(initialData?.birthDate?.split("T")[0] ?? "");
    setError("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const url = isEdit
      ? `/api/children/${initialData!.id}`
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
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Sửa thông tin trẻ" : "Thêm trẻ em"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="child-name">Tên</Label>
            <Input
              id="child-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nhập tên..."
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Biểu tượng</Label>
            <div className="flex flex-wrap gap-1.5">
              {EMOJI_OPTIONS.map((e) => (
                <button
                  key={e}
                  type="button"
                  onClick={() => setEmoji(e)}
                  className={`text-xl p-1.5 rounded-lg border-2 transition-colors ${
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
            <Label htmlFor="child-birthDate">Ngày sinh (tùy chọn)</Label>
            <Input
              id="child-birthDate"
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
            />
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
