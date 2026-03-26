"use client";

import { useCallback, useEffect, useState } from "react";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PopConfirm } from "@/components/ui/pop-confirm";
import { ActivityFormDialog } from "@/components/activities/activity-form-dialog";

interface Activity {
  id: string;
  points: number;
  note: string | null;
  createdAt: string;
  child: { id: string; name: string; emoji: string };
  category: { name: string; type: string; icon: string };
  categoryLevel: { label: string };
}

interface Child {
  id: string;
  name: string;
  emoji: string;
}

export default function ActivitiesPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [children, setChildren] = useState<Child[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [childFilter, setChildFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);

  const fetchActivities = useCallback(() => {
    const params = new URLSearchParams();
    params.set("page", page.toString());
    params.set("limit", "20");
    if (childFilter !== "all") params.set("childId", childFilter);
    if (typeFilter !== "all") params.set("type", typeFilter);

    fetch(`/api/activities?${params}`)
      .then((r) => {
        if (!r.ok) throw new Error("Failed");
        return r.json();
      })
      .then((data) => {
        setActivities(data.activities);
        setTotal(data.total);
      })
      .catch(() => setActivities([]))
      .finally(() => setLoading(false));
  }, [page, childFilter, typeFilter]);

  useEffect(() => {
    fetch("/api/children").then((r) => r.json()).then(setChildren).catch(() => setChildren([]));
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchActivities();
  }, [fetchActivities]);

  async function handleDelete(id: string) {
    const res = await fetch(`/api/activities/${id}`, { method: "DELETE" });
    if (res.ok) fetchActivities();
  }

  const totalPages = Math.ceil(total / 20);

  return (
    <div>
      <Header
        title="Hoạt động"
        description={`Tổng: ${total} hoạt động`}
        action={<Button onClick={() => setFormOpen(true)}>+ Ghi nhận</Button>}
      />

      <div className="flex gap-3 mb-6">
        <Select value={childFilter} onValueChange={(v) => { setChildFilter(v ?? "all"); setPage(1); }}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Tất cả trẻ" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả trẻ</SelectItem>
            {children.map((c) => (
              <SelectItem key={c.id} value={c.id}>{c.emoji} {c.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={typeFilter} onValueChange={(v) => { setTypeFilter(v ?? "all"); setPage(1); }}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Tất cả loại" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả loại</SelectItem>
            <SelectItem value="REWARD">🎁 Thưởng</SelectItem>
            <SelectItem value="PENALTY">⚠️ Phạt</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <p className="text-muted-foreground">Đang tải...</p>
      ) : activities.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-4xl mb-4">📝</p>
          <p className="text-muted-foreground mb-4">Chưa có hoạt động nào</p>
          <Button onClick={() => setFormOpen(true)}>+ Ghi nhận hoạt động</Button>
        </div>
      ) : (
        <>
          <div className="space-y-2">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center justify-between p-4 rounded-xl border bg-card shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{activity.child.emoji}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{activity.child.name}</span>
                      <span className="text-muted-foreground">-</span>
                      <span>{activity.category.icon} {activity.category.name}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Badge variant="outline" className="text-xs">
                        {activity.categoryLevel.label}
                      </Badge>
                      {activity.note && (
                        <span className="text-xs text-muted-foreground">{activity.note}</span>
                      )}
                      <span className="text-xs text-muted-foreground">
                        {new Date(activity.createdAt).toLocaleString("vi-VN")}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`text-lg font-bold ${activity.points >= 0 ? "text-success" : "text-destructive"}`}>
                    {activity.points > 0 ? "+" : ""}{activity.points}
                  </span>
                  <PopConfirm
                    title="Xóa hoạt động?"
                    description={`Điểm sẽ được hoàn lại cho ${activity.child.name}.`}
                    onConfirm={() => handleDelete(activity.id)}
                    triggerLabel="✕"
                    triggerVariant="ghost"
                  />
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                Trước
              </Button>
              <span className="py-1 px-3 text-sm">{page} / {totalPages}</span>
              <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>
                Sau
              </Button>
            </div>
          )}
        </>
      )}

      <ActivityFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        onSuccess={fetchActivities}
      />
    </div>
  );
}
