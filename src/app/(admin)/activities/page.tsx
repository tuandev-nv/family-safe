"use client";

import { useCallback, useEffect, useState } from "react";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PopConfirm } from "@/components/ui/pop-confirm";
import { ActivityFormDialog } from "@/components/activities/activity-form-dialog";
import { ChildAvatar } from "@/components/ui/child-avatar";
import { MonthSelector } from "@/components/ui/month-selector";
import { getCurrentMonth } from "@/lib/date-utils";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";

interface Activity {
  id: string;
  points: number;
  note: string | null;
  createdAt: string;
  child: { id: string; name: string; emoji: string; avatarUrl?: string | null };
  category: { name: string; type: string; icon: string };
  categoryLevel: { label: string } | null;
  levelLabel: string | null;
}

interface Child {
  id: string;
  name: string;
  emoji: string;
}

const PAGE_SIZE = 10;

export default function ActivitiesPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [children, setChildren] = useState<Child[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [childFilter, setChildFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth);

  const fetchActivities = useCallback(() => {
    const params = new URLSearchParams();
    params.set("page", page.toString());
    params.set("limit", PAGE_SIZE.toString());
    params.set("year", selectedMonth.year.toString());
    params.set("month", selectedMonth.month.toString());
    if (childFilter) params.set("childId", childFilter);
    if (typeFilter) params.set("type", typeFilter);

    setLoading(true);
    fetch(`/api/activities?${params}`)
      .then((r) => { if (!r.ok) throw new Error("Failed"); return r.json(); })
      .then((data) => { setActivities(data.activities); setTotal(data.total); })
      .catch(() => setActivities([]))
      .finally(() => setLoading(false));
  }, [page, childFilter, typeFilter, selectedMonth]);

  useEffect(() => {
    fetch("/api/children").then((r) => r.json()).then(setChildren).catch(() => setChildren([]));
  }, []);

  useEffect(() => { fetchActivities(); }, [fetchActivities]);

  async function handleDelete(id: string) {
    const res = await fetch(`/api/activities/${id}`, { method: "DELETE" });
    if (res.ok) fetchActivities();
  }

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div>
      <Header
        title="Hoạt động"
        description={`Tổng: ${total} hoạt động`}
        action={
          <Button onClick={() => setFormOpen(true)} className="h-11 px-6 rounded-xl text-base font-bold bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg shadow-purple-500/25">
            + Ghi nhận
          </Button>
        }
      />

      <MonthSelector
        year={selectedMonth.year}
        month={selectedMonth.month}
        onChange={(y, m) => { setSelectedMonth({ year: y, month: m }); setPage(1); }}
      />

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div>
          <label className="block text-sm font-semibold text-gray-600 mb-1.5">Trẻ em</label>
          <div className="relative">
            <select
              value={childFilter}
              onChange={(e) => { setChildFilter(e.target.value); setPage(1); }}
              className="appearance-none w-52 h-11 pl-4 pr-10 rounded-xl bg-white border border-gray-200 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent cursor-pointer"
            >
              <option value="">Tất cả</option>
              {children.map((c) => (
                <option key={c.id} value={c.id}>{c.emoji} {c.name}</option>
              ))}
            </select>
            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-600 mb-1.5">Loại</label>
          <div className="relative">
            <select
              value={typeFilter}
              onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}
              className="appearance-none w-52 h-11 pl-4 pr-10 rounded-xl bg-white border border-gray-200 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent cursor-pointer"
            >
              <option value="">Tất cả</option>
              <option value="REWARD">🎁 Thưởng</option>
              <option value="PENALTY">⚠️ Phạt</option>
            </select>
            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {(childFilter || typeFilter) && (
          <div className="flex items-end">
            <button
              onClick={() => { setChildFilter(""); setTypeFilter(""); setPage(1); }}
              className="h-11 px-4 rounded-xl bg-gray-100 hover:bg-gray-200 text-sm font-medium text-gray-500 transition-colors cursor-pointer"
            >
              Xóa bộ lọc
            </button>
          </div>
        )}
      </div>

      {loading ? (
        <p className="text-muted-foreground py-8 text-center">Đang tải...</p>
      ) : activities.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-7xl mb-4 animate-bounce" style={{ animationDuration: "2.5s" }}>📝</div>
          <p className="text-xl font-semibold text-gray-600 mb-2">Chưa có hoạt động nào</p>
          <p className="text-muted-foreground mb-6">Ghi nhận hoạt động đầu tiên!</p>
          <Button onClick={() => setFormOpen(true)} className="h-11 px-6 rounded-xl text-base font-bold bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg">
            + Ghi nhận hoạt động
          </Button>
        </div>
      ) : (
        <>
          {/* Activity list - styled like dashboard recent activities */}
          <div className="rounded-2xl bg-white shadow-sm overflow-hidden border border-gray-100">
            <div className="px-5 py-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-lg font-bold">
                <span>📝</span> Danh sách hoạt động
              </h3>
              <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-bold">
                {total} hoạt động
              </span>
            </div>
            <div className="p-4">
              <div className="space-y-2">
                {activities.map((activity) => {
                  const isReward = activity.points >= 0;
                  return (
                    <div
                      key={activity.id}
                      className={`flex items-center justify-between p-3.5 rounded-xl transition-colors ${
                        isReward ? "bg-emerald-50/70 hover:bg-emerald-50" : "bg-rose-50/70 hover:bg-rose-50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <ChildAvatar emoji={activity.child.emoji} avatarUrl={activity.child.avatarUrl} size="md" />
                        <div>
                          <p className="text-base">
                            <span className="font-bold text-gray-800">{activity.child.name}</span>
                            <span className="text-gray-300 mx-1.5">/</span>
                            <span>{activity.category.icon} {activity.category.name}</span>
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <Badge variant="outline" className="text-xs font-medium">
                              {activity.categoryLevel?.label ?? activity.levelLabel}
                            </Badge>
                            {activity.note && (
                              <span className="text-xs text-gray-400 italic">{activity.note}</span>
                            )}
                            <span className="text-xs text-gray-400">
                              {new Date(activity.createdAt).toLocaleString("vi-VN")}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1.5 rounded-full text-sm font-extrabold ${
                          isReward ? "bg-emerald-400 text-white" : "bg-rose-400 text-white"
                        }`}>
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
                  );
                })}
              </div>
            </div>

            {/* Pagination inside card */}
            {totalPages > 1 && (
              <div className="px-5 py-4 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  Trang {page} / {totalPages} ({total} hoạt động)
                </span>
                <div className="flex items-center gap-2">
                  <button
                    disabled={page <= 1}
                    onClick={() => setPage((p) => p - 1)}
                    className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  >
                    <ChevronLeft size={18} />
                  </button>

                  {/* Page numbers */}
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setPage(i + 1)}
                      className={`w-10 h-10 rounded-xl text-sm font-bold flex items-center justify-center transition-all cursor-pointer ${
                        page === i + 1
                          ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md shadow-purple-500/20 border-0"
                          : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}

                  <button
                    disabled={page >= totalPages}
                    onClick={() => setPage((p) => p + 1)}
                    className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      <ActivityFormDialog open={formOpen} onOpenChange={setFormOpen} onSuccess={fetchActivities} />
    </div>
  );
}
