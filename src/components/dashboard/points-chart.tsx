"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface DailyPoint {
  date: string;
  childId: string;
  points: number;
}

interface ChildInfo {
  id: string;
  name: string;
  emoji: string;
}

interface PointsChartProps {
  dailyPoints: DailyPoint[];
  children: ChildInfo[];
}

const COLORS = [
  { stroke: "#8B5CF6", fill: "#8B5CF620" },
  { stroke: "#EC4899", fill: "#EC489920" },
  { stroke: "#06B6D4", fill: "#06B6D420" },
  { stroke: "#F59E0B", fill: "#F59E0B20" },
  { stroke: "#10B981", fill: "#10B98120" },
  { stroke: "#6366F1", fill: "#6366F120" },
  { stroke: "#F43F5E", fill: "#F43F5E20" },
];

export function PointsChart({ dailyPoints, children }: PointsChartProps) {
  if (dailyPoints.length === 0) {
    return (
      <p className="text-muted-foreground text-center py-8">
        Chưa có dữ liệu để hiển thị biểu đồ
      </p>
    );
  }

  // Build cumulative chart data with all dates filled in
  const dates = [...new Set(dailyPoints.map((d) => d.date))].sort();

  // Fill gaps between dates
  const allDates: string[] = [];
  if (dates.length > 0) {
    const start = new Date(dates[0]);
    const end = new Date(dates[dates.length - 1]);
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      allDates.push(d.toISOString().split("T")[0]);
    }
  }

  const cumulativeByChild: Record<string, number> = {};
  const chartData = allDates.map((date) => {
    const entry: Record<string, string | number> = { date };
    const dayPoints = dailyPoints.filter((d) => d.date === date);

    for (const dp of dayPoints) {
      cumulativeByChild[dp.childId] =
        (cumulativeByChild[dp.childId] ?? 0) + dp.points;
    }

    for (const child of children) {
      entry[child.name] = cumulativeByChild[child.id] ?? 0;
    }

    return entry;
  });

  return (
    <ResponsiveContainer width="100%" height={320}>
      <AreaChart data={chartData}>
        <defs>
          {children.map((_, i) => {
            const color = COLORS[i % COLORS.length];
            return (
              <linearGradient key={i} id={`gradient-${i}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color.stroke} stopOpacity={0.3} />
                <stop offset="100%" stopColor={color.stroke} stopOpacity={0.02} />
              </linearGradient>
            );
          })}
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" strokeOpacity={0.5} />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 13, fill: "#9CA3AF" }}
          tickLine={false}
          axisLine={{ stroke: "#E5E7EB" }}
          tickFormatter={(v: string) => {
            const d = new Date(v);
            return `${d.getDate()}/${d.getMonth() + 1}`;
          }}
        />
        <YAxis
          tick={{ fontSize: 13, fill: "#9CA3AF" }}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip
          contentStyle={{
            borderRadius: "12px",
            border: "1px solid #E5E7EB",
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
            fontSize: "14px",
          }}
          labelFormatter={(v) => {
            const d = new Date(String(v));
            return d.toLocaleDateString("vi-VN", {
              weekday: "short",
              day: "numeric",
              month: "numeric",
            });
          }}
          formatter={(value) => [`${Number(value) > 0 ? "+" : ""}${value} điểm`]}
        />
        <Legend
          iconType="circle"
          wrapperStyle={{ fontSize: "14px", paddingTop: "12px" }}
        />
        {children.map((child, i) => {
          const color = COLORS[i % COLORS.length];
          return (
            <Area
              key={child.id}
              type="monotone"
              dataKey={child.name}
              stroke={color.stroke}
              fill={`url(#gradient-${i})`}
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 5, strokeWidth: 2, fill: "white" }}
            />
          );
        })}
      </AreaChart>
    </ResponsiveContainer>
  );
}
