"use client";

import { ChildAvatar } from "@/components/ui/child-avatar";
import type { ChildPublic } from "./types";

export function MotivationBanner({
  sorted,
  ranks,
}: {
  sorted: ChildPublic[];
  ranks: number[];
}) {
  if (sorted.length === 0) return null;
  const totalActivities = sorted.reduce(
    (s, c) => s + c.recentActivities.length,
    0,
  );

  // Find all leaders (rank 1)
  const leaders = sorted.filter((_, i) => ranks[i] === 1);
  const isTied = leaders.length > 1;
  const leaderNames = leaders.map((l) => l.name).join(" & ");
  const leaderEmojis = leaders.map((l) => l.emoji).join(" ");

  return (
    <div className="relative overflow-hidden rounded-4xl p-6 md:p-8 mb-10 bg-linear-to-r from-violet-600 via-purple-600 to-fuchsia-600 text-white shadow-2xl shadow-purple-500/30 hover:shadow-purple-500/50 transition-shadow duration-300 animate-card-entrance">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-4 right-8 text-8xl animate-wiggle">🏆</div>
        <div
          className="absolute bottom-2 left-6 text-6xl animate-dance"
          style={{ animationDelay: "1s" }}
        >
          ⭐
        </div>
        <div
          className="absolute top-1/2 left-1/3 text-5xl animate-dance-reverse"
          style={{ animationDelay: "2s" }}
        >
          🎯
        </div>
      </div>
      <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-black mb-1 flex items-center gap-3 flex-wrap">
            {leaders.map((l) => (
              <span key={l.id} className="inline-block animate-wiggle">
                <ChildAvatar emoji={l.emoji} avatarUrl={l.avatarUrl} size="lg" className="ring-2 ring-white/40" />
              </span>
            ))}
            <span>
              {isTied
                ? `${leaderNames} đang cùng dẫn đầu!`
                : `${leaders[0].name} đang dẫn đầu!`
              }
            </span>
          </h2>
          <p className="text-purple-200 text-base">
            {isTied
              ? `Cùng ${leaders[0].totalPoints} điểm sau ${totalActivities} hoạt động. Ai sẽ bứt phá?`
              : `Với ${leaders[0].totalPoints} điểm sau ${totalActivities} hoạt động. Ai sẽ vượt lên?`}
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
