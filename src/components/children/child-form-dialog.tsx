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
  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState("👦");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isEdit = !!initialData?.id;

  // Sync form with initialData when dialog opens or data changes
  useEffect(() => {
    if (open) {
      setName(initialData?.name ?? "");
      setEmoji(initialData?.emoji ?? "👦");
      setAvatarUrl(initialData?.avatarUrl ?? "");
      setBirthDate(initialData?.birthDate?.split("T")[0] ?? "");
      setError("");
    }
  }, [open, initialData]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const url = isEdit ? `/api/children/${initialData!.id}` : "/api/children";

    const res = await fetch(url, {
      method: isEdit ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, emoji, avatarUrl: avatarUrl || null, birthDate: birthDate || null }),
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-purple-100 flex items-center justify-center text-lg">
              {isEdit ? "✏️" : "👶"}
            </span>
            {isEdit ? "Sửa thông tin trẻ" : "Thêm trẻ em"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 mt-2">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">Tên</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nhập tên..."
              required
              className="h-11 rounded-xl bg-white border-gray-200 text-base"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Biểu tượng</label>
            <div className="flex flex-wrap gap-1.5">
              {EMOJI_OPTIONS.map((e) => (
                <button
                  key={e}
                  type="button"
                  onClick={() => setEmoji(e)}
                  className={`text-2xl w-11 h-11 rounded-xl border-2 transition-all cursor-pointer ${
                    emoji === e
                      ? "border-purple-500 bg-purple-50 shadow-md shadow-purple-500/10 scale-110"
                      : "border-gray-100 bg-white hover:border-purple-300 hover:bg-purple-50/50"
                  }`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">
              Ảnh đại diện (tùy chọn)
            </label>
            <div className="flex gap-3 items-start">
              <Input
                type="url"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="Dán link ảnh vào đây..."
                className="h-11 rounded-xl bg-white border-gray-200 flex-1"
              />
              {avatarUrl && (
                <div className="w-14 h-14 rounded-xl overflow-hidden border-2 border-purple-200 bg-gray-50 shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={avatarUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                  />
                </div>
              )}
            </div>
            <p className="text-xs text-gray-400 mt-1">Nếu có ảnh, ảnh sẽ thay thế biểu tượng emoji</p>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">Ngày sinh (tùy chọn)</label>
            <Input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="h-11 rounded-xl bg-white border-gray-200"
            />
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
