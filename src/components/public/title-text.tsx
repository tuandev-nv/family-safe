"use client";

import { useEffect, useState } from "react";

export const TITLE_GRADIENTS = [
  "linear-gradient(90deg, #ff0055, #ff00aa, #aa00ff, #ff0055)",
  "linear-gradient(90deg, #7b2ff7, #ff2d95, #ff0066, #7b2ff7)",
  "linear-gradient(90deg, #0066ff, #7b2ff7, #cc00ff, #0066ff)",
  "linear-gradient(90deg, #ff0066, #ff3300, #ff0066)",
  "linear-gradient(90deg, #6600ff, #ff0099, #6600ff)",
  "linear-gradient(90deg, #0055ff, #8b00ff, #ff0099, #0055ff)",
  "linear-gradient(90deg, #ff0088, #7700ff, #0044ff, #ff0088)",
  "linear-gradient(90deg, #cc00ff, #ff0055, #cc00ff)",
  "linear-gradient(90deg, #3300ff, #aa00ff, #ff0077, #3300ff)",
  "linear-gradient(90deg, #ff0044, #cc00cc, #5500ff, #ff0044)",
];

export function TitleText() {
  const text = "Gia đình Gấu Bơ";
  const [gradientIdx, setGradientIdx] = useState(0);
  const [revealed, setRevealed] = useState(0);

  // Typewriter on mount
  useEffect(() => {
    if (revealed >= text.length) return;
    const t = setTimeout(() => setRevealed((p) => p + 1), 120);
    return () => clearTimeout(t);
  }, [revealed, text.length]);

  // Cycle gradient colors
  useEffect(() => {
    const interval = setInterval(() => {
      setGradientIdx((prev) => {
        let next: number;
        do {
          next = Math.floor(Math.random() * TITLE_GRADIENTS.length);
        } while (next === prev);
        return next;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <span className="relative">
      {text.split("").map((char, i) => (
        <span
          key={i}
          className={`inline-block bg-size-[800%_100%] bg-clip-text text-transparent animate-title-shimmer transition-all duration-300 ${i < revealed ? "opacity-100 scale-100" : "opacity-0 scale-50"}`}
          style={{
            backgroundImage: TITLE_GRADIENTS[gradientIdx],
            backgroundPosition: `${(i / text.length) * 100}% 50%`,
            textShadow: i < revealed ? "0 2px 4px rgba(0,0,0,0.15)" : "none",
            WebkitTextFillColor: "transparent",
            filter:
              i < revealed ? "drop-shadow(0 1px 2px rgba(0,0,0,0.2))" : "none",
          }}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </span>
  );
}
