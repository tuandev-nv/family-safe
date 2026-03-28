"use client";

import { ChildAvatar } from "@/components/ui/child-avatar";
import { ProgressRing } from "./progress-ring";
import type { ChildPublic } from "./types";

/* ---- Level info ---- */
export function getLevelInfo(points: number) {
  const levels = [
    {
      min: 80,
      label: "Siêu sao",
      icon: "👑",
      gradient: "from-yellow-400 to-amber-500",
    },
    {
      min: 60,
      label: "Tuyệt vời",
      icon: "🏆",
      gradient: "from-yellow-300 to-yellow-500",
    },
    {
      min: 40,
      label: "Giỏi lắm",
      icon: "🥇",
      gradient: "from-blue-400 to-indigo-500",
    },
    {
      min: 20,
      label: "Cố gắng",
      icon: "🥈",
      gradient: "from-emerald-400 to-teal-500",
    },
    {
      min: 0,
      label: "Khởi đầu",
      icon: "🚀",
      gradient: "from-violet-500 to-purple-600",
    },
    {
      min: -Infinity,
      label: "Cần cải thiện",
      icon: "💪",
      gradient: "from-orange-400 to-red-400",
    },
  ];
  return levels.find((l) => points >= l.min) ?? levels[levels.length - 1];
}

/* ---- Child card ---- */
export function ChildCard({ child, rank }: { child: ChildPublic; rank: number }) {
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
    <div
      className="bg-white/90 backdrop-blur rounded-4xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 group border border-white/60 hover:-translate-y-2 animate-card-entrance"
      style={{ animationDelay: `${rank * 0.15}s` }}
    >
      {/* Gradient header */}
      <div
        className={`bg-linear-to-br ${headerGradients[gi]} p-7 text-white relative overflow-hidden`}
      >
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-2 left-4 text-6xl animate-wiggle">
            {child.emoji}
          </div>
          <div
            className="absolute bottom-2 right-4 text-8xl -rotate-12 animate-wiggle"
            style={{ animationDelay: "1s" }}
          >
            {child.emoji}
          </div>
          <div
            className="absolute top-1/2 left-1/2 text-5xl rotate-12 animate-wiggle"
            style={{ animationDelay: "2s" }}
          >
            {child.emoji}
          </div>
        </div>

        {/* Rank badge */}
        <div
          className="absolute top-4 left-4 px-3 py-1 rounded-full bg-white/25 backdrop-blur-sm text-sm font-black animate-bounce-fun"
          style={{ animationDuration: "2s" }}
        >
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
          <div
            className={`inline-flex items-center gap-1.5 px-4 py-1.5 mt-3 mb-6 rounded-full bg-linear-to-r ${level.gradient} text-sm font-bold shadow-lg animate-bounce-fun`}
            style={{ animationDuration: "3s" }}
          >
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
                    ? "bg-linear-to-br from-yellow-300 to-amber-400 shadow-md shadow-amber-300/30 scale-100 animate-star-pop"
                    : "bg-gray-100 border-2 border-dashed border-gray-200 scale-90"
                }`}
                style={{ animationDelay: `${i * 0.2}s` }}
              >
                <span
                  className={`text-lg ${filled ? "animate-wiggle" : "grayscale opacity-30"}`}
                  style={{ animationDelay: `${i * 0.3}s` }}
                >
                  ⭐
                </span>
              </div>
            );
          })}
        </div>

        {/* Next level progress hint */}
        <div className="text-center mb-5">
          <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-linear-to-r from-purple-50 to-pink-50 border border-purple-100/50 group-hover:from-purple-100 group-hover:to-pink-100 transition-colors">
            <span className="text-sm font-medium text-gray-600">
              {(() => {
                const nextLevel =
                  child.totalPoints < 20
                    ? { target: 20, label: "Cố gắng 🥈" }
                    : child.totalPoints < 40
                      ? { target: 40, label: "Giỏi lắm 🥇" }
                      : child.totalPoints < 60
                        ? { target: 60, label: "Tuyệt vời 🏆" }
                        : child.totalPoints < 80
                          ? { target: 80, label: "Siêu sao 👑" }
                          : null;
                if (!nextLevel) return "Hạng cao nhất rồi! 🎉";
                const need = nextLevel.target - child.totalPoints;
                return `Cần ${need} điểm nữa → ${nextLevel.label}`;
              })()}
            </span>
            <span
              className="text-lg animate-bounce-fun"
              style={{ animationDuration: "2s" }}
            >
              {child.totalPoints >= 100 ? "🎉" : "🚀"}
            </span>
          </div>
        </div>

        {/* Activities */}
        <div className="bg-linear-to-br from-gray-50 to-slate-100 rounded-2xl p-4 border border-gray-200 shadow-sm">
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
                  className={`flex items-center justify-between py-2.5 px-3.5 rounded-xl transition-all duration-200 hover:scale-[1.02] border ${
                    activity.points >= 0
                      ? "bg-emerald-50 hover:bg-emerald-100 border-emerald-300"
                      : "bg-rose-50 hover:bg-rose-100 border-rose-300"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl w-9 h-9 flex items-center justify-center rounded-xl bg-white shadow-sm hover:animate-wiggle">
                      {activity.categoryIcon}
                    </span>
                    <div>
                      <p className="text-sm font-bold text-gray-700">
                        {activity.categoryName}
                      </p>
                      <p className="text-[11px] text-gray-400 font-medium">
                        {activity.levelLabel}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-extrabold shadow-sm ${
                      activity.points >= 0
                        ? "bg-emerald-400 text-white"
                        : "bg-rose-400 text-white"
                    }`}
                  >
                    {activity.points > 0 ? "+" : ""}
                    {activity.points}
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
