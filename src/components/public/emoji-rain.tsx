"use client";

import { useMemo } from "react";

export function EmojiRain() {
  const drops = useMemo(
    () =>
      Array.from({ length: 35 }).map((_, i) => ({
        id: i,
        emoji: ["💖", "🌈", "✨", "⭐", "🦋", "🌸", "🎀", "💫", "🍭", "🧸"][
          i % 10
        ],
        left: `${2 + ((i * 2.8) % 96)}%`,
        delay: `${(i * 0.4) % 7}s`,
        duration: `${3.5 + (i % 5) * 1}s`,
        size: `${0.9 + (i % 4) * 0.3}rem`,
        wobble: i % 2 === 0 ? "animate-rain-left" : "animate-rain-right",
      })),
    [],
  );

  return (
    <div className="fixed inset-0 pointer-events-none z-20 overflow-hidden">
      {drops.map((d) => (
        <div
          key={d.id}
          className={`absolute ${d.wobble}`}
          style={{
            left: d.left,
            top: "-5%",
            animationDelay: d.delay,
            animationDuration: d.duration,
            fontSize: d.size,
            opacity: 0.5,
          }}
        >
          {d.emoji}
        </div>
      ))}
    </div>
  );
}
