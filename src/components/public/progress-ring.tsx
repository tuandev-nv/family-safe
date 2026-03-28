"use client";

import { useEffect, useId, useState } from "react";

export function ProgressRing({ points, max = 80 }: { points: number; max?: number }) {
  const [animated, setAnimated] = useState(false);
  const percentage = Math.min(Math.max((points / max) * 100, 0), 100);
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;
  const rawId = useId();
  const gradientId = rawId.replace(/:/g, "_");

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
        <circle
          cx="65"
          cy="65"
          r={radius}
          fill="none"
          stroke="#F3F4F6"
          strokeWidth="9"
        />
        <circle
          cx="65"
          cy="65"
          r={radius}
          fill="none"
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
        <span
          className={`text-3xl font-black ${points >= 0 ? "text-gray-800" : "text-rose-500"}`}
        >
          {points}
        </span>
        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
          điểm
        </span>
      </div>
    </div>
  );
}
