"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [typeTab, setTypeTab] = useState<"REWARD" | "PENALTY">("REWARD");

  useEffect(() => {
    if (!open) return;
    setSelectedChild(preselectedChildId ?? "");
    setSelectedCategory("");
    setSelectedLevel("");
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

  async function handleSubmit() {
    if (!selectedChild || !selectedCategory || !selectedLevel) return;

    setLoading(true);
    const res = await fetch("/api/activities", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        childId: selectedChild,
        categoryId: selectedCategory,
        categoryLevelId: selectedLevel,
        note: note || undefined,
      }),
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
          <DialogTitle>Ghi nhận hoạt động</DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          {/* Step 1: Child */}
          <div>
            <Label className="text-sm font-medium mb-2 block">1. Chọn trẻ</Label>
            <div className="flex flex-wrap gap-2">
              {children.map((child) => (
                <button
                  key={child.id}
                  onClick={() => setSelectedChild(child.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg border-2 text-sm transition-colors ${
                    selectedChild === child.id
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <span className="text-lg">{child.emoji}</span>
                  <span className="font-medium">{child.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Category */}
          <div>
            <Label className="text-sm font-medium mb-2 block">2. Chọn danh mục</Label>
            <div className="flex gap-2 mb-2">
              <Button
                variant={typeTab === "REWARD" ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setTypeTab("REWARD");
                  setSelectedCategory("");
                  setSelectedLevel("");
                }}
              >
                🎁 Thưởng
              </Button>
              <Button
                variant={typeTab === "PENALTY" ? "destructive" : "outline"}
                size="sm"
                onClick={() => {
                  setTypeTab("PENALTY");
                  setSelectedCategory("");
                  setSelectedLevel("");
                }}
              >
                ⚠️ Phạt
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {filteredCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    setSelectedLevel("");
                  }}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg border-2 text-sm transition-colors ${
                    selectedCategory === cat.id
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.name}</span>
                </button>
              ))}
              {filteredCategories.length === 0 && (
                <p className="text-sm text-muted-foreground">Chưa có danh mục</p>
              )}
            </div>
          </div>

          {/* Step 3: Level */}
          {selectedCat && (
            <div>
              <Label className="text-sm font-medium mb-2 block">3. Chọn cấp độ</Label>
              <div className="flex flex-wrap gap-2">
                {selectedCat.levels.map((level) => (
                  <button
                    key={level.id}
                    onClick={() => setSelectedLevel(level.id)}
                    className={`px-3 py-2 rounded-lg border-2 text-sm transition-colors ${
                      selectedLevel === level.id
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <span className="font-medium">{level.label}</span>
                    <span
                      className={`ml-2 font-mono ${
                        level.points >= 0 ? "text-success" : "text-destructive"
                      }`}
                    >
                      {level.points > 0 ? "+" : ""}
                      {level.points}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Note */}
          {selectedLevel && (
            <div>
              <Label htmlFor="activity-note" className="text-sm font-medium mb-2 block">
                4. Ghi chú (tùy chọn)
              </Label>
              <Textarea
                id="activity-note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Ghi chú thêm..."
                rows={2}
              />
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 justify-end pt-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Hủy
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!selectedChild || !selectedCategory || !selectedLevel || loading}
            >
              {loading ? "Đang lưu..." : "Ghi nhận"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
