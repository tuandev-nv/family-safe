"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { ChildPublic } from "@/components/public/types";
import { BgMusic } from "@/components/public/bg-music";
import { AnimatedBg } from "@/components/public/animated-bg";
import { EmojiRain } from "@/components/public/emoji-rain";
import { Fireworks } from "@/components/public/fireworks";
import { CursorSparkle } from "@/components/public/cursor-sparkle";
import { FunLoading } from "@/components/public/fun-loading";
import { ChildCard } from "@/components/public/child-card";
import { Podium, getRanks } from "@/components/public/podium";
import { MotivationBanner } from "@/components/public/motivation-banner";
import { TitleText } from "@/components/public/title-text";
import { PageStyles } from "@/components/public/page-styles";

/* ─── Main page ─── */
export default function PublicPage() {
  const [children, setChildren] = useState<ChildPublic[]>([]);
  const [monthLabel, setMonthLabel] = useState("");
  const [loading, setLoading] = useState(true);
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
        },
      )
      .catch(() => setChildren([]))
      .finally(() => setLoading(false));
  }, []);

  const sorted = [...children].sort((a, b) => b.totalPoints - a.totalPoints);
  const ranks = getRanks(sorted);

  return (
    <div className="min-h-screen bg-linear-to-br from-violet-300 via-fuchsia-200 via-40% to-amber-200 relative select-none">
      <BgMusic />
      <AnimatedBg />
      <EmojiRain />
      <Fireworks />
      <CursorSparkle />

      {/* Header */}
      <header className="relative z-10 text-center pt-14 pb-10 px-4">
        <div className="inline-block relative mb-6 animate-header-entrance">
          <div className="inline-flex items-center justify-center w-28 h-28 rounded-[2.5rem] bg-white/90 backdrop-blur shadow-2xl shadow-purple-500/10 border border-white/60 hover:rotate-12 transition-transform duration-300 cursor-pointer">
            <span className="text-6xl animate-wiggle">🏠</span>
          </div>
          <div
            className="absolute -top-3 -right-3 text-3xl animate-dance"
            style={{ animationDelay: "0s" }}
          >
            ✨
          </div>
          <div
            className="absolute -bottom-2 -left-3 text-2xl animate-dance-reverse"
            style={{ animationDelay: "0.5s" }}
          >
            🌟
          </div>
          <div
            className="absolute top-1/2 -right-6 text-xl animate-dance"
            style={{ animationDelay: "1s" }}
          >
            💖
          </div>
        </div>

        <h1 className="text-5xl md:text-8xl font-black pb-4 leading-tight animate-rainbow-title relative">
          <TitleText />
          {/* Sparkle decorations around title */}
          <span className="absolute -top-4 -left-2 text-2xl animate-sparkle-pop">
            ✨
          </span>
          <span
            className="absolute -top-3 right-0 text-xl animate-sparkle-pop"
            style={{ animationDelay: "0.8s" }}
          >
            💫
          </span>
          <span
            className="absolute -bottom-2 left-1/4 text-lg animate-sparkle-pop"
            style={{ animationDelay: "1.5s" }}
          >
            ⭐
          </span>
          <span
            className="absolute -bottom-3 right-1/4 text-2xl animate-sparkle-pop"
            style={{ animationDelay: "0.4s" }}
          >
            ✨
          </span>
        </h1>
        {monthLabel && (
          <p
            className="mt-3 inline-flex items-center gap-2 px-5 py-2 bg-white/70 backdrop-blur rounded-full shadow text-base font-bold text-purple-600 border border-purple-100/50 animate-bounce-fun"
            style={{ animationDuration: "3s" }}
          >
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
            <Podium sorted={sorted} ranks={ranks} />
            <MotivationBanner sorted={sorted} ranks={ranks} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {sorted.map((child, i) => (
                <ChildCard key={child.id} child={child} rank={ranks[i]} />
              ))}
            </div>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center pb-12">
        <Link
          href="/login"
          className="text-xs text-gray-300 hover:text-purple-500 transition-colors"
        >
          Quản trị viên
        </Link>
      </footer>

      <PageStyles />
    </div>
  );
}
