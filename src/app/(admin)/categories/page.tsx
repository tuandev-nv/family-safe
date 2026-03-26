"use client";

import { useCallback, useEffect, useState } from "react";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { CategoryFormDialog } from "@/components/categories/category-form-dialog";
import { PopConfirm } from "@/components/ui/pop-confirm";

interface Category {
  id: string;
  name: string;
  type: string;
  icon: string;
  levels: Array<{ id: string; label: string; points: number; sortOrder: number }>;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | undefined>();
  const [deleteError, setDeleteError] = useState("");

  const fetchCategories = useCallback(() => {
    fetch("/api/categories")
      .then((r) => { if (!r.ok) throw new Error("Failed"); return r.json(); })
      .then(setCategories)
      .catch(() => setError("Không thể tải dữ liệu"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetchCategories(); }, [fetchCategories]);

  function openCreate() { setEditingCategory(undefined); setFormOpen(true); }
  function openEdit(cat: Category) { setEditingCategory(cat); setFormOpen(true); }

  async function handleDelete(id: string) {
    const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
    if (!res.ok) { const data = await res.json(); setDeleteError(data.error); return; }
    setDeleteError("");
    fetchCategories();
  }

  const rewards = categories.filter((c) => c.type === "REWARD");
  const penalties = categories.filter((c) => c.type === "PENALTY");

  function renderCategoryCard(category: Category) {
    const isReward = category.type === "REWARD";
    return (
      <div key={category.id} className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-shadow duration-300">
        {/* Header */}
        <div className={`px-5 py-4 ${isReward ? "bg-gradient-to-r from-emerald-500 to-teal-500" : "bg-gradient-to-r from-rose-500 to-orange-500"} text-white relative overflow-hidden`}>
          <div className="absolute -right-2 -top-2 text-6xl opacity-15">{category.icon}</div>
          <div className="flex items-center gap-3 relative z-10">
            <span className="text-3xl">{category.icon}</span>
            <div>
              <h3 className="font-bold text-lg">{category.name}</h3>
              <span className="text-xs font-medium text-white/70">
                {isReward ? "Phần thưởng" : "Hình phạt"} / {category.levels.length} cấp độ
              </span>
            </div>
          </div>
        </div>

        {/* Levels */}
        <div className="p-5">
          <div className="space-y-1.5 mb-4">
            {category.levels.map((level) => (
              <div key={level.id} className={`flex items-center justify-between text-sm py-2 px-3 rounded-xl ${
                isReward ? "bg-emerald-50" : "bg-rose-50"
              }`}>
                <span className="font-medium text-gray-700">{level.label}</span>
                <span className={`font-mono font-bold px-2 py-0.5 rounded-full text-xs ${
                  level.points >= 0 ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-600"
                }`}>
                  {level.points > 0 ? "+" : ""}{level.points}
                </span>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={() => openEdit(category)} className="h-10 px-5 rounded-xl text-sm font-semibold">
              Sửa
            </Button>
            <PopConfirm
              title="Xác nhận xóa?"
              description="Không thể xóa nếu đã có hoạt động sử dụng."
              onConfirm={() => handleDelete(category.id)}
              triggerLabel="Xóa"
              triggerSize="default"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header
        title="Danh mục"
        description="Cấu hình các loại thưởng và phạt"
        action={
          <Button onClick={openCreate} className="h-11 px-6 rounded-xl text-base font-bold bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg shadow-purple-500/25">
            + Thêm danh mục
          </Button>
        }
      />

      {deleteError && (
        <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-sm text-rose-600 font-medium">{deleteError}</div>
      )}

      {loading ? (
        <p className="text-muted-foreground py-8 text-center">Đang tải...</p>
      ) : error ? (
        <p className="text-destructive py-8 text-center">{error}</p>
      ) : categories.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-7xl mb-4 animate-bounce" style={{ animationDuration: "2.5s" }}>📋</div>
          <p className="text-xl font-semibold text-gray-600 mb-2">Chưa có danh mục nào</p>
          <p className="text-muted-foreground mb-6">Hãy tạo danh mục thưởng/phạt đầu tiên!</p>
          <Button onClick={openCreate} className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg">
            + Thêm danh mục
          </Button>
        </div>
      ) : (
        <div className="space-y-8">
          {rewards.length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center text-lg">🎁</span>
                Phần thưởng
                <span className="text-sm font-normal text-gray-400">({rewards.length})</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rewards.map(renderCategoryCard)}
              </div>
            </div>
          )}
          {penalties.length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-rose-100 flex items-center justify-center text-lg">⚠️</span>
                Hình phạt
                <span className="text-sm font-normal text-gray-400">({penalties.length})</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {penalties.map(renderCategoryCard)}
              </div>
            </div>
          )}
        </div>
      )}

      <CategoryFormDialog open={formOpen} onOpenChange={setFormOpen} initialData={editingCategory} onSuccess={fetchCategories} />
    </div>
  );
}
