"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { ChildAvatar } from "@/components/ui/child-avatar";
import { Button } from "@/components/ui/button";
import { ChildFormDialog } from "@/components/children/child-form-dialog";
import { ActivityFormDialog } from "@/components/activities/activity-form-dialog";
import { PopConfirm } from "@/components/ui/pop-confirm";

interface Child {
  id: string;
  name: string;
  emoji: string;
  avatarUrl?: string | null;
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
      .then((r) => { if (!r.ok) throw new Error("Failed"); return r.json(); })
      .then(setChildren)
      .catch(() => setError("Không thể tải dữ liệu"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetchChildren(); }, [fetchChildren]);

  async function handleDelete(id: string) {
    const res = await fetch(`/api/children/${id}`, { method: "DELETE" });
    if (res.ok) fetchChildren();
  }

  function openCreate() { setEditingChild(undefined); setFormOpen(true); }
  function openEdit(child: Child) { setEditingChild(child); setFormOpen(true); }

  const gradients = [
    "from-violet-500 via-purple-500 to-fuchsia-500",
    "from-pink-500 via-rose-500 to-red-400",
    "from-cyan-500 via-blue-500 to-indigo-500",
    "from-amber-500 via-orange-500 to-red-500",
    "from-emerald-500 via-teal-500 to-cyan-500",
  ];

  return (
    <div>
      <Header
        title="Trẻ em"
        description="Quản lý danh sách con"
        action={
          <Button onClick={openCreate} className="h-11 px-6 rounded-xl text-base font-bold bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg shadow-purple-500/25 border-0">
            + Thêm trẻ em
          </Button>
        }
      />

      {loading ? (
        <p className="text-muted-foreground py-8 text-center">Đang tải...</p>
      ) : error ? (
        <p className="text-destructive py-8 text-center">{error}</p>
      ) : children.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-7xl mb-4 animate-bounce" style={{ animationDuration: "2.5s" }}>👶</div>
          <p className="text-xl font-semibold text-gray-600 mb-2">Chưa có trẻ em nào</p>
          <p className="text-muted-foreground mb-6">Hãy thêm trẻ em đầu tiên!</p>
          <Button onClick={openCreate} className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg">
            + Thêm trẻ em
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {children.map((child, idx) => {
            const gi = idx % gradients.length;
            const stars = Math.min(Math.floor(Math.max(child.totalPoints, 0) / 20), 5);
            return (
              <div key={child.id} className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-shadow duration-300 group">
                {/* Header gradient */}
                <div className={`bg-gradient-to-r ${gradients[gi]} p-5 text-white relative overflow-hidden`}>
                  <div className="absolute -right-3 -top-3 text-7xl opacity-15">{child.emoji}</div>
                  <Link href={`/children/${child.id}`} className="flex items-center gap-3 relative z-10">
                    <div className="group-hover:scale-110 transition-transform duration-300 drop-shadow-lg">
                      <ChildAvatar emoji={child.emoji} avatarUrl={child.avatarUrl} size="xl" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{child.name}</h3>
                      {child.birthDate && (
                        <p className="text-white/70 text-sm">{getAge(child.birthDate)} tuổi</p>
                      )}
                      <div className="flex gap-0.5 mt-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span key={i} className={`text-xs ${i < stars ? "opacity-100" : "opacity-30"}`}>⭐</span>
                        ))}
                      </div>
                    </div>
                  </Link>
                </div>

                {/* Body */}
                <div className="p-5">
                  <div className="text-center mb-4">
                    <span className={`text-3xl font-extrabold ${child.totalPoints >= 0 ? "text-gray-800" : "text-rose-500"}`}>
                      {child.totalPoints > 0 ? "+" : ""}{child.totalPoints}
                    </span>
                    <span className="text-gray-400 ml-1">điểm</span>
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={() => { setActivityChildId(child.id); setActivityDialogOpen(true); }}
                      className="flex-1 h-10 rounded-xl text-sm font-semibold bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow shadow-emerald-500/20 border-0">
                      + Ghi nhận
                    </Button>
                    <Button variant="outline" onClick={() => openEdit(child)} className="h-10 px-5 rounded-xl text-sm font-semibold">Sửa</Button>
                    <PopConfirm
                      title="Xác nhận xóa?"
                      description={`Xóa ${child.emoji} ${child.name} sẽ xóa toàn bộ lịch sử.`}
                      onConfirm={() => handleDelete(child.id)}
                      triggerLabel="Xóa"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <ChildFormDialog open={formOpen} onOpenChange={setFormOpen} initialData={editingChild} onSuccess={fetchChildren} />
      <ActivityFormDialog open={activityDialogOpen} onOpenChange={setActivityDialogOpen} preselectedChildId={activityChildId} onSuccess={fetchChildren} />
    </div>
  );
}
