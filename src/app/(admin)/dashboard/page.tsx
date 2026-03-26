"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PointsChart } from "@/components/dashboard/points-chart";
import { ActivityFormDialog } from "@/components/activities/activity-form-dialog";
import { ChildFormDialog } from "@/components/children/child-form-dialog";
import { CategoryFormDialog } from "@/components/categories/category-form-dialog";
import { MonthSelector } from "@/components/ui/month-selector";
import { getCurrentMonth, formatMonthLabel } from "@/lib/date-utils";
import { ChildAvatar } from "@/components/ui/child-avatar";

interface ChildSummary {
  id: string;
  name: string;
  emoji: string;
  avatarUrl?: string | null;
  monthlyPoints: number;
  rewardPoints: number;
  penaltyPoints: number;
  allTimePoints: number;
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

interface DailyPoint { date: string; childId: string; points: number; }

interface DashboardData {
  year: number;
  month: number;
  children: ChildSummary[];
  recentActivities: RecentActivity[];
  dailyPoints: DailyPoint[];
}

function StatBubble({ icon, color }: { icon: string; color: string }) {
  return <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl ${color}`}>{icon}</div>;
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth);
  const [activityOpen, setActivityOpen] = useState(false);
  const [childOpen, setChildOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);

  const fetchDashboard = useCallback(() => {
    setLoading(true);
    fetch(`/api/dashboard?year=${selectedMonth.year}&month=${selectedMonth.month}`)
      .then((r) => { if (!r.ok) throw new Error("Failed"); return r.json(); })
      .then(setData)
      .catch(() => setError("Không thể tải dữ liệu"))
      .finally(() => setLoading(false));
  }, [selectedMonth]);

  useEffect(() => { fetchDashboard(); }, [fetchDashboard]);

  if (loading) return <p className="text-muted-foreground py-12 text-center">Đang tải...</p>;
  if (error) return <p className="text-destructive py-12 text-center">{error}</p>;

  if (!data || data.children.length === 0) {
    return (
      <div>
        <Header title="Tổng quan" />
        <div className="text-center py-16">
          <div className="text-7xl mb-4 animate-bounce" style={{ animationDuration: "2.5s" }}>🏠</div>
          <p className="text-2xl font-bold text-gray-700 mb-2">Chào mừng đến Gia đình Bơ Gấu!</p>
          <p className="text-muted-foreground mb-8 text-lg">Hãy bắt đầu hành trình nào!</p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" onClick={() => setChildOpen(true)} className="h-11 px-6 rounded-xl text-base font-bold bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg shadow-purple-500/25">
              👶 Thêm trẻ em
            </Button>
            <Button size="lg" variant="outline" onClick={() => setCategoryOpen(true)} className="text-base px-6">📋 Thêm danh mục</Button>
          </div>
        </div>
        <ChildFormDialog open={childOpen} onOpenChange={setChildOpen} onSuccess={fetchDashboard} />
        <CategoryFormDialog open={categoryOpen} onOpenChange={setCategoryOpen} onSuccess={fetchDashboard} />
      </div>
    );
  }

  const totalMonthly = data.children.reduce((s, c) => s + c.monthlyPoints, 0);
  const totalRewards = data.children.reduce((s, c) => s + c.rewardPoints, 0);
  const totalPenalties = data.children.reduce((s, c) => s + Math.abs(c.penaltyPoints), 0);
  const totalAllTime = data.children.reduce((s, c) => s + c.allTimePoints, 0);

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
        title="Tổng quan"
        action={
          <Button onClick={() => setActivityOpen(true)} className="h-11 px-6 rounded-xl text-base font-bold bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg shadow-purple-500/25">
            + Ghi nhận
          </Button>
        }
      />

      {/* Month selector */}
      <MonthSelector
        year={selectedMonth.year}
        month={selectedMonth.month}
        onChange={(y, m) => setSelectedMonth({ year: y, month: m })}
      />

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-2xl p-5 border border-purple-100/60 shadow-sm">
          <StatBubble icon="⭐" color="bg-purple-100" />
          <p className="text-3xl font-extrabold text-gray-800 mt-3">{totalMonthly}</p>
          <p className="text-sm text-gray-400 mt-0.5">Điểm tháng này</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-pink-100/60 shadow-sm">
          <StatBubble icon="👶" color="bg-pink-100" />
          <p className="text-3xl font-extrabold text-gray-800 mt-3">{data.children.length}</p>
          <p className="text-sm text-gray-400 mt-0.5">Trẻ em</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-emerald-100/60 shadow-sm">
          <StatBubble icon="🎁" color="bg-emerald-100" />
          <p className="text-3xl font-extrabold text-emerald-600 mt-3">+{totalRewards}</p>
          <p className="text-sm text-gray-400 mt-0.5">Điểm thưởng</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-orange-100/60 shadow-sm">
          <StatBubble icon="⚠️" color="bg-orange-100" />
          <p className="text-3xl font-extrabold text-rose-500 mt-3">-{totalPenalties}</p>
          <p className="text-sm text-gray-400 mt-0.5">Điểm phạt</p>
        </div>
      </div>

      {/* CTA banners */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <button onClick={() => setActivityOpen(true)}
          className="relative overflow-hidden rounded-2xl p-6 text-left bg-gradient-to-r from-emerald-400 to-teal-500 text-white shadow-lg shadow-emerald-500/20 hover:shadow-xl transition-shadow cursor-pointer group">
          <div className="absolute -right-4 -bottom-4 text-8xl opacity-20 group-hover:opacity-30 transition-opacity">🎯</div>
          <h3 className="text-xl font-bold mb-1">Ghi nhận hoạt động</h3>
          <p className="text-emerald-100 text-sm">Thưởng hoặc phạt cho các bé ngay!</p>
          <span className="inline-block mt-3 px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold">+ Ghi nhận ngay</span>
        </button>
        <button onClick={() => setCategoryOpen(true)}
          className="relative overflow-hidden rounded-2xl p-6 text-left bg-gradient-to-r from-orange-400 to-rose-500 text-white shadow-lg shadow-orange-500/20 hover:shadow-xl transition-shadow cursor-pointer group">
          <div className="absolute -right-4 -bottom-4 text-8xl opacity-20 group-hover:opacity-30 transition-opacity">📚</div>
          <h3 className="text-xl font-bold mb-1">Quản lý danh mục</h3>
          <p className="text-orange-100 text-sm">Tạo thêm tiêu chí thưởng/phạt mới</p>
          <span className="inline-block mt-3 px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold">Tùy chỉnh</span>
        </button>
      </div>

      {/* Children cards */}
      <div className="mb-8">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span className="text-2xl">📅</span> Bảng điểm các bé - {formatMonthLabel(selectedMonth.year, selectedMonth.month)}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {data.children.map((child, idx) => {
            const gi = idx % gradients.length;
            const stars = Math.min(Math.floor(Math.max(child.monthlyPoints, 0) / 20), 5);
            return (
              <Link key={child.id} href={`/children/${child.id}`} className="block group">
                <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-shadow duration-300">
                  <div className={`bg-gradient-to-r ${gradients[gi]} p-5 text-white relative overflow-hidden`}>
                    <div className="absolute -right-3 -top-3 text-7xl opacity-15">{child.emoji}</div>
                    <div className="flex items-center gap-3 relative z-10">
                      <div className="group-hover:scale-110 transition-transform duration-300 drop-shadow-lg">
                        <ChildAvatar emoji={child.emoji} avatarUrl={child.avatarUrl} size="xl" className="ring-2 ring-white/30" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">{child.name}</h3>
                        <div className="flex gap-0.5 mt-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <span key={i} className={`text-xs ${i < stars ? "opacity-100" : "opacity-30"}`}>⭐</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="text-center mb-3">
                      <span className={`text-4xl font-extrabold ${child.monthlyPoints >= 0 ? "text-gray-800" : "text-rose-500"}`}>
                        {child.monthlyPoints > 0 ? "+" : ""}{child.monthlyPoints}
                      </span>
                      <span className="text-gray-400 ml-1.5 text-base">điểm</span>
                    </div>
                    <div className="flex justify-between text-sm bg-gray-50 rounded-xl p-3">
                      <span className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                        <span className="text-emerald-600 font-bold">+{child.rewardPoints}</span>
                        <span className="text-gray-400">thưởng</span>
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                        <span className="text-rose-500 font-bold">-{Math.abs(child.penaltyPoints)}</span>
                        <span className="text-gray-400">phạt</span>
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Chart */}
      <div className="mb-8 rounded-2xl bg-white shadow-sm overflow-hidden border border-gray-100">
        <div className="px-5 py-4 bg-gradient-to-r from-violet-500 to-purple-600 text-white">
          <h3 className="flex items-center gap-2 text-lg font-bold">
            <span>📈</span> Xu hướng điểm - {formatMonthLabel(selectedMonth.year, selectedMonth.month)}
          </h3>
        </div>
        <div className="p-5">
          <PointsChart dailyPoints={data.dailyPoints} children={data.children} />
        </div>
      </div>

      {/* Recent activities */}
      <div className="rounded-2xl bg-white shadow-sm overflow-hidden border border-gray-100">
        <div className="px-5 py-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white">
          <h3 className="flex items-center gap-2 text-lg font-bold">
            <span>📝</span> Hoạt động trong tháng
          </h3>
        </div>
        <div className="p-5">
          {data.recentActivities.length === 0 ? (
            <p className="text-muted-foreground text-center py-8 text-base">Chưa có hoạt động nào trong tháng này</p>
          ) : (
            <div className="space-y-2">
              {data.recentActivities.map((activity) => {
                const isReward = activity.points >= 0;
                return (
                  <div key={activity.id}
                    className={`flex items-center justify-between p-3.5 rounded-xl transition-colors ${
                      isReward ? "bg-emerald-50/70 hover:bg-emerald-50" : "bg-rose-50/70 hover:bg-rose-50"
                    }`}>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{activity.child.emoji}</span>
                      <div>
                        <p className="text-base">
                          <span className="font-bold">{activity.child.name}</span>
                          <span className="text-gray-300 mx-1.5">/</span>
                          <span>{activity.category.icon} {activity.category.name}</span>
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <Badge variant="outline" className="text-xs font-medium">{activity.categoryLevel.label}</Badge>
                          <span className="text-xs text-gray-400">{new Date(activity.createdAt).toLocaleString("vi-VN")}</span>
                        </div>
                      </div>
                    </div>
                    <div className={`px-3 py-1.5 rounded-full text-sm font-extrabold ${
                      isReward ? "bg-emerald-400 text-white" : "bg-rose-400 text-white"
                    }`}>
                      {activity.points > 0 ? "+" : ""}{activity.points}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <ActivityFormDialog open={activityOpen} onOpenChange={setActivityOpen} onSuccess={fetchDashboard} />
      <ChildFormDialog open={childOpen} onOpenChange={setChildOpen} onSuccess={fetchDashboard} />
      <CategoryFormDialog open={categoryOpen} onOpenChange={setCategoryOpen} onSuccess={fetchDashboard} />
    </div>
  );
}
