"use client";

import { useCallback, useEffect, useState } from "react";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
      .then((r) => {
        if (!r.ok) throw new Error("Failed");
        return r.json();
      })
      .then(setCategories)
      .catch(() => setError("Không thể tải dữ liệu"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetchCategories(); }, [fetchCategories]);

  function openCreate() {
    setEditingCategory(undefined);
    setFormOpen(true);
  }

  function openEdit(cat: Category) {
    setEditingCategory(cat);
    setFormOpen(true);
  }

  async function handleDelete(id: string) {
    const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const data = await res.json();
      setDeleteError(data.error);
      return;
    }
    setDeleteError("");
    fetchCategories();
  }

  const rewards = categories.filter((c) => c.type === "REWARD");
  const penalties = categories.filter((c) => c.type === "PENALTY");

  function renderCategoryCard(category: Category) {
    const isReward = category.type === "REWARD";
    return (
      <Card key={category.id} className="rounded-2xl border-border shadow-sm">
        <CardContent className="pt-6">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{category.icon}</span>
              <div>
                <h3 className="font-semibold">{category.name}</h3>
                <Badge variant={isReward ? "default" : "destructive"} className="text-xs">
                  {isReward ? "Thưởng" : "Phạt"}
                </Badge>
              </div>
            </div>
          </div>

          <div className="space-y-1 mb-3">
            {category.levels.map((level) => (
              <div key={level.id} className="flex items-center justify-between text-sm py-1 px-2 rounded bg-muted/50">
                <span>{level.label}</span>
                <span className={`font-mono font-medium ${level.points >= 0 ? "text-success" : "text-destructive"}`}>
                  {level.points > 0 ? "+" : ""}{level.points}
                </span>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => openEdit(category)}>
              Sửa
            </Button>
            <PopConfirm
              title="Xác nhận xóa?"
              description="Không thể xóa nếu đã có hoạt động sử dụng."
              onConfirm={() => handleDelete(category.id)}
              triggerLabel="Xóa"
            />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div>
      <Header
        title="Danh mục"
        description="Cấu hình các loại thưởng và phạt"
        action={<Button onClick={openCreate}>+ Thêm danh mục</Button>}
      />

      {deleteError && (
        <p className="text-sm text-destructive mb-4">{deleteError}</p>
      )}

      {loading ? (
        <p className="text-muted-foreground">Đang tải...</p>
      ) : error ? (
        <p className="text-destructive">{error}</p>
      ) : categories.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-4xl mb-4">📋</p>
          <p className="text-muted-foreground mb-4">
            Chưa có danh mục nào. Hãy tạo danh mục thưởng/phạt đầu tiên!
          </p>
          <Button onClick={openCreate}>+ Thêm danh mục</Button>
        </div>
      ) : (
        <div className="space-y-8">
          {rewards.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3 text-success">🎁 Phần thưởng</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rewards.map(renderCategoryCard)}
              </div>
            </div>
          )}
          {penalties.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3 text-destructive">⚠️ Hình phạt</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {penalties.map(renderCategoryCard)}
              </div>
            </div>
          )}
        </div>
      )}

      <CategoryFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        initialData={editingCategory}
        onSuccess={fetchCategories}
      />
    </div>
  );
}
