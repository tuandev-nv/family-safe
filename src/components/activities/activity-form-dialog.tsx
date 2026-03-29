"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Child {
  id: string;
  name: string;
  emoji: string;
}

interface Category {
  id: string;
  name: string;
  type: string;
  icon: string;
  levels: Array<{ id: string; label: string; points: number }>;
}

interface ActivityFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  preselectedChildId?: string;
  onSuccess: () => void;
}

export function ActivityFormDialog({
  open,
  onOpenChange,
  preselectedChildId,
  onSuccess,
}: ActivityFormDialogProps) {
  const [children, setChildren] = useState<Child[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedChild, setSelectedChild] = useState(preselectedChildId ?? "");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");
  const [isCustomLevel, setIsCustomLevel] = useState(false);
  const [customLabel, setCustomLabel] = useState("");
  const [customPoints, setCustomPoints] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [typeTab, setTypeTab] = useState<"REWARD" | "PENALTY">("REWARD");

  useEffect(() => {
    if (!open) return;
    setSelectedChild(preselectedChildId ?? "");
    setSelectedCategory("");
    setSelectedLevel("");
    setIsCustomLevel(false);
    setCustomLabel("");
    setCustomPoints("");
    setNote("");
    setTypeTab("REWARD");

    Promise.all([
      fetch("/api/children").then((r) => r.json()),
      fetch("/api/categories").then((r) => r.json()),
    ]).then(([c, cat]) => {
      setChildren(c);
      setCategories(cat);
    });
  }, [open, preselectedChildId]);

  const filteredCategories = categories.filter((c) => c.type === typeTab);
  const selectedCat = categories.find((c) => c.id === selectedCategory);

  const [formError, setFormError] = useState("");

  async function handleSubmit() {
    if (!selectedChild) { setFormError("Vui lòng chọn bé"); return; }
    if (!selectedCategory) { setFormError("Vui lòng chọn danh mục"); return; }
    if (isCustomLevel) {
      if (!customLabel.trim()) { setFormError("Vui lòng nhập tiêu đề"); return; }
      if (!customPoints || isNaN(Number(customPoints))) { setFormError("Vui lòng nhập số điểm"); return; }
    } else {
      if (!selectedLevel) { setFormError("Vui lòng chọn cấp độ"); return; }
    }
    setFormError("");

    const body = isCustomLevel
      ? {
          childId: selectedChild,
          categoryId: selectedCategory,
          customLabel: customLabel.trim(),
          customPoints: typeTab === "PENALTY" ? -Math.abs(Number(customPoints)) : Math.abs(Number(customPoints)),
          note: note || undefined,
        }
      : {
          childId: selectedChild,
          categoryId: selectedCategory,
          categoryLevelId: selectedLevel,
          note: note || undefined,
        };

    setLoading(true);
    const res = await fetch("/api/activities", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    setLoading(false);
    if (res.ok) {
      onSuccess();
      onOpenChange(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-purple-100 flex items-center justify-center text-lg">🎯</span>
            Ghi nhận hoạt động
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-2">
          {/* Step 1: Child */}
          <div>
            <label className="text-sm font-bold text-gray-700 mb-2.5 block flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs flex items-center justify-center font-bold">1</span>
              Chọn trẻ
            </label>
            <div className="flex flex-wrap gap-2">
              {children.map((child) => (
                <button
                  key={child.id}
                  onClick={() => setSelectedChild(child.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 text-sm font-medium transition-all cursor-pointer ${
                    selectedChild === child.id
                      ? "border-purple-500 bg-purple-50 text-purple-700 shadow-md shadow-purple-500/10"
                      : "border-gray-200 bg-white text-gray-700 hover:border-purple-300 hover:bg-purple-50/50"
                  }`}
                >
                  <span className="text-xl">{child.emoji}</span>
                  <span>{child.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Category */}
          <div>
            <label className="text-sm font-bold text-gray-700 mb-2.5 block flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs flex items-center justify-center font-bold">2</span>
              Chọn danh mục
            </label>
            <div className="flex gap-2 mb-3">
              <button
                onClick={() => { setTypeTab("REWARD"); setSelectedCategory(""); setSelectedLevel(""); }}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                  typeTab === "REWARD"
                    ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md shadow-emerald-500/20"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                🎁 Thưởng
              </button>
              <button
                onClick={() => { setTypeTab("PENALTY"); setSelectedCategory(""); setSelectedLevel(""); }}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                  typeTab === "PENALTY"
                    ? "bg-gradient-to-r from-rose-500 to-orange-500 text-white shadow-md shadow-rose-500/20"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                ⚠️ Phạt
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {filteredCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => { setSelectedCategory(cat.id); setSelectedLevel(""); }}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 text-sm font-medium transition-all cursor-pointer ${
                    selectedCategory === cat.id
                      ? typeTab === "REWARD"
                        ? "border-emerald-500 bg-emerald-50 text-emerald-700 shadow-md shadow-emerald-500/10"
                        : "border-rose-500 bg-rose-50 text-rose-700 shadow-md shadow-rose-500/10"
                      : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <span className="text-lg">{cat.icon}</span>
                  <span>{cat.name}</span>
                </button>
              ))}
              {filteredCategories.length === 0 && (
                <p className="text-sm text-gray-400 py-2">Chưa có danh mục</p>
              )}
            </div>
          </div>

          {/* Step 3: Level */}
          {selectedCat && (
            <div>
              <label className="text-sm font-bold text-gray-700 mb-2.5 block flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs flex items-center justify-center font-bold">3</span>
                Chọn cấp độ
              </label>
              <div className="flex flex-wrap gap-2">
                {selectedCat.levels.map((level) => (
                  <button
                    key={level.id}
                    onClick={() => { setSelectedLevel(level.id); setIsCustomLevel(false); }}
                    className={`px-4 py-2.5 rounded-xl border-2 text-sm font-medium transition-all cursor-pointer ${
                      selectedLevel === level.id && !isCustomLevel
                        ? "border-purple-500 bg-purple-50 text-purple-700 shadow-md shadow-purple-500/10"
                        : "border-gray-200 bg-white text-gray-700 hover:border-purple-300"
                    }`}
                  >
                    <span className="font-semibold">{level.label}</span>
                    <span className={`ml-2 font-mono font-bold ${
                      level.points >= 0 ? "text-emerald-600" : "text-rose-600"
                    }`}>
                      {level.points > 0 ? "+" : ""}{level.points}
                    </span>
                  </button>
                ))}
                {/* Custom level button */}
                <button
                  onClick={() => { setIsCustomLevel(true); setSelectedLevel(""); }}
                  className={`px-4 py-2.5 rounded-xl border-2 text-sm font-medium transition-all cursor-pointer ${
                    isCustomLevel
                      ? "border-amber-500 bg-amber-50 text-amber-700 shadow-md shadow-amber-500/10"
                      : "border-dashed border-gray-300 bg-white text-gray-500 hover:border-amber-400 hover:text-amber-600"
                  }`}
                >
                  ✏️ Tự nhập
                </button>
              </div>

              {/* Custom level form */}
              {isCustomLevel && (
                <div className="mt-3 p-4 rounded-xl bg-amber-50/50 border border-amber-200 space-y-3">
                  <div>
                    <label className="text-xs font-bold text-gray-600 mb-1 block">Tiêu đề</label>
                    <input
                      type="text"
                      value={customLabel}
                      onChange={(e) => setCustomLabel(e.target.value)}
                      placeholder="VD: Giúp mẹ rửa bát"
                      maxLength={100}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-600 mb-1 block">
                      Số điểm {typeTab === "PENALTY" ? "(sẽ tự trừ)" : ""}
                    </label>
                    <input
                      type="number"
                      value={customPoints}
                      onChange={(e) => setCustomPoints(e.target.value)}
                      placeholder="VD: 5"
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 4: Note */}
          {(selectedLevel || isCustomLevel) && (
            <div>
              <label className="text-sm font-bold text-gray-700 mb-2.5 block flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-gray-200 text-gray-500 text-xs flex items-center justify-center font-bold">4</span>
                Ghi chú (tùy chọn)
              </label>
              <Textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Ghi chú thêm..."
                rows={2}
                className="bg-white border-gray-200 rounded-xl"
              />
            </div>
          )}

          {formError && <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-sm text-rose-600 font-medium">{formError}</div>}

          {/* Actions */}
          <div className="flex gap-3 justify-end pt-2 border-t border-gray-100">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="px-6 h-11 rounded-xl">
              Hủy
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!selectedChild || !selectedCategory || (!selectedLevel && !isCustomLevel) || loading}
              className="px-8 h-11 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg shadow-purple-500/25 text-base font-bold"
            >
              {loading ? "Đang lưu..." : "Ghi nhận"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
