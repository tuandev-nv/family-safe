"use client";

import {
  LineChart,
  Line,
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
  "#465FFF", "#EF4444", "#10B981", "#F59E0B", "#8B5CF6",
  "#06B6D4", "#EC4899", "#84CC16",
];

export function PointsChart({ dailyPoints, children }: PointsChartProps) {
  if (dailyPoints.length === 0) {
    return (
      <p className="text-muted-foreground text-center py-8">
        Chưa có dữ liệu để hiển thị biểu đồ
      </p>
    );
  }

  // Build chart data: { date, [childName]: cumulativePoints }
  const dates = [...new Set(dailyPoints.map((d) => d.date))].sort();

  const cumulativeByChild: Record<string, number> = {};
  const chartData = dates.map((date) => {
    const entry: Record<string, string | number> = { date };
    const dayPoints = dailyPoints.filter((d) => d.date === date);

    for (const dp of dayPoints) {
      cumulativeByChild[dp.childId] =
        (cumulativeByChild[dp.childId] ?? 0) + dp.points;
    }

    for (const child of children) {
      const childName = `${child.emoji} ${child.name}`;
      entry[childName] = cumulativeByChild[child.id] ?? 0;
    }

    return entry;
  });

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 12 }}
          tickFormatter={(v: string) => {
            const d = new Date(v);
            return `${d.getDate()}/${d.getMonth() + 1}`;
          }}
        />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip />
        <Legend />
        {children.map((child, i) => (
          <Line
            key={child.id}
            type="monotone"
            dataKey={`${child.emoji} ${child.name}`}
            stroke={COLORS[i % COLORS.length]}
            strokeWidth={2}
            dot={false}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
