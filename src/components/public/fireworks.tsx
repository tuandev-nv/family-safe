"use client";

import { useEffect, useRef, useState } from "react";

export interface FwParticle {
  emoji: string;
  tx: number;
  ty: number;
  delay: number;
  size: number;
  glow: string;
}

export interface FwBurst {
  id: number;
  x: number;
  y: number;
  particles: FwParticle[];
}

export function makeHeart(scale: number): Array<[number, number]> {
  const pts: Array<[number, number]> = [];
  for (let i = 0; i < 30; i++) {
    const t = (i / 30) * Math.PI * 2;
    const hx = 16 * Math.pow(Math.sin(t), 3);
    const hy = -(
      13 * Math.cos(t) -
      5 * Math.cos(2 * t) -
      2 * Math.cos(3 * t) -
      Math.cos(4 * t)
    );
    pts.push([hx * scale, hy * scale]);
  }
  return pts;
}

export function makeStar5(r1: number, r2: number): Array<[number, number]> {
  const pts: Array<[number, number]> = [];
  for (let i = 0; i < 10; i++) {
    const a = (i * 36 - 90) * (Math.PI / 180);
    const r = i % 2 === 0 ? r1 : r2;
    pts.push([Math.cos(a) * r, Math.sin(a) * r]);
  }
  // fill between points
  const filled: Array<[number, number]> = [];
  for (let i = 0; i < pts.length; i++) {
    filled.push(pts[i]);
    const next = pts[(i + 1) % pts.length];
    filled.push([(pts[i][0] + next[0]) / 2, (pts[i][1] + next[1]) / 2]);
  }
  return filled;
}

export function makeBurst(
  count: number,
  minR: number,
  maxR: number,
): Array<[number, number]> {
  const pts: Array<[number, number]> = [];
  for (let i = 0; i < count; i++) {
    const a = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.3;
    const r = minR + Math.random() * (maxR - minR);
    pts.push([Math.cos(a) * r, Math.sin(a) * r]);
  }
  return pts;
}

export function makeCrackle(count: number, maxR: number): Array<[number, number]> {
  const pts: Array<[number, number]> = [];
  for (let i = 0; i < count; i++) {
    const a = Math.random() * Math.PI * 2;
    const r = 40 + Math.random() * maxR;
    pts.push([Math.cos(a) * r, Math.sin(a) * r]);
  }
  return pts;
}

export function makeCircle(count: number, radius: number): Array<[number, number]> {
  const pts: Array<[number, number]> = [];
  for (let i = 0; i < count; i++) {
    const a = (i / count) * Math.PI * 2;
    pts.push([Math.cos(a) * radius, Math.sin(a) * radius]);
  }
  return pts;
}

export function makeShootingStar(length: number): Array<[number, number]> {
  const pts: Array<[number, number]> = [];
  const angle = -30 + Math.random() * -30; // flying upward-right
  const rad = (angle * Math.PI) / 180;
  // main trail
  for (let i = 0; i < 12; i++) {
    const dist = (i / 12) * length;
    pts.push([Math.cos(rad) * dist, Math.sin(rad) * dist]);
  }
  // tail sparkles spread
  for (let i = 0; i < 10; i++) {
    const dist = length * 0.3 + Math.random() * length * 0.3;
    const spread = (Math.random() - 0.5) * 80;
    pts.push([
      Math.cos(rad) * dist + Math.sin(rad) * spread,
      Math.sin(rad) * dist - Math.cos(rad) * spread,
    ]);
  }
  return pts;
}

export function makeExplosion(count: number, maxR: number): Array<[number, number]> {
  const pts: Array<[number, number]> = [];
  // inner ring
  for (let i = 0; i < Math.floor(count * 0.4); i++) {
    const a = (i / Math.floor(count * 0.4)) * Math.PI * 2;
    const r = maxR * 0.3 + Math.random() * maxR * 0.2;
    pts.push([Math.cos(a) * r, Math.sin(a) * r]);
  }
  // outer ring
  for (let i = 0; i < Math.floor(count * 0.35); i++) {
    const a = (i / Math.floor(count * 0.35)) * Math.PI * 2 + 0.2;
    const r = maxR * 0.7 + Math.random() * maxR * 0.3;
    pts.push([Math.cos(a) * r, Math.sin(a) * r]);
  }
  // scattered sparks
  for (let i = 0; i < Math.floor(count * 0.25); i++) {
    const a = Math.random() * Math.PI * 2;
    const r = Math.random() * maxR;
    pts.push([Math.cos(a) * r, Math.sin(a) * r]);
  }
  return pts;
}

export function Fireworks() {
  const [bursts, setBursts] = useState<FwBurst[]>([]);
  const nextId = useRef(0);

  useEffect(() => {
    const emojiSets = [
      ["❤️", "💖", "💗", "💕", "💓"],
      ["⭐", "🌟", "✨", "💫", "🔆"],
      ["🦋", "🦋", "💜", "💙", "✨"],
      ["🌸", "🌺", "🌷", "🌹", "🌼"],
      ["✨", "💥", "🌟", "⭐", "💫"],
      ["🌈", "🦄", "💎", "💜", "✨"],
    ];
    const glows = [
      "drop-shadow(0 0 6px #ff6b9d)",
      "drop-shadow(0 0 6px #ffd700)",
      "drop-shadow(0 0 6px #64c8ff)",
      "drop-shadow(0 0 6px #c864ff)",
      "drop-shadow(0 0 6px #64ffaa)",
    ];
    const shapes = [
      "heart",
      "star",
      "burst",
      "crackle",
      "circle",
      "shooting",
      "explosion",
    ] as const;

    const spawnFirework = () => {
      const count = 1 + Math.floor(Math.random() * 3); // 1-3 quả cùng lúc
      for (let n = 0; n < count; n++) spawnOne();
    };

    const spawnOne = () => {
      const x = 10 + Math.random() * 80;
      const y = 10 + Math.random() * 55;
      const shape = shapes[Math.floor(Math.random() * shapes.length)];
      const set = emojiSets[Math.floor(Math.random() * emojiSets.length)];
      const glow = glows[Math.floor(Math.random() * glows.length)];

      let coords: Array<[number, number]>;
      switch (shape) {
        case "heart":
          coords = makeHeart(12 + Math.random() * 5);
          break;
        case "star":
          coords = makeStar5(180 + Math.random() * 60, 80 + Math.random() * 30);
          break;
        case "burst":
          coords = makeBurst(20 + Math.floor(Math.random() * 8), 120, 280);
          break;
        case "crackle":
          coords = makeCrackle(35, 220);
          break;
        case "circle":
          coords = makeCircle(
            24 + Math.floor(Math.random() * 8),
            160 + Math.random() * 100,
          );
          break;
        case "shooting":
          coords = makeShootingStar(250 + Math.random() * 150);
          break;
        case "explosion":
          coords = makeExplosion(
            30 + Math.floor(Math.random() * 10),
            250 + Math.random() * 80,
          );
          break;
      }

      const particles: FwParticle[] = coords.map(([tx, ty], idx) => ({
        emoji: set[Math.floor(Math.random() * set.length)],
        tx,
        ty,
        delay:
          shape === "crackle"
            ? Math.random() * 0.8
            : shape === "shooting"
              ? idx * 0.05
              : shape === "explosion"
                ? Math.random() * 0.3
                : Math.random() * 0.15,
        size:
          shape === "crackle"
            ? 0.7 + Math.random() * 0.6
            : 1 + Math.random() * 1,
        glow,
      }));

      const id = nextId.current++;
      setBursts((prev) => [...prev, { id, x, y, particles }]);
      setTimeout(() => {
        setBursts((prev) => prev.filter((b) => b.id !== id));
      }, 2800);
    };

    const scheduleNext = () => {
      const delay = 2000 + Math.random() * 3000;
      return setTimeout(() => {
        spawnFirework();
        timerId = scheduleNext();
      }, delay);
    };

    let timerId = scheduleNext();
    return () => clearTimeout(timerId);
  }, []);

  if (bursts.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-20 overflow-hidden">
      {bursts.map((burst) => (
        <div
          key={burst.id}
          className="absolute"
          style={{ left: `${burst.x}%`, top: `${burst.y}%` }}
        >
          {burst.particles.map((p, i) => (
            <div
              key={i}
              className="absolute animate-firework-particle will-change-transform"
              style={{
                ["--fw-tx" as string]: `${p.tx}px`,
                ["--fw-ty" as string]: `${p.ty}px`,
                animationDelay: `${p.delay}s`,
                fontSize: `${p.size}rem`,
                filter: p.glow,
              }}
            >
              {p.emoji}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
