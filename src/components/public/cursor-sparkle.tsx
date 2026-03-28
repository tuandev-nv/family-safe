"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export function CursorSparkle() {
  const [sparkles, setSparkles] = useState<
    Array<{ id: number; x: number; y: number; emoji: string }>
  >([]);
  const nextId = useRef(0);
  const lastMoveTime = useRef(0);

  const emojis = useMemo(
    () => ["✨", "⭐", "💖", "🌟", "🎉", "🦄", "🌈", "🎀", "💫", "🍬"],
    [],
  );

  const spawnSparkles = useCallback(
    (x: number, y: number, count: number) => {
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
    },
    [emojis],
  );

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
