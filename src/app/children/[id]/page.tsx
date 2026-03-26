"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChildFormDialog } from "@/components/children/child-form-dialog";
import { ActivityFormDialog } from "@/components/activities/activity-form-dialog";

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

  const fetchChild = useCallback(() => {
    fetch(`/api/children/${id}`)
      .then((r) => {
        if (!r.ok) throw new Error("Failed");
        return r.json();
      })
      .then(setChild)
      .catch(() => setError("Không thể tải dữ liệu"))
      .finally(() => setLoading(false));
  }, [id]);

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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="rounded-2xl border-border shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Tổng điểm</CardTitle>
          </CardHeader>
          <CardContent>
            <p className={`text-3xl font-bold ${child.totalPoints >= 0 ? "text-success" : "text-destructive"}`}>
              {child.totalPoints > 0 ? "+" : ""}{child.totalPoints}
            </p>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border-border shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Thưởng</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-success">+{child.rewardPoints}</p>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border-border shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Phạt</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-destructive">-{Math.abs(child.penaltyPoints)}</p>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-2xl border-border shadow-sm">
        <CardHeader>
          <CardTitle>Lịch sử hoạt động</CardTitle>
        </CardHeader>
        <CardContent>
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
                        <Badge variant="outline" className="text-xs">{activity.categoryLevel.label}</Badge>
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
        </CardContent>
      </Card>

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
