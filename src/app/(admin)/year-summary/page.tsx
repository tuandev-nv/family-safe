"use client";

import { useCallback, useEffect, useState } from "react";
import { Header } from "@/components/layout/header";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ChildAvatar } from "@/components/ui/child-avatar";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";

interface ChildInfo {
  id: string;
  name: string;
  emoji: string;
  avatarUrl?: string | null;
}

interface YearlyData {
  year: number;
  children: ChildInfo[];
  monthlyData: Record<string, Record<number, number>>;
}

const MONTH_NAMES = ["T1", "T2", "T3", "T4", "T5", "T6", "T7", "T8", "T9", "T10", "T11", "T12"];
const COLORS = ["#8B5CF6", "#EC4899", "#06B6D4", "#F59E0B", "#10B981", "#6366F1", "#F43F5E"];

export default function YearSummaryPage() {
  const [year, setYear] = useState(new Date().getFullYear());
  const [data, setData] = useState<YearlyData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(() => {
    setLoading(true);
    fetch(`/api/dashboard/yearly?year=${year}`)
      .then((r) => r.json())
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [year]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const currentMonth = new Date().getMonth() + 1;
  const isCurrentYear = year === new Date().getFullYear();

  // Build chart data
  const chartData = Array.from({ length: 12 }).map((_, i) => {
    const entry: Record<string, string | number> = { month: MONTH_NAMES[i] };
    if (data) {
      for (const child of data.children) {
        entry[child.name] = data.monthlyData[child.id]?.[i + 1] ?? 0;
      }
    }
    return entry;
  });

  return (
    <div>
      <Header title="Tổng kết năm" description="Theo dõi sự tiến bộ của con qua từng tháng" />

      {/* Year selector */}
      <div className="flex items-center gap-2 mb-8">
        <div className="flex items-center bg-white rounded-xl border border-gray-200 shadow-sm">
          <button onClick={() => setYear((y) => y - 1)}
            className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 rounded-l-xl transition-colors cursor-pointer">
            <ChevronLeft size={18} />
          </button>
          <span className="px-6 text-lg font-black text-gray-800">{year}</span>
          <button onClick={() => setYear((y) => y + 1)}
            disabled={year >= new Date().getFullYear()}
            className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 rounded-r-xl transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed">
            <ChevronRight size={18} />
          </button>
        </div>
        {year !== new Date().getFullYear() && (
          <button onClick={() => setYear(new Date().getFullYear())}
            className="h-10 px-4 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-bold shadow shadow-purple-500/20 cursor-pointer">
            Năm nay
          </button>
        )}
      </div>

      {loading ? (
        <p className="text-muted-foreground py-12 text-center">Đang tải...</p>
      ) : !data || data.children.length === 0 ? (
        <p className="text-muted-foreground py-12 text-center">Chưa có dữ liệu</p>
      ) : (
        <>
          {/* Chart */}
          <div className="rounded-2xl bg-white shadow-sm overflow-hidden border border-gray-100 mb-8">
            <div className="px-5 py-4 bg-gradient-to-r from-violet-500 to-purple-600 text-white">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <span>📈</span> Biểu đồ điểm năm {year}
              </h3>
            </div>
            <div className="p-5">
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={chartData}>
                  <defs>
                    {data.children.map((_, i) => (
                      <linearGradient key={i} id={`yearly-gradient-${i}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={COLORS[i % COLORS.length]} stopOpacity={0.3} />
                        <stop offset="100%" stopColor={COLORS[i % COLORS.length]} stopOpacity={0.02} />
                      </linearGradient>
                    ))}
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" strokeOpacity={0.5} />
                  <XAxis dataKey="month" tick={{ fontSize: 13, fill: "#9CA3AF" }} tickLine={false} axisLine={{ stroke: "#E5E7EB" }} />
                  <YAxis tick={{ fontSize: 13, fill: "#9CA3AF" }} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #E5E7EB", boxShadow: "0 4px 12px rgba(0,0,0,0.08)", fontSize: 14 }} />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: 14, paddingTop: 12 }} />
                  {data.children.map((child, i) => (
                    <Area key={child.id} type="monotone" dataKey={child.name}
                      stroke={COLORS[i % COLORS.length]} fill={`url(#yearly-gradient-${i})`}
                      strokeWidth={2.5} dot={false} activeDot={{ r: 5, strokeWidth: 2, fill: "white" }} />
                  ))}
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Monthly table */}
          <div className="rounded-2xl bg-white shadow-sm overflow-hidden border border-gray-100">
            <div className="px-5 py-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <span>📊</span> Bảng điểm theo tháng
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left p-4 font-bold text-gray-600 sticky left-0 bg-white min-w-[140px]">Tên</th>
                    {MONTH_NAMES.map((m, i) => (
                      <th key={i} className={`p-3 text-center font-bold min-w-[60px] ${
                        isCurrentYear && i + 1 === currentMonth
                          ? "bg-purple-50 text-purple-700"
                          : "text-gray-400"
                      }`}>
                        {m}
                      </th>
                    ))}
                    <th className="p-3 text-center font-bold text-gray-700 bg-gray-50 min-w-[80px]">Tổng năm</th>
                  </tr>
                </thead>
                <tbody>
                  {data.children.map((child, idx) => {
                    const months = data.monthlyData[child.id] ?? {};
                    const yearTotal = Object.values(months).reduce((s, v) => s + v, 0);
                    return (
                      <tr key={child.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                        <td className="p-4 sticky left-0 bg-white">
                          <div className="flex items-center gap-2">
                            <ChildAvatar emoji={child.emoji} avatarUrl={child.avatarUrl} size="sm" />
                            <span className="font-bold text-gray-800">{child.name}</span>
                          </div>
                        </td>
                        {MONTH_NAMES.map((_, i) => {
                          const pts = months[i + 1] ?? 0;
                          const isCurrent = isCurrentYear && i + 1 === currentMonth;
                          return (
                            <td key={i} className={`p-3 text-center ${isCurrent ? "bg-purple-50" : ""}`}>
                              {pts !== 0 ? (
                                <span className={`px-2 py-0.5 rounded-full text-xs font-extrabold ${
                                  pts > 0 ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-600"
                                }`}>
                                  {pts > 0 ? "+" : ""}{pts}
                                </span>
                              ) : (
                                <span className="text-gray-200">-</span>
                              )}
                            </td>
                          );
                        })}
                        <td className="p-3 text-center bg-gray-50">
                          <span className={`font-extrabold ${yearTotal >= 0 ? "text-gray-800" : "text-rose-500"}`}>
                            {yearTotal > 0 ? "+" : ""}{yearTotal}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
