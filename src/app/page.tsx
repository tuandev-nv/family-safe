"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
  totalPoints: number;
  recentActivities: RecentActivity[];
}

/* ─── Animated background with dancing emojis ─── */
function AnimatedBg() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 will-change-transform">
      {/* Gradient blobs - static, no animation to save GPU */}
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-gradient-to-br from-purple-400/30 to-fuchsia-400/20 rounded-full blur-2xl" />
      <div className="absolute top-1/4 -right-32 w-[450px] h-[450px] bg-gradient-to-br from-pink-400/20 to-rose-400/15 rounded-full blur-2xl" />
      <div className="absolute -bottom-32 left-1/4 w-[500px] h-[500px] bg-gradient-to-br from-cyan-400/20 to-sky-400/15 rounded-full blur-2xl" />

      {/* Floating emojis - simple float only, GPU-friendly */}
      <div className="absolute top-[5%] left-[6%] text-4xl animate-float opacity-60">⭐</div>
      <div className="absolute top-[10%] right-[10%] text-5xl animate-float opacity-40" style={{ animationDelay: "1s" }}>🌈</div>
      <div className="absolute top-[35%] left-[3%] text-3xl animate-wiggle opacity-40">🎈</div>
      <div className="absolute top-[60%] right-[5%] text-4xl animate-float opacity-40" style={{ animationDelay: "2s" }}>🦋</div>
      <div className="absolute bottom-[10%] left-[12%] text-3xl animate-float opacity-30" style={{ animationDelay: "3s" }}>🌸</div>
      <div className="absolute top-[20%] right-[28%] text-2xl animate-wiggle opacity-30" style={{ animationDelay: "1.5s" }}>💫</div>
      <div className="absolute bottom-[20%] right-[18%] text-3xl animate-float opacity-35" style={{ animationDelay: "0.8s" }}>🎵</div>
      <div className="absolute top-[75%] left-[40%] text-3xl animate-wiggle opacity-25" style={{ animationDelay: "2.5s" }}>🎀</div>
      <div className="absolute top-[15%] left-[45%] text-2xl animate-float opacity-25" style={{ animationDelay: "1.2s" }}>🍭</div>
      <div className="absolute top-[70%] left-[60%] text-3xl animate-float opacity-25" style={{ animationDelay: "3.5s" }}>🧸</div>

      {/* Sparkle dots */}
      <div className="absolute top-[8%] left-[30%] w-2 h-2 bg-yellow-300 rounded-full animate-sparkle-pop opacity-60" />
      <div className="absolute top-[45%] right-[15%] w-2 h-2 bg-pink-400 rounded-full animate-sparkle-pop opacity-50" style={{ animationDelay: "1s" }} />
      <div className="absolute bottom-[30%] left-[8%] w-2 h-2 bg-purple-400 rounded-full animate-sparkle-pop opacity-40" style={{ animationDelay: "2s" }} />
      <div className="absolute top-[70%] right-[35%] w-1.5 h-1.5 bg-cyan-400 rounded-full animate-sparkle-pop opacity-50" style={{ animationDelay: "3s" }} />
    </div>
  );
}

/* ─── Confetti burst on load ─── */
function ConfettiBurst() {
  const particles = useMemo(
    () =>
      Array.from({ length: 30 }).map((_, i) => ({
        id: i,
        emoji: ["🎉", "🎊", "✨", "💫", "⭐", "🌟", "🎈", "🎀", "🦄", "🌈"][i % 10],
        left: `${5 + Math.random() * 90}%`,
        delay: `${Math.random() * 3}s`,
        duration: `${2.5 + Math.random() * 4}s`,
        size: `${1 + Math.random() * 1.5}rem`,
        wobble: Math.random() > 0.5 ? "animate-confetti-wobble-left" : "animate-confetti-wobble-right",
      })),
    [],
  );

  return (
    <div className="fixed inset-0 pointer-events-none z-20 overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          className={`absolute ${p.wobble}`}
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

/* ─── Cursor sparkle effect (click + mouse move) ─── */
function CursorSparkle() {
  const [sparkles, setSparkles] = useState<Array<{ id: number; x: number; y: number; emoji: string }>>([]);
  const nextId = useRef(0);
  const lastMoveTime = useRef(0);

  const emojis = useMemo(() => ["✨", "⭐", "💖", "🌟", "🎉", "🦄", "🌈", "🎀", "💫", "🍬"], []);

  const spawnSparkles = useCallback((x: number, y: number, count: number) => {
    const newSparkles = Array.from({ length: count }).map(() => ({
      id: nextId.current++,
      x: x + (Math.random() - 0.5) * 50,
      y: y + (Math.random() - 0.5) * 50,
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
    }));
    setSparkles((prev) => [...prev, ...newSparkles]);
    setTimeout(() => {
      setSparkles((prev) => prev.filter((s) => !newSparkles.includes(s)));
    }, 800);
  }, [emojis]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      spawnSparkles(e.clientX, e.clientY, 5);
    };
    const handleMove = (e: MouseEvent) => {
      const now = Date.now();
      if (now - lastMoveTime.current < 40) return;
      lastMoveTime.current = now;
      spawnSparkles(e.clientX, e.clientY, 1);
    };
    window.addEventListener("click", handleClick);
    window.addEventListener("mousemove", handleMove);
    return () => {
      window.removeEventListener("click", handleClick);
      window.removeEventListener("mousemove", handleMove);
    };
  }, [spawnSparkles]);

  if (sparkles.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-30 overflow-hidden">
      {sparkles.map((s) => (
        <div
          key={s.id}
          className="fixed animate-tap-sparkle text-xl"
          style={{ left: s.x, top: s.y }}
        >
          {s.emoji}
        </div>
      ))}
    </div>
  );
}

/* ─── Fun loading screen ─── */
function FunLoading() {
  const animals = useMemo(() => ["🐻", "🐼", "🦊", "🐰", "🐱"], []);
  const [currentAnimal, setCurrentAnimal] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAnimal((prev) => (prev + 1) % animals.length);
    }, 400);
    return () => clearInterval(interval);
  }, [animals.length]);

  return (
    <div className="text-center py-28">
      <div className="inline-flex items-center justify-center w-32 h-32 rounded-[2.5rem] bg-white/80 backdrop-blur shadow-2xl mb-6">
        <span className="text-7xl animate-bounce-fun" style={{ animationDuration: "0.6s" }}>
          {animals[currentAnimal]}
        </span>
      </div>
      <div className="flex justify-center gap-2 mb-4">
        {["bg-purple-400", "bg-pink-400", "bg-amber-400", "bg-emerald-400", "bg-blue-400"].map((color, i) => (
          <div
            key={i}
            className={`w-4 h-4 rounded-full ${color} animate-bounce-fun`}
            style={{ animationDelay: `${i * 0.15}s`, animationDuration: "0.8s" }}
          />
        ))}
      </div>
      <p className="text-gray-500 font-bold text-xl animate-pulse">
        Đang tải bảng điểm...
      </p>
    </div>
  );
}

/* ─── Progress ring ─── */
function ProgressRing({ points, max = 80 }: { points: number; max?: number }) {
  const [animated, setAnimated] = useState(false);
  const percentage = Math.min(Math.max((points / max) * 100, 0), 100);
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;
  const gradientId = useMemo(
    () => `ring-${Math.random().toString(36).slice(2, 8)}`,
    [],
  );

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 400);
    return () => clearTimeout(t);
  }, []);

  const colors =
    points >= 60
      ? { from: "#10B981", to: "#06B6D4" }
      : points >= 40
        ? { from: "#8B5CF6", to: "#EC4899" }
        : points >= 20
          ? { from: "#F59E0B", to: "#F97316" }
          : points >= 0
            ? { from: "#8B5CF6", to: "#A855F7" }
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
          strokeWidth="9" strokeLinecap="round"
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
    { min: 80, label: "Siêu sao", icon: "👑", gradient: "from-yellow-400 to-amber-500" },
    { min: 60, label: "Tuyệt vời", icon: "🏆", gradient: "from-yellow-300 to-yellow-500" },
    { min: 40, label: "Giỏi lắm", icon: "🥇", gradient: "from-blue-400 to-indigo-500" },
    { min: 20, label: "Cố gắng", icon: "🥈", gradient: "from-emerald-400 to-teal-500" },
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
    <div className="bg-white/90 backdrop-blur rounded-[2rem] overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 group border border-white/60 hover:-translate-y-2 animate-card-entrance" style={{ animationDelay: `${rank * 0.15}s` }}>
      {/* Gradient header */}
      <div className={`bg-gradient-to-br ${headerGradients[gi]} p-7 text-white relative overflow-hidden`}>
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-2 left-4 text-6xl animate-wiggle">{child.emoji}</div>
          <div className="absolute bottom-2 right-4 text-8xl -rotate-12 animate-wiggle" style={{ animationDelay: "1s" }}>{child.emoji}</div>
          <div className="absolute top-1/2 left-1/2 text-5xl rotate-12 animate-wiggle" style={{ animationDelay: "2s" }}>{child.emoji}</div>
        </div>

        {/* Rank badge */}
        <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-white/25 backdrop-blur-sm text-sm font-black animate-bounce-fun" style={{ animationDuration: "2s" }}>
          #{rank}
        </div>

        {/* Crown for #1 */}
        {rank === 1 && (
          <div className="absolute top-3 right-4 text-3xl animate-wiggle">
            👑
          </div>
        )}

        <div className="text-center pt-3 relative z-10">
          <div className="mb-3 inline-block group-hover:scale-110 transition-transform duration-500 drop-shadow-xl will-change-transform group-hover:animate-jelly">
            <ChildAvatar
              emoji={child.emoji}
              avatarUrl={child.avatarUrl}
              size="3xl"
              className="ring-4 ring-white/30"
            />
          </div>
          <h2 className="text-3xl font-black drop-shadow-lg">{child.name}</h2>
          <div className={`inline-flex items-center gap-1.5 px-4 py-1.5 mt-3 mb-6 rounded-full bg-gradient-to-r ${level.gradient} text-sm font-bold shadow-lg animate-bounce-fun`} style={{ animationDuration: "3s" }}>
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
                    ? "bg-gradient-to-br from-yellow-300 to-amber-400 shadow-md shadow-amber-300/30 scale-100 animate-star-pop"
                    : "bg-gray-100 border-2 border-dashed border-gray-200 scale-90"
                }`}
                style={{ animationDelay: `${i * 0.2}s` }}
              >
                <span className={`text-lg ${filled ? "animate-wiggle" : "grayscale opacity-30"}`} style={{ animationDelay: `${i * 0.3}s` }}>
                  ⭐
                </span>
              </div>
            );
          })}
        </div>

        {/* Next level progress hint */}
        <div className="text-center mb-5">
          <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100/50 group-hover:from-purple-100 group-hover:to-pink-100 transition-colors">
            <span className="text-sm font-medium text-gray-600">
              {(() => {
                const nextLevel =
                  child.totalPoints < 20 ? { target: 20, label: "Cố gắng 🥈" }
                    : child.totalPoints < 40 ? { target: 40, label: "Giỏi lắm 🥇" }
                    : child.totalPoints < 60 ? { target: 60, label: "Tuyệt vời 🏆" }
                    : child.totalPoints < 80 ? { target: 80, label: "Siêu sao 👑" }
                    : null;
                if (!nextLevel) return "Hạng cao nhất rồi! 🎉";
                const need = nextLevel.target - child.totalPoints;
                return `Cần ${need} điểm nữa → ${nextLevel.label}`;
              })()}
            </span>
            <span className="text-lg animate-bounce-fun" style={{ animationDuration: "2s" }}>
              {child.totalPoints >= 100 ? "🎉" : "🚀"}
            </span>
          </div>
        </div>

        {/* Activities */}
        <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-2xl p-4 border border-gray-100/50">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
            <span className="w-5 h-5 rounded-md bg-purple-100 flex items-center justify-center text-[10px]">
              📋
            </span>
            Hoạt động gần đây
          </h3>
          {child.recentActivities.length === 0 ? (
            <div className="text-center py-6">
              <span className="text-4xl animate-wiggle">🌟</span>
              <p className="text-sm text-gray-400 mt-2">
                Chưa có hoạt động nào
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {child.recentActivities.map((activity, i) => (
                <div
                  key={i}
                  className={`flex items-center justify-between py-2.5 px-3.5 rounded-xl transition-all duration-200 hover:scale-[1.02] ${
                    activity.points >= 0
                      ? "bg-emerald-50/80 hover:bg-emerald-100/80"
                      : "bg-rose-50/80 hover:bg-rose-100/80"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl w-9 h-9 flex items-center justify-center rounded-xl bg-white shadow-sm hover:animate-wiggle">
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
      pillarH: 200, pillarW: "w-40 md:w-52",
      bg: "bg-gradient-to-t from-amber-600 via-yellow-400 to-amber-300",
      ring: "ring-[6px] ring-yellow-400/60 shadow-2xl shadow-amber-400/50",
      avatarBg: "bg-gradient-to-br from-yellow-100 to-amber-100",
      medal: "🥇", sparkle: true,
    },
    {
      pillarH: 150, pillarW: "w-36 md:w-44",
      bg: "bg-gradient-to-t from-slate-500 via-gray-300 to-slate-200",
      ring: "ring-4 ring-gray-300/50 shadow-xl shadow-gray-400/30",
      avatarBg: "bg-gradient-to-br from-gray-100 to-slate-100",
      medal: "🥈", sparkle: false,
    },
    {
      pillarH: 120, pillarW: "w-36 md:w-44",
      bg: "bg-gradient-to-t from-orange-600 via-amber-400 to-orange-300",
      ring: "ring-4 ring-orange-300/50 shadow-xl shadow-orange-400/30",
      avatarBg: "bg-gradient-to-br from-orange-50 to-amber-50",
      medal: "🥉", sparkle: false,
    },
  ];

  return (
    <div className="mb-16 px-4">
      <div className="flex justify-center items-end gap-2 md:gap-3">
        {display.map((child) => {
          const idx = top3.indexOf(child);
          const config = configs[idx];
          const level = getLevelInfo(child.totalPoints);
          const isFirst = idx === 0;

          return (
            <div key={child.id} className="text-center group animate-podium-rise" style={{ animationDelay: `${idx * 0.2}s` }}>
              {/* Avatar circle */}
              <div className="relative inline-block mb-3">
                <div
                  className={`${isFirst ? "w-40 h-40" : "w-28 h-28"} rounded-full ${config.avatarBg} ${config.ring} flex items-center justify-center mx-auto overflow-hidden group-hover:scale-110 group-hover:animate-jelly transition-transform duration-300 will-change-transform`}
                >
                  <ChildAvatar emoji={child.emoji} avatarUrl={child.avatarUrl} size={isFirst ? "4xl" : "3xl"} />
                </div>
                {isFirst && (
                  <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-4xl drop-shadow-lg animate-wiggle">
                    👑
                  </div>
                )}
                {config.sparkle && (
                  <>
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-300 rounded-full animate-sparkle-pop" />
                    <div className="absolute top-1 -left-2 w-2 h-2 bg-amber-300 rounded-full animate-sparkle-pop" style={{ animationDelay: "0.5s" }} />
                    <div className="absolute -bottom-1 right-0 w-2.5 h-2.5 bg-yellow-200 rounded-full animate-sparkle-pop" style={{ animationDelay: "1s" }} />
                    <div className="absolute top-1/2 -right-3 w-2 h-2 bg-pink-300 rounded-full animate-sparkle-pop" style={{ animationDelay: "1.5s" }} />
                  </>
                )}
              </div>

              {/* Name + score */}
              <p className={`font-black text-gray-800 ${isFirst ? "text-2xl" : "text-lg"}`}>
                {child.name}
              </p>
              <span className={`inline-flex items-center gap-1 ${isFirst ? "text-sm" : "text-xs"} font-bold px-4 py-1.5 rounded-full bg-gradient-to-r ${level.gradient} text-white mt-1.5 mb-3 shadow-lg`}>
                {level.icon} {child.totalPoints} điểm
              </span>

              {/* Pillar */}
              <div
                className={`${config.pillarW} ${config.bg} rounded-t-[2rem] flex flex-col items-center justify-center relative overflow-hidden mx-auto shadow-inner`}
                style={{ height: config.pillarH }}
              >
                <div className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-white/20 to-transparent" />
                <div className="relative z-10 flex flex-col items-center">
                  <span className={`${isFirst ? "text-6xl" : "text-5xl"} drop-shadow-xl mb-1`}>
                    {config.medal}
                  </span>
                  <span className={`text-white font-black ${isFirst ? "text-3xl" : "text-xl"} drop-shadow`}>
                    #{idx + 1}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
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
    <div className="relative overflow-hidden rounded-[2rem] p-6 md:p-8 mb-10 bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 text-white shadow-2xl shadow-purple-500/30 hover:shadow-purple-500/50 transition-shadow duration-300 animate-card-entrance">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-4 right-8 text-8xl animate-wiggle">🏆</div>
        <div className="absolute bottom-2 left-6 text-6xl animate-dance" style={{ animationDelay: "1s" }}>⭐</div>
        <div className="absolute top-1/2 left-1/3 text-5xl animate-dance-reverse" style={{ animationDelay: "2s" }}>🎯</div>
      </div>
      <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-black mb-1">
            <span className="animate-wiggle inline-block">{leader.emoji}</span> {leader.name} đang dẫn đầu!
          </h2>
          <p className="text-purple-200 text-base">
            Với {leader.totalPoints} điểm sau {totalActivities} hoạt động. Ai sẽ vượt lên?
          </p>
        </div>
        <div className="flex gap-3">
          <div className="px-5 py-3 bg-white/15 backdrop-blur-sm rounded-2xl text-center hover:bg-white/25 transition-colors hover:scale-105 duration-200">
            <p className="text-2xl font-black">{sorted.length}</p>
            <p className="text-xs text-purple-200 font-bold">Thành viên</p>
          </div>
          <div className="px-5 py-3 bg-white/15 backdrop-blur-sm rounded-2xl text-center hover:bg-white/25 transition-colors hover:scale-105 duration-200">
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
      .then(
        (data: { year: number; month: number; children: ChildPublic[] }) => {
          const mapped = data.children.map((c) => ({
            ...c,
            totalPoints: c.monthlyPoints,
          }));
          setChildren(mapped as ChildPublic[]);
          setMonthLabel(`Tháng ${data.month}/${data.year}`);
          if (data.children.length > 0) setShowConfetti(true);
        },
      )
      .catch(() => setChildren([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (showConfetti) {
      const t = setTimeout(() => setShowConfetti(false), 6000);
      return () => clearTimeout(t);
    }
  }, [showConfetti]);

  const sorted = [...children].sort((a, b) => b.totalPoints - a.totalPoints);

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-300 via-fuchsia-200 via-40% to-amber-200 relative">
      <AnimatedBg />
      <CursorSparkle />
      {showConfetti && <ConfettiBurst />}

      {/* Header */}
      <header className="relative z-10 text-center pt-14 pb-10 px-4">
        <div className="inline-block relative mb-6 animate-header-entrance">
          <div className="inline-flex items-center justify-center w-28 h-28 rounded-[2.5rem] bg-white/90 backdrop-blur shadow-2xl shadow-purple-500/10 border border-white/60 hover:rotate-12 transition-transform duration-300 cursor-pointer">
            <span className="text-6xl animate-wiggle">🏠</span>
          </div>
          <div className="absolute -top-3 -right-3 text-3xl animate-dance" style={{ animationDelay: "0s" }}>
            ✨
          </div>
          <div className="absolute -bottom-2 -left-3 text-2xl animate-dance-reverse" style={{ animationDelay: "0.5s" }}>
            🌟
          </div>
          <div className="absolute top-1/2 -right-6 text-xl animate-dance" style={{ animationDelay: "1s" }}>
            💖
          </div>
        </div>

        <h1 className="text-5xl md:text-7xl font-black pb-2 leading-tight animate-rainbow-title relative">
          <span
            className="bg-gradient-to-r from-yellow-400 via-fuchsia-500 to-violet-600 bg-clip-text text-transparent animate-title-glow"
            style={{
              WebkitTextStroke: "2px rgba(168, 85, 247, 0.1)",
              filter: "drop-shadow(0 2px 0 rgba(168, 85, 247, 0.4)) drop-shadow(0 5px 0 rgba(139, 92, 246, 0.3)) drop-shadow(0 8px 0 rgba(109, 40, 217, 0.2)) drop-shadow(0 14px 30px rgba(168, 85, 247, 0.4))",
            }}
          >
            Gia đình Gấu Bơ
          </span>
        </h1>
        {monthLabel && (
          <p className="mt-3 inline-flex items-center gap-2 px-5 py-2 bg-white/70 backdrop-blur rounded-full shadow text-base font-bold text-purple-600 border border-purple-100/50 animate-bounce-fun" style={{ animationDuration: "3s" }}>
            📅 {monthLabel}
          </p>
        )}
        <p className="text-gray-500 mt-3 text-xl max-w-lg mx-auto font-medium leading-relaxed">
          Mỗi hành động tốt đều được ghi nhận ✨
        </p>

      </header>

      {/* Content */}
      <main className="relative z-10 max-w-6xl mx-auto px-4 pb-16">
        {loading ? (
          <FunLoading />
        ) : sorted.length === 0 ? (
          <div className="text-center py-28 animate-card-entrance">
            <div className="text-8xl mb-6 animate-wiggle">🌈</div>
            <p className="text-3xl font-black text-gray-600 mb-3">Chào mừng!</p>
            <p className="text-gray-400 text-xl">
              Hành trình sắp bắt đầu. Hãy cùng nhau cố gắng nhé! 🚀
            </p>
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
        @keyframes dance {
          0%, 100% { transform: translateY(0) rotate(0deg) scale(1); }
          20% { transform: translateY(-20px) rotate(10deg) scale(1.1); }
          40% { transform: translateY(-10px) rotate(-8deg) scale(0.95); }
          60% { transform: translateY(-25px) rotate(5deg) scale(1.05); }
          80% { transform: translateY(-5px) rotate(-3deg) scale(1); }
        }
        @keyframes dance-reverse {
          0%, 100% { transform: translateY(0) rotate(0deg) scale(1); }
          20% { transform: translateY(-15px) rotate(-12deg) scale(1.05); }
          40% { transform: translateY(-25px) rotate(8deg) scale(1.1); }
          60% { transform: translateY(-8px) rotate(-5deg) scale(0.95); }
          80% { transform: translateY(-18px) rotate(3deg) scale(1.05); }
        }
        @keyframes wiggle {
          0%, 100% { transform: rotate(0deg); }
          15% { transform: rotate(14deg); }
          30% { transform: rotate(-12deg); }
          45% { transform: rotate(10deg); }
          60% { transform: rotate(-8deg); }
          75% { transform: rotate(5deg); }
          90% { transform: rotate(-3deg); }
        }
        @keyframes bounce-fun {
          0%, 100% { transform: translateY(0); }
          30% { transform: translateY(-12px); }
          50% { transform: translateY(-6px); }
          70% { transform: translateY(-10px); }
        }
        @keyframes jelly {
          0% { transform: scale(1, 1); }
          25% { transform: scale(0.95, 1.05); }
          50% { transform: scale(1.05, 0.95); }
          75% { transform: scale(0.97, 1.03); }
          100% { transform: scale(1, 1); }
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
        @keyframes sparkle-pop {
          0%, 100% { opacity: 0; transform: scale(0) rotate(0deg); }
          30% { opacity: 1; transform: scale(1.3) rotate(90deg); }
          50% { opacity: 1; transform: scale(1) rotate(180deg); }
          70% { opacity: 0.8; transform: scale(1.2) rotate(270deg); }
        }
        @keyframes confetti-wobble-left {
          0% { transform: translateY(-10vh) rotate(0deg) translateX(0); opacity: 1; }
          25% { transform: translateY(25vh) rotate(180deg) translateX(-40px); }
          50% { transform: translateY(55vh) rotate(360deg) translateX(20px); }
          75% { transform: translateY(80vh) rotate(540deg) translateX(-30px); opacity: 0.7; }
          100% { transform: translateY(110vh) rotate(720deg) translateX(10px); opacity: 0; }
        }
        @keyframes confetti-wobble-right {
          0% { transform: translateY(-10vh) rotate(0deg) translateX(0); opacity: 1; }
          25% { transform: translateY(25vh) rotate(-180deg) translateX(40px); }
          50% { transform: translateY(55vh) rotate(-360deg) translateX(-20px); }
          75% { transform: translateY(80vh) rotate(-540deg) translateX(30px); opacity: 0.7; }
          100% { transform: translateY(110vh) rotate(-720deg) translateX(-10px); opacity: 0; }
        }
        @keyframes tap-sparkle {
          0% { transform: scale(0) rotate(0deg); opacity: 1; }
          50% { transform: scale(1.5) rotate(180deg); opacity: 0.8; }
          100% { transform: scale(0) rotate(360deg) translateY(-40px); opacity: 0; }
        }
        @keyframes star-pop {
          0% { transform: scale(0) rotate(-20deg); }
          50% { transform: scale(1.2) rotate(10deg); }
          100% { transform: scale(1) rotate(0deg); }
        }
        @keyframes card-entrance {
          0% { opacity: 0; transform: translateY(30px) scale(0.95); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes header-entrance {
          0% { opacity: 0; transform: scale(0.5) rotate(-10deg); }
          60% { transform: scale(1.1) rotate(3deg); }
          100% { opacity: 1; transform: scale(1) rotate(0deg); }
        }
        @keyframes podium-rise {
          0% { opacity: 0; transform: translateY(60px); }
          60% { transform: translateY(-8px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes pillar-grow {
          0% { max-height: 0; opacity: 0; }
          100% { max-height: 200px; opacity: 1; }
        }
        @keyframes rainbow-title {
          0% { opacity: 0; transform: scale(0.8); filter: blur(10px); }
          100% { opacity: 1; transform: scale(1); filter: blur(0); }
        }
        @keyframes title-glow {
          0%, 100% { filter: drop-shadow(0 2px 0 rgba(168,85,247,0.4)) drop-shadow(0 5px 0 rgba(139,92,246,0.3)) drop-shadow(0 8px 0 rgba(109,40,217,0.2)) drop-shadow(0 14px 30px rgba(168,85,247,0.3)); }
          50% { filter: drop-shadow(0 2px 0 rgba(168,85,247,0.5)) drop-shadow(0 5px 0 rgba(139,92,246,0.4)) drop-shadow(0 8px 0 rgba(109,40,217,0.3)) drop-shadow(0 14px 40px rgba(168,85,247,0.6)); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        :global(.animate-float) { animation: float 6s ease-in-out infinite; }
        :global(.animate-dance) { animation: dance 4s ease-in-out infinite; }
        :global(.animate-dance-reverse) { animation: dance-reverse 5s ease-in-out infinite; }
        :global(.animate-wiggle) { animation: wiggle 2.5s ease-in-out infinite; }
        :global(.animate-bounce-fun) { animation: bounce-fun 1.5s ease-in-out infinite; }
        :global(.animate-blob) { animation: blob 12s ease-in-out infinite; }
        :global(.animate-shimmer) { animation: shimmer 3s ease-in-out infinite; }
        :global(.animate-sparkle-pop) { animation: sparkle-pop 2.5s ease-in-out infinite; }
        :global(.animate-confetti-wobble-left) { animation: confetti-wobble-left linear forwards; }
        :global(.animate-confetti-wobble-right) { animation: confetti-wobble-right linear forwards; }
        :global(.animate-tap-sparkle) { animation: tap-sparkle 1s ease-out forwards; }
        :global(.animate-star-pop) { animation: star-pop 0.5s ease-out forwards; }
        :global(.animate-card-entrance) { animation: card-entrance 0.6s ease-out forwards; }
        :global(.animate-header-entrance) { animation: header-entrance 0.8s ease-out forwards; }
        :global(.animate-podium-rise) { animation: podium-rise 0.7s ease-out forwards; }
        :global(.animate-pillar-grow) { animation: pillar-grow 0.8s ease-out forwards; }
        :global(.animate-rainbow-title) { animation: rainbow-title 1s ease-out forwards; }
        :global(.animate-jelly) { animation: jelly 0.5s ease-in-out; }
        :global(.animate-title-glow) { animation: title-glow 3s ease-in-out infinite; }
      `}</style>
    </div>
  );
}
