"use client";

import { useEffect, useRef, useState } from "react";
import { StickFigure } from "./stickman";
import { getLevelInfo } from "./child-card";
import type { ChildPublic } from "./types";

/* ---- Rank with ties ---- */
export function getRanks(sorted: ChildPublic[]): number[] {
  const ranks: number[] = [];
  for (let i = 0; i < sorted.length; i++) {
    if (i === 0 || sorted[i].totalPoints < sorted[i - 1].totalPoints) {
      ranks.push(i + 1);
    } else {
      ranks.push(ranks[i - 1]);
    }
  }
  return ranks;
}

/* ---- Podium ---- */
export function Podium({ sorted, ranks }: { sorted: ChildPublic[]; ranks: number[] }) {
  const [danceIdx, setDanceIdx] = useState(0);
  const [headIdx, setHeadIdx] = useState(0);
  const danceOrder = useRef<number[]>([]);
  const headOrder = useRef<number[]>([]);
  const dancePos = useRef(0);
  const headPos = useRef(0);

  useEffect(() => {
    const DANCE_COUNT = 15;
    const HEAD_COUNT = 5;

    function shuffle(n: number): number[] {
      const arr = Array.from({ length: n }, (_, i) => i);
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr;
    }

    if (danceOrder.current.length === 0) danceOrder.current = shuffle(DANCE_COUNT);
    if (headOrder.current.length === 0) headOrder.current = shuffle(HEAD_COUNT);

    const danceTimer = setInterval(() => {
      dancePos.current++;
      if (dancePos.current >= DANCE_COUNT) {
        dancePos.current = 0;
        danceOrder.current = shuffle(DANCE_COUNT);
      }
      setDanceIdx(danceOrder.current[dancePos.current]);
    }, 8000);

    const headTimer = setInterval(() => {
      headPos.current++;
      if (headPos.current >= HEAD_COUNT) {
        headPos.current = 0;
        headOrder.current = shuffle(HEAD_COUNT);
      }
      setHeadIdx(headOrder.current[headPos.current]);
    }, 4000);

    return () => { clearInterval(danceTimer); clearInterval(headTimer); };
  }, []);

  if (sorted.length < 2) return null;

  const goldConfig = {
    pillarH: 200,
    pillarW: "w-40 md:w-52",
    bg: "bg-gradient-to-t from-amber-600 via-yellow-400 to-amber-300",
    ring: "ring-3 ring-yellow-400/60 shadow-2xl shadow-amber-400/50",
    avatarBg: "bg-linear-to-br from-yellow-100 to-amber-100",
    medal: "🥇",
    sparkle: true,
  };
  const silverConfig = {
    pillarH: 150,
    pillarW: "w-36 md:w-44",
    bg: "bg-gradient-to-t from-slate-500 via-gray-300 to-slate-200",
    ring: "ring-4 ring-gray-300/50 shadow-xl shadow-gray-400/30",
    avatarBg: "bg-linear-to-br from-gray-100 to-slate-100",
    medal: "🥈",
    sparkle: false,
  };
  const bronzeConfig = {
    pillarH: 120,
    pillarW: "w-36 md:w-44",
    bg: "bg-gradient-to-t from-orange-600 via-amber-400 to-orange-300",
    ring: "ring-4 ring-orange-300/50 shadow-xl shadow-orange-400/30",
    avatarBg: "bg-linear-to-br from-orange-50 to-amber-50",
    medal: "🥉",
    sparkle: false,
  };

  function getConfigForRank(rank: number) {
    if (rank === 1) return goldConfig;
    if (rank === 2) return silverConfig;
    return bronzeConfig;
  }

  const top3 = sorted.slice(0, 3);
  const topRanks = ranks.slice(0, 3);
  const display =
    top3.length === 3
      ? [
          { child: top3[1], rank: topRanks[1] },
          { child: top3[0], rank: topRanks[0] },
          { child: top3[2], rank: topRanks[2] },
        ]
      : [
          { child: top3[1], rank: topRanks[1] },
          { child: top3[0], rank: topRanks[0] },
        ];

  return (
    <div className="mb-16 px-4">
      <div className="flex justify-center items-end gap-2 md:gap-3">
        {display.map(({ child, rank }) => {
          const config = getConfigForRank(rank);
          const level = getLevelInfo(child.totalPoints);
          const isGold = rank === 1;

          return (
            <div
              key={child.id}
              className={`text-center group animate-podium-rise relative`}
              style={{ animationDelay: `${rank * 0.2}s` }}
            >
              {/* Heavenly glow aura */}
              {isGold && (
                <>
                  {/* Soft white-gold outer glow */}
                  <div
                    className="absolute pointer-events-none -z-10 animate-heavenly-glow"
                    style={{
                      inset: "-30px -40px -20px -40px",
                      background: "radial-gradient(ellipse at 50% 40%, rgba(255,255,255,0.6) 0%, rgba(255,248,220,0.3) 30%, rgba(255,223,150,0.15) 55%, transparent 75%)",
                      borderRadius: "50%",
                    }}
                  />
                  {/* Inner shimmer rays */}
                  <div
                    className="absolute pointer-events-none -z-10 animate-heavenly-rays"
                    style={{
                      inset: "-20px -30px -10px -30px",
                      background: "conic-gradient(from 0deg, transparent 0%, rgba(255,255,255,0.4) 5%, transparent 10%, transparent 15%, rgba(255,248,200,0.3) 20%, transparent 25%, transparent 30%, rgba(255,255,255,0.35) 35%, transparent 40%, transparent 50%, rgba(255,248,200,0.25) 55%, transparent 60%, transparent 70%, rgba(255,255,255,0.3) 75%, transparent 80%, transparent 90%, rgba(255,248,200,0.2) 95%, transparent 100%)",
                      borderRadius: "50%",
                      filter: "blur(8px)",
                    }}
                  />
                  {/* Floating light particles */}
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute pointer-events-none -z-10 w-2 h-2 rounded-full animate-light-particle"
                      style={{
                        background: "radial-gradient(circle, rgba(255,255,255,0.9), rgba(255,223,150,0.4))",
                        boxShadow: "0 0 6px 2px rgba(255,255,255,0.5)",
                        left: `${20 + i * 12}%`,
                        top: `${10 + (i % 3) * 25}%`,
                        animationDelay: `${i * 0.5}s`,
                        animationDuration: `${3 + (i % 3)}s`,
                      }}
                    />
                  ))}
                </>
              )}
              {/* Stick figure with avatar head */}
              <StickFigure
                child={child}
                isGold={isGold}
                avatarBg={config.avatarBg}
                ring={config.ring}
                sparkle={config.sparkle}
                danceIndex={(danceIdx + top3.indexOf(child)) % 15}
                headIndex={(headIdx + top3.indexOf(child)) % 5}
                className="mb-1"
              />

              {/* Name + score */}
              <p
                className={`font-black text-gray-800 ${isGold ? "text-2xl" : "text-lg"}`}
              >
                {child.name}
              </p>
              <span
                className={`inline-flex items-center gap-1.5 ${isGold ? "text-lg" : "text-base"} font-extrabold px-5 py-2 rounded-full bg-linear-to-r ${level.gradient} text-white mt-2 mb-3 shadow-lg`}
              >
                {level.icon} {child.totalPoints} điểm
              </span>

              {/* Pillar */}
              <div
                className={`${config.pillarW} ${config.bg} rounded-t-2xl flex flex-col items-center justify-center relative overflow-hidden mx-auto shadow-xl`}
                style={{ height: config.pillarH }}
              >
                <div className="absolute inset-y-0 left-0 w-1/4 bg-linear-to-r from-white/20 to-transparent" />
                <div className="absolute top-0 left-0 right-0 h-1 bg-white/30" />
                <div className="relative z-10 flex flex-col items-center">
                  <span className={`${isGold ? "text-7xl" : "text-6xl"} drop-shadow-xl mb-2`}>
                    {config.medal}
                  </span>
                  <span className={`text-white font-black ${isGold ? "text-4xl" : "text-2xl"} drop-shadow-lg`}>
                    #{rank}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {/* Soft ground shadow */}
      <div className="max-w-lg mx-auto h-5" style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(0,0,0,0.12) 0%, transparent 70%)" }} />
    </div>
  );
}
