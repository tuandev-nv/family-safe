"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChildFormDialog } from "@/components/children/child-form-dialog";
import { ActivityFormDialog } from "@/components/activities/activity-form-dialog";
import { PopConfirm } from "@/components/ui/pop-confirm";

interface Child {
  id: string;
  name: string;
  emoji: string;
  birthDate: string | null;
  totalPoints: number;
}

function getAge(birthDate: string): number {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

export default function ChildrenPage() {
  const [children, setChildren] = useState<Child[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editingChild, setEditingChild] = useState<Child | undefined>();
  const [activityDialogOpen, setActivityDialogOpen] = useState(false);
  const [activityChildId, setActivityChildId] = useState<string>();

  const fetchChildren = useCallback(() => {
    fetch("/api/children")
      .then((r) => {
        if (!r.ok) throw new Error("Failed");
        return r.json();
      })
      .then(setChildren)
      .catch(() => setError("Không thể tải dữ liệu"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetchChildren(); }, [fetchChildren]);

  async function handleDelete(id: string) {
    const res = await fetch(`/api/children/${id}`, { method: "DELETE" });
    if (res.ok) fetchChildren();
  }

  function openCreate() {
    setEditingChild(undefined);
    setFormOpen(true);
  }

  function openEdit(child: Child) {
    setEditingChild(child);
    setFormOpen(true);
  }

  return (
    <div>
      <Header
        title="Trẻ em"
        description="Quản lý danh sách con"
        action={<Button onClick={openCreate}>+ Thêm trẻ em</Button>}
      />

      {loading ? (
        <p className="text-muted-foreground">Đang tải...</p>
      ) : error ? (
        <p className="text-destructive">{error}</p>
      ) : children.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-4xl mb-4">👶</p>
          <p className="text-muted-foreground mb-4">
            Chưa có trẻ em nào. Hãy thêm trẻ em đầu tiên!
          </p>
          <Button onClick={openCreate}>+ Thêm trẻ em</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {children.map((child) => (
            <Card key={child.id} className="rounded-2xl border-border shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <Link href={`/children/${child.id}`} className="flex items-center gap-3 flex-1">
                    <span className="text-4xl">{child.emoji}</span>
                    <div>
                      <h3 className="font-semibold text-lg">{child.name}</h3>
                      {child.birthDate && (
                        <p className="text-sm text-muted-foreground">
                          {getAge(child.birthDate)} tuổi
                        </p>
                      )}
                    </div>
                  </Link>
                  <div className="text-right">
                    <p className={`text-2xl font-bold ${child.totalPoints >= 0 ? "text-success" : "text-destructive"}`}>
                      {child.totalPoints > 0 ? "+" : ""}{child.totalPoints}
                    </p>
                    <p className="text-xs text-muted-foreground">điểm</p>
                  </div>
                </div>

                <div className="flex gap-2 mt-4">
                  <Button size="sm" onClick={() => { setActivityChildId(child.id); setActivityDialogOpen(true); }}>
                    + Ghi nhận
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => openEdit(child)}>
                    Sửa
                  </Button>
                  <PopConfirm
                    title="Xác nhận xóa?"
                    description={`Xóa ${child.emoji} ${child.name} sẽ xóa toàn bộ lịch sử.`}
                    onConfirm={() => handleDelete(child.id)}
                    triggerLabel="Xóa"
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <ChildFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        initialData={editingChild}
        onSuccess={fetchChildren}
      />

      <ActivityFormDialog
        open={activityDialogOpen}
        onOpenChange={setActivityDialogOpen}
        preselectedChildId={activityChildId}
        onSuccess={fetchChildren}
      />
    </div>
  );
}
