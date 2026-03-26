"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ChildAvatar } from "@/components/ui/child-avatar";

interface RecentActivity {
  points: number;
  createdAt: string;
  categoryName: string;
  categoryIcon: string;
  categoryType: string;
  levelLabel: string;
}

interface ChildPublic {
  id: string;
  name: string;
  emoji: string;
  avatarUrl?: string | null;
  monthlyPoints: number;
  allTimePoints: number;
  totalPoints: number; // mapped from monthlyPoints on load
  recentActivities: RecentActivity[];
}

/* ─── Animated background ─── */
function AnimatedBg() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Large animated gradient blobs */}
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-gradient-to-br from-purple-400/40 to-fuchsia-400/30 rounded-full blur-3xl animate-blob" />
      <div className="absolute top-1/4 -right-32 w-[450px] h-[450px] bg-gradient-to-br from-pink-400/30 to-rose-400/20 rounded-full blur-3xl animate-blob" style={{ animationDelay: "2s" }} />
      <div className="absolute -bottom-32 left-1/4 w-[500px] h-[500px] bg-gradient-to-br from-cyan-400/25 to-sky-400/20 rounded-full blur-3xl animate-blob" style={{ animationDelay: "4s" }} />
      <div className="absolute top-1/2 right-1/3 w-[400px] h-[400px] bg-gradient-to-br from-amber-300/20 to-orange-300/15 rounded-full blur-3xl animate-blob" style={{ animationDelay: "6s" }} />
      <div className="absolute top-3/4 left-1/2 w-[350px] h-[350px] bg-gradient-to-br from-emerald-300/15 to-teal-300/10 rounded-full blur-3xl animate-blob" style={{ animationDelay: "8s" }} />

      {/* Floating decorations */}
      <div className="absolute top-[5%] left-[6%] text-4xl animate-float opacity-60">⭐</div>
      <div className="absolute top-[10%] right-[10%] text-5xl animate-float-reverse opacity-40">🌈</div>
      <div className="absolute top-[35%] left-[3%] text-3xl animate-float opacity-35">🎈</div>
      <div className="absolute top-[60%] right-[5%] text-4xl animate-float-reverse opacity-40">🦋</div>
      <div className="absolute bottom-[10%] left-[12%] text-3xl animate-float opacity-30">🌸</div>
      <div className="absolute top-[20%] right-[28%] text-2xl animate-float-reverse opacity-25">💫</div>
      <div className="absolute bottom-[20%] right-[18%] text-3xl animate-float opacity-35">🎵</div>
      <div className="absolute top-[50%] left-[22%] text-2xl animate-float-reverse opacity-25">✨</div>
      <div className="absolute top-[75%] left-[40%] text-3xl animate-float opacity-20">🎀</div>
      <div className="absolute top-[15%] left-[45%] text-2xl animate-float-reverse opacity-20">🍭</div>

      {/* Sparkle particles */}
      <div className="absolute top-[8%] left-[30%] w-2 h-2 bg-yellow-300 rounded-full animate-sparkle opacity-60" />
      <div className="absolute top-[45%] right-[15%] w-1.5 h-1.5 bg-pink-300 rounded-full animate-sparkle opacity-50" style={{ animationDelay: "1s" }} />
      <div className="absolute bottom-[30%] left-[8%] w-2 h-2 bg-purple-300 rounded-full animate-sparkle opacity-40" style={{ animationDelay: "2s" }} />
      <div className="absolute top-[70%] right-[35%] w-1.5 h-1.5 bg-cyan-300 rounded-full animate-sparkle opacity-50" style={{ animationDelay: "0.5s" }} />
    </div>
  );
}

/* ─── Confetti burst on load ─── */
function ConfettiBurst() {
  const particles = useMemo(() =>
    Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      emoji: ["🎉", "🎊", "✨", "💫", "⭐", "🌟"][i % 6],
      left: `${10 + Math.random() * 80}%`,
      delay: `${Math.random() * 2}s`,
      duration: `${2 + Math.random() * 3}s`,
      size: `${0.8 + Math.random() * 1.2}rem`,
    })), []);

  return (
    <div className="fixed inset-0 pointer-events-none z-20 overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute animate-confetti"
          style={{
            left: p.left,
            top: "-5%",
            animationDelay: p.delay,
            animationDuration: p.duration,
            fontSize: p.size,
          }}
        >
          {p.emoji}
        </div>
      ))}
    </div>
  );
}

/* ─── Progress ring ─── */
function ProgressRing({ points, max = 100 }: { points: number; max?: number }) {
  const [animated, setAnimated] = useState(false);
  const percentage = Math.min(Math.max((points / max) * 100, 0), 100);
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;
  const gradientId = useMemo(() => `ring-${Math.random().toString(36).slice(2, 8)}`, []);

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 400);
    return () => clearTimeout(t);
  }, []);

  const colors = points >= 50
    ? { from: "#10B981", to: "#06B6D4" }
    : points >= 25
      ? { from: "#8B5CF6", to: "#EC4899" }
      : points >= 0
        ? { from: "#F59E0B", to: "#F97316" }
        : { from: "#EF4444", to: "#DC2626" };

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width="130" height="130" className="-rotate-90">
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={colors.from} />
            <stop offset="100%" stopColor={colors.to} />
          </linearGradient>
        </defs>
        <circle cx="65" cy="65" r={radius} fill="none" stroke="#F3F4F6" strokeWidth="9" />
        <circle
          cx="65" cy="65" r={radius} fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth="9"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={animated ? offset : circumference}
          style={{
            transition: "stroke-dashoffset 1.8s cubic-bezier(0.4, 0, 0.2, 1)",
            filter: `drop-shadow(0 0 8px ${colors.from}40)`,
          }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className={`text-3xl font-black ${points >= 0 ? "text-gray-800" : "text-rose-500"}`}>
          {points}
        </span>
        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
          điểm
        </span>
      </div>
    </div>
  );
}

/* ─── Level info ─── */
function getLevelInfo(points: number) {
  const levels = [
    { min: 100, label: "Siêu sao", icon: "👑", gradient: "from-yellow-400 to-amber-500" },
    { min: 75, label: "Tuyệt vời", icon: "🏆", gradient: "from-yellow-300 to-yellow-500" },
    { min: 50, label: "Giỏi lắm", icon: "🥇", gradient: "from-blue-400 to-indigo-500" },
    { min: 25, label: "Cố gắng", icon: "🥈", gradient: "from-emerald-400 to-teal-500" },
    { min: 0, label: "Khởi đầu", icon: "🌱", gradient: "from-green-300 to-emerald-400" },
    { min: -Infinity, label: "Cần cải thiện", icon: "💪", gradient: "from-orange-400 to-red-400" },
  ];
  return levels.find((l) => points >= l.min) ?? levels[levels.length - 1];
}

/* ─── Child card ─── */
function ChildCard({ child, rank }: { child: ChildPublic; rank: number }) {
  const stars = Math.min(Math.floor(Math.max(child.totalPoints, 0) / 20), 5);
  const level = getLevelInfo(child.totalPoints);

  const headerGradients = [
    "from-violet-500 via-purple-500 to-fuchsia-500",
    "from-pink-500 via-rose-400 to-orange-400",
    "from-cyan-500 via-blue-500 to-indigo-500",
    "from-amber-400 via-orange-500 to-red-500",
    "from-emerald-400 via-teal-500 to-cyan-500",
  ];
  const gi = (rank - 1) % headerGradients.length;

  return (
    <div className="bg-white/90 backdrop-blur rounded-[2rem] overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300 group border border-white/60">
      {/* Gradient header */}
      <div className={`bg-gradient-to-br ${headerGradients[gi]} p-7 text-white relative overflow-hidden`}>
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-2 left-4 text-6xl">{child.emoji}</div>
          <div className="absolute bottom-2 right-4 text-8xl -rotate-12">{child.emoji}</div>
          <div className="absolute top-1/2 left-1/2 text-5xl rotate-12">{child.emoji}</div>
        </div>

        {/* Rank badge */}
        <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-white/25 backdrop-blur-sm text-sm font-black">
          #{rank}
        </div>

        {/* Crown for #1 */}
        {rank === 1 && (
          <div className="absolute top-3 right-4 text-3xl animate-pulse">👑</div>
        )}

        <div className="text-center pt-3 relative z-10">
          <div className="mb-3 inline-block group-hover:scale-110 transition-transform duration-500 drop-shadow-xl">
            <ChildAvatar emoji={child.emoji} avatarUrl={child.avatarUrl} size="2xl" className="ring-4 ring-white/30" />
          </div>
          <h2 className="text-3xl font-black drop-shadow-lg">{child.name}</h2>
          <div className={`inline-flex items-center gap-1.5 px-4 py-1.5 mt-3 mb-6 rounded-full bg-gradient-to-r ${level.gradient} text-sm font-bold shadow-lg`}>
            {level.icon} {level.label}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-6">
        {/* Progress ring */}
        <div className="flex justify-center -mt-16 mb-3 relative z-20">
          <div className="bg-white rounded-full p-2 shadow-xl ring-4 ring-white">
            <ProgressRing points={child.totalPoints} />
          </div>
        </div>

        {/* Stars */}
        <div className="flex justify-center gap-2 mb-5">
          {Array.from({ length: 5 }).map((_, i) => {
            const filled = i < stars;
            return (
              <div
                key={i}
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500 ${
                  filled
                    ? "bg-gradient-to-br from-yellow-300 to-amber-400 shadow-md shadow-amber-300/30 scale-100"
                    : "bg-gray-100 border-2 border-dashed border-gray-200 scale-90"
                }`}
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <span className={`text-lg ${filled ? "" : "grayscale opacity-30"}`}>
                  ⭐
                </span>
              </div>
            );
          })}
        </div>

        {/* Next level progress hint */}
        <div className="text-center mb-5">
          <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100/50">
            <span className="text-sm font-medium text-gray-600">
              {(() => {
                const nextLevel = child.totalPoints < 25
                  ? { target: 25, label: "Cố gắng 🥈" }
                  : child.totalPoints < 50
                    ? { target: 50, label: "Giỏi lắm 🥇" }
                    : child.totalPoints < 75
                      ? { target: 75, label: "Tuyệt vời 🏆" }
                      : child.totalPoints < 100
                        ? { target: 100, label: "Siêu sao 👑" }
                        : null;
                if (!nextLevel) return "Hạng cao nhất rồi! 🎉";
                const need = nextLevel.target - child.totalPoints;
                return `Cần ${need} điểm nữa → ${nextLevel.label}`;
              })()}
            </span>
            <span className="text-lg">{child.totalPoints >= 100 ? "🎉" : "🚀"}</span>
          </div>
        </div>

        {/* Activities */}
        <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-2xl p-4 border border-gray-100/50">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
            <span className="w-5 h-5 rounded-md bg-purple-100 flex items-center justify-center text-[10px]">📋</span>
            Hoạt động gần đây
          </h3>
          {child.recentActivities.length === 0 ? (
            <div className="text-center py-6">
              <span className="text-3xl">🌟</span>
              <p className="text-sm text-gray-400 mt-2">Chưa có hoạt động nào</p>
            </div>
          ) : (
            <div className="space-y-2">
              {child.recentActivities.map((activity, i) => (
                <div key={i} className={`flex items-center justify-between py-2.5 px-3.5 rounded-xl transition-colors ${
                  activity.points >= 0 ? "bg-emerald-50/80 hover:bg-emerald-50" : "bg-rose-50/80 hover:bg-rose-50"
                }`}>
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl w-9 h-9 flex items-center justify-center rounded-xl bg-white shadow-sm">
                      {activity.categoryIcon}
                    </span>
                    <div>
                      <p className="text-sm font-bold text-gray-700">{activity.categoryName}</p>
                      <p className="text-[11px] text-gray-400 font-medium">{activity.levelLabel}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-extrabold shadow-sm ${
                    activity.points >= 0 ? "bg-emerald-400 text-white" : "bg-rose-400 text-white"
                  }`}>
                    {activity.points > 0 ? "+" : ""}{activity.points}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Podium ─── */
function Podium({ sorted }: { sorted: ChildPublic[] }) {
  if (sorted.length < 2) return null;

  const top3 = sorted.slice(0, 3);
  const display = top3.length === 3 ? [top3[1], top3[0], top3[2]] : [top3[1], top3[0]];

  const configs = [
    {
      pillarH: 160, pillarW: "w-32 md:w-40",
      bg: "bg-gradient-to-t from-amber-500 via-yellow-400 to-amber-300",
      ring: "ring-4 ring-yellow-400/50 shadow-2xl shadow-amber-400/40",
      avatarBg: "bg-gradient-to-br from-yellow-100 to-amber-100",
      medal: "🥇", avatar: "text-6xl",
      sparkle: true,
    },
    {
      pillarH: 115, pillarW: "w-28 md:w-36",
      bg: "bg-gradient-to-t from-slate-400 via-gray-300 to-slate-200",
      ring: "ring-4 ring-gray-300/50 shadow-xl shadow-gray-400/20",
      avatarBg: "bg-gradient-to-br from-gray-100 to-slate-100",
      medal: "🥈", avatar: "text-5xl",
      sparkle: false,
    },
    {
      pillarH: 90, pillarW: "w-28 md:w-36",
      bg: "bg-gradient-to-t from-orange-500 via-amber-400 to-orange-300",
      ring: "ring-4 ring-orange-300/50 shadow-xl shadow-orange-400/20",
      avatarBg: "bg-gradient-to-br from-orange-50 to-amber-50",
      medal: "🥉", avatar: "text-5xl",
      sparkle: false,
    },
  ];

  return (
    <div className="mb-16 px-4">
      {/* Podium container with base */}
      <div className="flex justify-center items-end gap-2 md:gap-3">
        {display.map((child) => {
          const idx = top3.indexOf(child);
          const config = configs[idx];
          const level = getLevelInfo(child.totalPoints);
          const isFirst = idx === 0;

          return (
            <div key={child.id} className="text-center group">
              {/* Avatar circle */}
              <div className="relative inline-block mb-3">
                <div className={`${isFirst ? "w-24 h-24" : "w-20 h-20"} rounded-full ${config.avatarBg} ${config.ring} flex items-center justify-center mx-auto overflow-hidden group-hover:scale-110 transition-transform duration-300`}>
                  <ChildAvatar emoji={child.emoji} avatarUrl={child.avatarUrl} size={isFirst ? "2xl" : "xl"} />
                </div>
                {isFirst && (
                  <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-4xl drop-shadow-lg" style={{ animation: "float 3s ease-in-out infinite" }}>
                    👑
                  </div>
                )}
                {config.sparkle && (
                  <>
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-300 rounded-full animate-sparkle" />
                    <div className="absolute top-1 -left-2 w-2 h-2 bg-amber-300 rounded-full animate-sparkle" style={{ animationDelay: "0.5s" }} />
                    <div className="absolute -bottom-1 right-0 w-2.5 h-2.5 bg-yellow-200 rounded-full animate-sparkle" style={{ animationDelay: "1s" }} />
                  </>
                )}
              </div>

              {/* Name + score */}
              <p className={`font-black text-gray-800 ${isFirst ? "text-xl" : "text-base"}`}>{child.name}</p>
              <span className={`inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full bg-gradient-to-r ${level.gradient} text-white mt-1 mb-3 shadow-md`}>
                {level.icon} {child.totalPoints} điểm
              </span>

              {/* Pillar */}
              <div
                className={`${config.pillarW} ${config.bg} rounded-t-[2rem] flex flex-col items-center justify-center relative overflow-hidden mx-auto shadow-inner`}
                style={{ height: config.pillarH }}
              >
                {/* Shine effect */}
                <div className="absolute inset-0">
                  <div className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-white/30 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                </div>

                {/* Inner content */}
                <div className="relative z-10 flex flex-col items-center">
                  <span className={`${isFirst ? "text-5xl" : "text-4xl"} drop-shadow-xl mb-1`}>{config.medal}</span>
                  <span className={`text-white font-black ${isFirst ? "text-2xl" : "text-lg"} drop-shadow`}>#{idx + 1}</span>
                </div>

                {/* Bottom highlight */}
                <div className="absolute bottom-0 left-0 right-0 h-1/4 bg-gradient-to-t from-black/10 to-transparent" />
              </div>
            </div>
          );
        })}
      </div>
      {/* Base platform */}
      <div className="max-w-md md:max-w-lg mx-auto h-3 bg-gradient-to-r from-transparent via-gray-300/60 to-transparent rounded-b-full" />
    </div>
  );
}

/* ─── Fun motivational banner ─── */
function MotivationBanner({ sorted }: { sorted: ChildPublic[] }) {
  if (sorted.length === 0) return null;
  const leader = sorted[0];
  const totalActivities = sorted.reduce((s, c) => s + c.recentActivities.length, 0);

  return (
    <div className="relative overflow-hidden rounded-[2rem] p-6 md:p-8 mb-10 bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 text-white shadow-2xl shadow-purple-500/30">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-4 right-8 text-8xl">🏆</div>
        <div className="absolute bottom-2 left-6 text-6xl">⭐</div>
      </div>
      <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-black mb-1">
            {leader.emoji} {leader.name} đang dẫn đầu!
          </h2>
          <p className="text-purple-200 text-base">
            Với {leader.totalPoints} điểm sau {totalActivities} hoạt động. Ai sẽ vượt lên?
          </p>
        </div>
        <div className="flex gap-3">
          <div className="px-5 py-3 bg-white/15 backdrop-blur-sm rounded-2xl text-center">
            <p className="text-2xl font-black">{sorted.length}</p>
            <p className="text-xs text-purple-200 font-bold">Thành viên</p>
          </div>
          <div className="px-5 py-3 bg-white/15 backdrop-blur-sm rounded-2xl text-center">
            <p className="text-2xl font-black">{totalActivities}</p>
            <p className="text-xs text-purple-200 font-bold">Hoạt động</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Main page ─── */
export default function PublicPage() {
  const [children, setChildren] = useState<ChildPublic[]>([]);
  const [monthLabel, setMonthLabel] = useState("");
  const [loading, setLoading] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    fetch("/api/public")
      .then((r) => r.json())
      .then((data: { year: number; month: number; children: ChildPublic[] }) => {
        // Map monthlyPoints to totalPoints for all components
        const mapped = data.children.map((c) => ({
          ...c,
          totalPoints: c.monthlyPoints,
        }));
        setChildren(mapped as ChildPublic[]);
        setMonthLabel(`Tháng ${data.month}/${data.year}`);
        if (data.children.length > 0) setShowConfetti(true);
      })
      .catch(() => setChildren([]))
      .finally(() => setLoading(false));
  }, []);

  // Auto-hide confetti
  useEffect(() => {
    if (showConfetti) {
      const t = setTimeout(() => setShowConfetti(false), 5000);
      return () => clearTimeout(t);
    }
  }, [showConfetti]);

  const sorted = [...children].sort((a, b) => b.totalPoints - a.totalPoints);

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-100 via-pink-50 via-50% to-amber-50 relative">
      <AnimatedBg />
      {showConfetti && <ConfettiBurst />}

      {/* Header */}
      <header className="relative z-10 text-center pt-14 pb-10 px-4">
        <div className="inline-block relative mb-6">
          <div className="inline-flex items-center justify-center w-28 h-28 rounded-[2.5rem] bg-white/90 backdrop-blur shadow-2xl shadow-purple-500/10 border border-white/60">
            <span className="text-6xl">🏠</span>
          </div>
          <div className="absolute -top-2 -right-2 text-3xl animate-bounce" style={{ animationDuration: "1.5s" }}>✨</div>
          <div className="absolute -bottom-1 -left-2 text-2xl animate-bounce" style={{ animationDuration: "2s", animationDelay: "0.5s" }}>🌟</div>
        </div>
        <h1 className="text-5xl md:text-7xl font-black bg-gradient-to-r from-violet-600 via-fuchsia-600 to-orange-500 bg-clip-text text-transparent pb-2 leading-tight">
          Gia đình Bơ Gấu
        </h1>
        {monthLabel && (
          <p className="mt-3 inline-flex items-center gap-2 px-5 py-2 bg-white/70 backdrop-blur rounded-full shadow text-base font-bold text-purple-600 border border-purple-100/50">
            📅 {monthLabel}
          </p>
        )}
        <p className="text-gray-500 mt-3 text-xl max-w-lg mx-auto font-medium leading-relaxed">
          Mỗi hành động tốt đều được ghi nhận
        </p>

        {/* Stat pills */}
        {sorted.length > 0 && (
          <div className="flex justify-center gap-3 mt-8 flex-wrap">
            <span className="px-5 py-2.5 bg-white/80 backdrop-blur-sm rounded-full shadow-lg shadow-purple-500/5 text-sm font-bold text-purple-600 border border-purple-100/50">
              👶 {sorted.length} bé
            </span>
            <span className="px-5 py-2.5 bg-white/80 backdrop-blur-sm rounded-full shadow-lg shadow-emerald-500/5 text-sm font-bold text-emerald-600 border border-emerald-100/50">
              ⭐ {sorted.reduce((s, c) => s + Math.max(c.totalPoints, 0), 0)} điểm
            </span>
            <span className="px-5 py-2.5 bg-white/80 backdrop-blur-sm rounded-full shadow-lg shadow-pink-500/5 text-sm font-bold text-pink-600 border border-pink-100/50">
              📝 {sorted.reduce((s, c) => s + c.recentActivities.length, 0)} hoạt động
            </span>
          </div>
        )}
      </header>

      {/* Content */}
      <main className="relative z-10 max-w-6xl mx-auto px-4 pb-16">
        {loading ? (
          <div className="text-center py-28">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-white/80 backdrop-blur shadow-2xl">
              <span className="text-5xl animate-spin" style={{ animationDuration: "2s" }}>🌟</span>
            </div>
            <p className="text-gray-400 mt-6 font-bold text-xl">Đang tải bảng điểm...</p>
          </div>
        ) : sorted.length === 0 ? (
          <div className="text-center py-28">
            <div className="text-8xl mb-6">🌈</div>
            <p className="text-3xl font-black text-gray-600 mb-3">Chào mừng!</p>
            <p className="text-gray-400 text-xl">Hành trình sắp bắt đầu. Hãy cùng nhau cố gắng nhé!</p>
          </div>
        ) : (
          <>
            <Podium sorted={sorted} />
            <MotivationBanner sorted={sorted} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {sorted.map((child, i) => (
                <ChildCard key={child.id} child={child} rank={i + 1} />
              ))}
            </div>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center pb-12">
        <Link href="/login" className="text-xs text-gray-300 hover:text-purple-500 transition-colors">
          Quản trị viên
        </Link>
      </footer>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-25px) rotate(8deg); }
        }
        @keyframes float-reverse {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(-6deg); }
        }
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(30px, -30px) scale(1.1); }
          50% { transform: translate(-20px, 20px) scale(0.95); }
          75% { transform: translate(20px, 10px) scale(1.05); }
        }
        @keyframes shimmer {
          0% { transform: translateX(-200%); }
          100% { transform: translateX(200%); }
        }
        @keyframes sparkle {
          0%, 100% { opacity: 0; transform: scale(0); }
          50% { opacity: 1; transform: scale(1); }
        }
        @keyframes confetti {
          0% { transform: translateY(-10vh) rotate(0deg); opacity: 1; }
          100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
        }
        :global(.animate-float) { animation: float 5s ease-in-out infinite; }
        :global(.animate-float-reverse) { animation: float-reverse 6s ease-in-out infinite; }
        :global(.animate-blob) { animation: blob 12s ease-in-out infinite; }
        :global(.animate-shimmer) { animation: shimmer 3s ease-in-out infinite; }
        :global(.animate-sparkle) { animation: sparkle 2s ease-in-out infinite; }
        :global(.animate-confetti) { animation: confetti linear forwards; }
      `}</style>
    </div>
  );
}
