"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PointsChart } from "@/components/dashboard/points-chart";
import { ActivityFormDialog } from "@/components/activities/activity-form-dialog";
import { ChildFormDialog } from "@/components/children/child-form-dialog";
import { CategoryFormDialog } from "@/components/categories/category-form-dialog";

interface ChildSummary {
  id: string;
  name: string;
  emoji: string;
  totalPoints: number;
  rewardPoints: number;
  penaltyPoints: number;
}

interface RecentActivity {
  id: string;
  points: number;
  note: string | null;
  createdAt: string;
  child: { name: string; emoji: string };
  category: { name: string; type: string; icon: string };
  categoryLevel: { label: string };
}

interface DailyPoint {
  date: string;
  childId: string;
  points: number;
}

interface DashboardData {
  children: ChildSummary[];
  recentActivities: RecentActivity[];
  dailyPoints: DailyPoint[];
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activityOpen, setActivityOpen] = useState(false);
  const [childOpen, setChildOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);

  function fetchDashboard() {
    fetch("/api/dashboard")
      .then((r) => {
        if (!r.ok) throw new Error("Failed");
        return r.json();
      })
      .then(setData)
      .catch(() => setError("Không thể tải dữ liệu"))
      .finally(() => setLoading(false));
  }

  useEffect(() => { fetchDashboard(); }, []);

  if (loading) return <p className="text-muted-foreground">Đang tải...</p>;
  if (error) return <p className="text-destructive">{error}</p>;

  if (!data || data.children.length === 0) {
    return (
      <div>
        <Header title="Tổng quan" />
        <div className="text-center py-12">
          <p className="text-4xl mb-4">🏠</p>
          <p className="text-muted-foreground mb-4">
            Chào mừng! Hãy bắt đầu bằng cách thêm trẻ em và cấu hình danh mục.
          </p>
          <div className="flex gap-2 justify-center">
            <Button onClick={() => setChildOpen(true)}>+ Thêm trẻ em</Button>
            <Button variant="outline" onClick={() => setCategoryOpen(true)}>+ Thêm danh mục</Button>
          </div>
        </div>
        <ChildFormDialog open={childOpen} onOpenChange={setChildOpen} onSuccess={fetchDashboard} />
        <CategoryFormDialog open={categoryOpen} onOpenChange={setCategoryOpen} onSuccess={fetchDashboard} />
      </div>
    );
  }

  return (
    <div>
      <Header
        title="Tổng quan"
        action={<Button onClick={() => setActivityOpen(true)}>+ Ghi nhận</Button>}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {data.children.map((child) => (
          <Link key={child.id} href={`/children/${child.id}`} className="block">
            <Card className="rounded-2xl border-border shadow-sm hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-3xl">{child.emoji}</span>
                  <div>
                    <h3 className="font-semibold">{child.name}</h3>
                    <p className={`text-2xl font-bold ${child.totalPoints >= 0 ? "text-success" : "text-destructive"}`}>
                      {child.totalPoints > 0 ? "+" : ""}{child.totalPoints}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 text-xs">
                  <span className="text-success">+{child.rewardPoints} thưởng</span>
                  <span className="text-destructive">-{Math.abs(child.penaltyPoints)} phạt</span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <Card className="mb-6 rounded-2xl border-border shadow-sm">
        <CardHeader>
          <CardTitle>Xu hướng điểm (30 ngày)</CardTitle>
        </CardHeader>
        <CardContent>
          <PointsChart dailyPoints={data.dailyPoints} children={data.children} />
        </CardContent>
      </Card>

      <Card className="rounded-2xl border-border shadow-sm">
        <CardHeader>
          <CardTitle>Hoạt động gần đây</CardTitle>
        </CardHeader>
        <CardContent>
          {data.recentActivities.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">Chưa có hoạt động nào</p>
          ) : (
            <div className="space-y-3">
              {data.recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{activity.child.emoji}</span>
                    <div>
                      <p className="text-sm">
                        <span className="font-medium">{activity.child.name}</span>
                        {" - "}{activity.category.icon} {activity.category.name}
                      </p>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">{activity.categoryLevel.label}</Badge>
                        <span className="text-xs text-muted-foreground">
                          {new Date(activity.createdAt).toLocaleString("vi-VN")}
                        </span>
                      </div>
                    </div>
                  </div>
                  <span className={`font-bold ${activity.points >= 0 ? "text-success" : "text-destructive"}`}>
                    {activity.points > 0 ? "+" : ""}{activity.points}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <ActivityFormDialog open={activityOpen} onOpenChange={setActivityOpen} onSuccess={fetchDashboard} />
    </div>
  );
}
