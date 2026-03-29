"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChildFormDialog } from "@/components/children/child-form-dialog";
import { ActivityFormDialog } from "@/components/activities/activity-form-dialog";
import { MonthSelector } from "@/components/ui/month-selector";
import { getCurrentMonth, formatMonthLabel } from "@/lib/date-utils";

interface ChildDetail {
  id: string;
  name: string;
  emoji: string;
  birthDate: string | null;
  totalPoints: number;
  rewardPoints: number;
  penaltyPoints: number;
  activities: Array<{
    id: string;
    points: number;
    note: string | null;
    createdAt: string;
    category: { name: string; type: string; icon: string };
    categoryLevel: { label: string };
  }>;
}

export default function ChildDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [child, setChild] = useState<ChildDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [activityOpen, setActivityOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth);

  const fetchChild = useCallback(() => {
    setLoading(true);
    fetch(`/api/children/${id}?year=${selectedMonth.year}&month=${selectedMonth.month}`)
      .then((r) => { if (!r.ok) throw new Error("Failed"); return r.json(); })
      .then(setChild)
      .catch(() => setError("Không thể tải dữ liệu"))
      .finally(() => setLoading(false));
  }, [id, selectedMonth]);

  useEffect(() => { fetchChild(); }, [fetchChild]);

  if (loading) return <p className="text-muted-foreground">Đang tải...</p>;
  if (error) return <p className="text-destructive">{error}</p>;
  if (!child) return <p className="text-destructive">Không tìm thấy</p>;

  return (
    <div>
      <Header
        title={`${child.emoji} ${child.name}`}
        action={
          <div className="flex gap-2">
            <Button onClick={() => setActivityOpen(true)}>+ Ghi nhận</Button>
            <Button variant="outline" onClick={() => setEditOpen(true)}>Sửa</Button>
          </div>
        }
      />

      <MonthSelector
        year={selectedMonth.year}
        month={selectedMonth.month}
        onChange={(y, m) => setSelectedMonth({ year: y, month: m })}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <p className="text-sm text-gray-400 mb-1">Điểm tháng</p>
          <p className={`text-3xl font-extrabold ${child.totalPoints >= 0 ? "text-gray-800" : "text-rose-500"}`}>
            {child.totalPoints > 0 ? "+" : ""}{child.totalPoints}
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <p className="text-sm text-gray-400 mb-1">Thưởng</p>
          <p className="text-3xl font-extrabold text-emerald-600">+{child.rewardPoints}</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <p className="text-sm text-gray-400 mb-1">Phạt</p>
          <p className="text-3xl font-extrabold text-rose-500">-{Math.abs(child.penaltyPoints)}</p>
        </div>
      </div>

      <div className="rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 bg-gradient-to-r from-violet-500 to-purple-600 text-white">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <span>📋</span> Hoạt động - {formatMonthLabel(selectedMonth.year, selectedMonth.month)}
          </h3>
        </div>
        <div className="p-5">
          {child.activities.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">Chưa có hoạt động nào</p>
          ) : (
            <div className="space-y-3">
              {child.activities.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{activity.category.icon}</span>
                    <div>
                      <p className="font-medium">{activity.category.name}</p>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">{activity.categoryLevel?.label ?? activity.levelLabel}</Badge>
                        {activity.note && <span className="text-xs text-muted-foreground">{activity.note}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${activity.points >= 0 ? "text-success" : "text-destructive"}`}>
                      {activity.points > 0 ? "+" : ""}{activity.points}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(activity.createdAt).toLocaleDateString("vi-VN")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <ChildFormDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        initialData={child}
        onSuccess={fetchChild}
      />
      <ActivityFormDialog
        open={activityOpen}
        onOpenChange={setActivityOpen}
        preselectedChildId={child.id}
        onSuccess={fetchChild}
      />
    </div>
  );
}
