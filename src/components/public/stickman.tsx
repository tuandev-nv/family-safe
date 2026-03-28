"use client";

import { useEffect, useId } from "react";
import { ChildAvatar } from "@/components/ui/child-avatar";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface StickChild {
  id: string;
  name: string;
  emoji: string;
  avatarUrl?: string | null;
}

interface StickFigureProps {
  child: StickChild;
  isGold: boolean;
  avatarBg: string;
  ring: string;
  sparkle: boolean;
  danceIndex: number;
  headIndex: number;
  className?: string;
}

// ---------------------------------------------------------------------------
// Seeded PRNG (mulberry32) – deterministic per seed
// ---------------------------------------------------------------------------

function mulberry32(seed: number): () => number {
  let s = seed | 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ---------------------------------------------------------------------------
// Keyframe helpers
// ---------------------------------------------------------------------------

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/** Generate n values using the rng, clamped & rounded. */
function genValues(
  rng: () => number,
  count: number,
  min: number,
  max: number,
): number[] {
  const vals: number[] = [];
  for (let i = 0; i < count; i++) {
    vals.push(Math.round(lerp(min, max, rng()) * 10) / 10);
  }
  // Ensure loop: last value equals first
  vals[vals.length - 1] = vals[0];
  return vals;
}

// ---------------------------------------------------------------------------
// Dance personality presets – each one biases the RNG ranges differently
// ---------------------------------------------------------------------------

interface DancePreset {
  label: string;
  bodyY: [number, number]; // translateY range (px)
  bodyX: [number, number]; // translateX range (px)
  bodyRot: [number, number]; // rotate range (deg)
  armL: [number, number]; // left arm rotation range (deg)
  armR: [number, number]; // right arm rotation range (deg)
  legL: [number, number]; // left leg rotation range (deg)
  legR: [number, number]; // right leg rotation range (deg)
  duration: number; // seconds
}

const PRESETS: readonly DancePreset[] = [
  // 0 – energetic bounce
  { label: "bounce", bodyY: [-18, 4], bodyX: [-2, 2], bodyRot: [-6, 6], armL: [-140, 30], armR: [-140, 30], legL: [-30, 30], legR: [-30, 30], duration: 2.0 },
  // 1 – groovy sway
  { label: "sway", bodyY: [-6, 2], bodyX: [-12, 12], bodyRot: [-10, 10], armL: [-60, 60], armR: [-60, 60], legL: [-15, 15], legR: [-15, 15], duration: 3.0 },
  // 2 – robot stiff
  { label: "robot", bodyY: [-4, 0], bodyX: [-3, 3], bodyRot: [-2, 2], armL: [-90, 90], armR: [-90, 90], legL: [-20, 20], legR: [-20, 20], duration: 2.4 },
  // 3 – silly wiggly
  { label: "silly", bodyY: [-14, 6], bodyX: [-8, 8], bodyRot: [-15, 15], armL: [-160, 40], armR: [-160, 40], legL: [-35, 35], legR: [-35, 35], duration: 2.2 },
  // 4 – cocky taunt
  { label: "taunt", bodyY: [-3, 1], bodyX: [-6, 14], bodyRot: [-8, 18], armL: [-40, 80], armR: [-40, 80], legL: [-10, 25], legR: [-10, 25], duration: 3.2 },
  // 5 – hip-hop pop
  { label: "hiphop", bodyY: [-20, 2], bodyX: [-4, 4], bodyRot: [-4, 4], armL: [-120, 50], armR: [-120, 50], legL: [-25, 25], legR: [-25, 25], duration: 2.1 },
  // 6 – slow wave
  { label: "wave", bodyY: [-4, 2], bodyX: [-10, 10], bodyRot: [-6, 6], armL: [-80, 80], armR: [-80, 80], legL: [-12, 12], legR: [-12, 12], duration: 3.5 },
  // 7 – jumping jack
  { label: "jack", bodyY: [-22, 0], bodyX: [-1, 1], bodyRot: [-3, 3], armL: [-170, 10], armR: [-170, 10], legL: [-40, 40], legR: [-40, 40], duration: 2.0 },
  // 8 – twist
  { label: "twist", bodyY: [-8, 2], bodyX: [-5, 5], bodyRot: [-20, 20], armL: [-70, 70], armR: [-70, 70], legL: [-20, 20], legR: [-20, 20], duration: 2.6 },
  // 9 – disco
  { label: "disco", bodyY: [-10, 4], bodyX: [-6, 6], bodyRot: [-8, 8], armL: [-150, 60], armR: [-150, 60], legL: [-20, 20], legR: [-20, 20], duration: 2.3 },
  // 10 – moonwalk
  { label: "moonwalk", bodyY: [-2, 0], bodyX: [-16, 16], bodyRot: [-4, 4], armL: [-30, 30], armR: [-30, 30], legL: [-30, 30], legR: [-30, 30], duration: 3.4 },
  // 11 – headbang
  { label: "headbang", bodyY: [-16, 6], bodyX: [-2, 2], bodyRot: [-12, 12], armL: [-50, 20], armR: [-50, 20], legL: [-15, 15], legR: [-15, 15], duration: 2.0 },
  // 12 – macarena
  { label: "macarena", bodyY: [-6, 2], bodyX: [-4, 4], bodyRot: [-5, 5], armL: [-130, 70], armR: [-130, 70], legL: [-18, 18], legR: [-18, 18], duration: 2.8 },
  // 13 – breakdance
  { label: "breakdance", bodyY: [-20, 8], bodyX: [-10, 10], bodyRot: [-25, 25], armL: [-170, 50], armR: [-170, 50], legL: [-45, 45], legR: [-45, 45], duration: 2.2 },
  // 14 – chill groove
  { label: "chill", bodyY: [-3, 1], bodyX: [-4, 4], bodyRot: [-3, 3], armL: [-30, 30], armR: [-30, 30], legL: [-10, 10], legR: [-10, 10], duration: 3.5 },
];

// ---------------------------------------------------------------------------
// Head animation presets
// ---------------------------------------------------------------------------

interface HeadPreset {
  label: string;
  keyframes: string; // raw CSS transform keyframes content
  duration: number;
}

function buildHeadPresets(prefix: string): readonly HeadPreset[] {
  return [
    // 0 – wobble with horizontal turns
    {
      label: "wobble",
      duration: 3.0,
      keyframes: `@keyframes ${prefix}head-0 {
  0%, 100% { transform: rotate(0deg) rotateY(0deg); }
  12% { transform: rotate(-12deg) rotateY(20deg); }
  25% { transform: rotate(10deg) rotateY(-15deg); }
  37% { transform: rotate(-8deg) rotateY(0deg); }
  50% { transform: rotate(6deg) rotateY(-25deg); }
  62% { transform: rotate(-10deg) rotateY(15deg); }
  75% { transform: rotate(8deg) rotateY(0deg); }
  87% { transform: rotate(-4deg) rotateY(-10deg); }
}`,
    },
    // 1 – turn side to side (look left/right) - strong 75deg
    {
      label: "turn",
      duration: 3.5,
      keyframes: `@keyframes ${prefix}head-1 {
  0%, 100% { transform: rotateY(0deg) rotate(0deg); }
  8% { transform: rotateY(50deg) rotate(3deg); }
  16% { transform: rotateY(75deg) rotate(5deg); }
  28% { transform: rotateY(75deg) rotate(3deg); }
  36% { transform: rotateY(0deg) rotate(0deg); }
  44% { transform: rotateY(-50deg) rotate(-3deg); }
  52% { transform: rotateY(-75deg) rotate(-5deg); }
  64% { transform: rotateY(-75deg) rotate(-3deg); }
  72% { transform: rotateY(0deg) rotate(0deg); }
  85% { transform: rotateY(60deg) rotate(4deg); }
  92% { transform: rotateY(30deg) rotate(2deg); }
}`,
    },
    // 2 – nod with occasional turns
    {
      label: "nod",
      duration: 2.5,
      keyframes: `@keyframes ${prefix}head-2 {
  0%, 100% { transform: translateY(0px) rotate(0deg) rotateY(0deg); }
  15% { transform: translateY(5px) rotate(6deg) rotateY(0deg); }
  25% { transform: translateY(-3px) rotate(-3deg) rotateY(25deg); }
  40% { transform: translateY(4px) rotate(0deg) rotateY(0deg); }
  55% { transform: translateY(-4px) rotate(-5deg) rotateY(-30deg); }
  65% { transform: translateY(3px) rotate(4deg) rotateY(-15deg); }
  80% { transform: translateY(-2px) rotate(0deg) rotateY(20deg); }
  90% { transform: translateY(2px) rotate(-2deg) rotateY(0deg); }
}`,
    },
    // 3 – sassy look-around
    {
      label: "sassy",
      duration: 3.0,
      keyframes: `@keyframes ${prefix}head-3 {
  0%, 100% { transform: translateX(0px) rotate(0deg) rotateY(0deg); }
  12% { transform: translateX(6px) rotate(8deg) rotateY(35deg); }
  25% { transform: translateX(-4px) rotate(-5deg) rotateY(35deg); }
  35% { transform: translateX(0px) rotate(0deg) rotateY(0deg); }
  50% { transform: translateX(-6px) rotate(-8deg) rotateY(-40deg); }
  62% { transform: translateX(4px) rotate(5deg) rotateY(-40deg); }
  72% { transform: translateX(0px) rotate(0deg) rotateY(0deg); }
  82% { transform: translateX(3px) rotate(10deg) rotateY(20deg); }
  92% { transform: translateX(-2px) rotate(-3deg) rotateY(0deg); }
}`,
    },
    // 4 – crazy spinning
    {
      label: "crazy",
      duration: 2.2,
      keyframes: `@keyframes ${prefix}head-4 {
  0%, 100% { transform: translate(0px, 0px) rotate(0deg) rotateY(0deg); }
  10% { transform: translate(4px, -3px) rotate(10deg) rotateY(30deg); }
  20% { transform: translate(-5px, 2px) rotate(-12deg) rotateY(-20deg); }
  30% { transform: translate(3px, 4px) rotate(8deg) rotateY(-45deg); }
  40% { transform: translate(-3px, -2px) rotate(-6deg) rotateY(0deg); }
  50% { transform: translate(5px, 2px) rotate(14deg) rotateY(45deg); }
  60% { transform: translate(-4px, -2px) rotate(-10deg) rotateY(0deg); }
  70% { transform: translate(2px, 3px) rotate(4deg) rotateY(-35deg); }
  80% { transform: translate(-3px, -3px) rotate(-8deg) rotateY(25deg); }
  90% { transform: translate(3px, 1px) rotate(6deg) rotateY(0deg); }
}`,
    },
  ];
}

// ---------------------------------------------------------------------------
// CSS generation for all 15 dances
// ---------------------------------------------------------------------------

function generateAllDanceCSS(prefix: string): string {
  const blocks: string[] = [];

  for (let d = 0; d < PRESETS.length; d++) {
    const p = PRESETS[d];
    const rng = mulberry32(d * 7919 + 42);

    // Body: 10 steps
    const bodyYVals = genValues(rng, 10, p.bodyY[0], p.bodyY[1]);
    const bodyXVals = genValues(rng, 10, p.bodyX[0], p.bodyX[1]);
    const bodyRotVals = genValues(rng, 10, p.bodyRot[0], p.bodyRot[1]);

    // Build body keyframes manually (compound transform)
    const bodySteps = bodyYVals.map((_, i) => {
      const pct = Math.round((i / (bodyYVals.length - 1)) * 100);
      return `  ${pct}% { transform: translateY(${bodyYVals[i]}px) translateX(${bodyXVals[i]}px) rotate(${bodyRotVals[i]}deg); }`;
    });
    blocks.push(
      `@keyframes ${prefix}dance-${d}-body {\n${bodySteps.join("\n")}\n}`,
    );

    // Arms: 10 steps each
    const armLVals = genValues(rng, 10, p.armL[0], p.armL[1]);
    const armLSteps = armLVals.map((v, i) => {
      const pct = Math.round((i / (armLVals.length - 1)) * 100);
      return `  ${pct}% { transform: rotate(${v}deg); }`;
    });
    blocks.push(
      `@keyframes ${prefix}dance-${d}-armL {\n${armLSteps.join("\n")}\n}`,
    );

    const armRVals = genValues(rng, 10, p.armR[0], p.armR[1]);
    const armRSteps = armRVals.map((v, i) => {
      const pct = Math.round((i / (armRVals.length - 1)) * 100);
      return `  ${pct}% { transform: rotate(${v}deg); }`;
    });
    blocks.push(
      `@keyframes ${prefix}dance-${d}-armR {\n${armRSteps.join("\n")}\n}`,
    );

    // Legs: 8 steps each
    const legLVals = genValues(rng, 8, p.legL[0], p.legL[1]);
    const legLSteps = legLVals.map((v, i) => {
      const pct = Math.round((i / (legLVals.length - 1)) * 100);
      return `  ${pct}% { transform: rotate(${v}deg); }`;
    });
    blocks.push(
      `@keyframes ${prefix}dance-${d}-legL {\n${legLSteps.join("\n")}\n}`,
    );

    const legRVals = genValues(rng, 8, p.legR[0], p.legR[1]);
    const legRSteps = legRVals.map((v, i) => {
      const pct = Math.round((i / (legRVals.length - 1)) * 100);
      return `  ${pct}% { transform: rotate(${v}deg); }`;
    });
    blocks.push(
      `@keyframes ${prefix}dance-${d}-legR {\n${legRSteps.join("\n")}\n}`,
    );

    // Utility classes for this dance
    const dur = p.duration;
    blocks.push(
      `.${prefix}dance-${d}-body { animation: ${prefix}dance-${d}-body ${dur}s ease-in-out infinite; }`,
    );
    blocks.push(
      `.${prefix}dance-${d}-armL { animation: ${prefix}dance-${d}-armL ${dur}s ease-in-out infinite; transform-origin: top center; }`,
    );
    blocks.push(
      `.${prefix}dance-${d}-armR { animation: ${prefix}dance-${d}-armR ${dur}s ease-in-out infinite; transform-origin: top center; }`,
    );
    blocks.push(
      `.${prefix}dance-${d}-legL { animation: ${prefix}dance-${d}-legL ${dur}s ease-in-out infinite; transform-origin: top center; }`,
    );
    blocks.push(
      `.${prefix}dance-${d}-legR { animation: ${prefix}dance-${d}-legR ${dur}s ease-in-out infinite; transform-origin: top center; }`,
    );
  }

  // Head animations
  const headPresets = buildHeadPresets(prefix);
  for (const hp of headPresets) {
    blocks.push(hp.keyframes);
  }
  for (let h = 0; h < headPresets.length; h++) {
    blocks.push(
      `.${prefix}head-${h} { animation: ${prefix}head-${h} ${headPresets[h].duration}s ease-in-out infinite; }`,
    );
  }

  // Crown bounce
  blocks.push(`@keyframes stk-crown-bounce {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  25% { transform: translateY(-6px) rotate(-8deg); }
  50% { transform: translateY(-2px) rotate(5deg); }
  75% { transform: translateY(-8px) rotate(-4deg); }
}`);

  return blocks.join("\n\n");
}

// ---------------------------------------------------------------------------
// Singleton CSS injection – shared across all StickFigure instances
// ---------------------------------------------------------------------------

const STYLE_ID = "stk-dance-styles";
let refCount = 0;

function injectStyles(): void {
  refCount++;
  if (typeof document === "undefined") return;
  if (document.getElementById(STYLE_ID)) return;

  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = generateAllDanceCSS("stk-");
  document.head.appendChild(style);
}

function removeStyles(): void {
  refCount--;
  if (refCount > 0) return;
  if (typeof document === "undefined") return;

  const el = document.getElementById(STYLE_ID);
  if (el) el.remove();
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function StickFigure({
  child,
  isGold,
  avatarBg,
  ring,
  sparkle,
  danceIndex,
  headIndex,
  className = "",
}: StickFigureProps) {
  const instanceId = useId();

  // Clamp indices
  const dIdx = ((danceIndex % PRESETS.length) + PRESETS.length) % PRESETS.length;
  const hIdx = ((headIndex % 5) + 5) % 5;

  useEffect(() => {
    injectStyles();
    return () => removeStyles();
  }, []);

  const prefix = "stk-";

  // SVG dimensions
  const bodyWidth = isGold ? 120 : 100;
  const bodyHeight = isGold ? 160 : 140;
  const strokeW = isGold ? 4 : 3;
  const cx = bodyWidth / 2;

  // Torso coordinates - neckY starts lower to show neck
  const neckY = 20;
  const hipY = bodyHeight * 0.58;
  const armAttachY = neckY + 14;
  const legLen = bodyHeight - hipY - 8;

  // Head size in px to position it correctly over the neck
  const headSize = isGold ? 128 : 96; // matches 3xl / 2xl

  return (
    <div
      className={`relative inline-flex flex-col items-center ${className}`}
      aria-label={`${child.name} dancing`}
      data-instance={instanceId}
    >
      {/* Everything inside body animation so head moves with torso */}
      <div className={`${prefix}dance-${dIdx}-body relative`}>
        {/* Head positioned at the neck top */}
        <div
          className="flex justify-center"
          style={{ marginBottom: -(headSize * 0.05) }}
        >
          <div className={`${prefix}head-${hIdx} relative flex flex-col items-center`} style={{ perspective: "300px", transformStyle: "preserve-3d" }}>
            {/* Crown */}
            {isGold && (
              <span
                className="text-5xl leading-none select-none"
                style={{
                  marginBottom: -8,
                  filter: "drop-shadow(0 2px 6px rgba(234, 179, 8, 0.7))",
                  animation: "stk-crown-bounce 1.5s ease-in-out infinite",
                }}
                aria-hidden
              >
                👑
              </span>
            )}

            {/* Avatar head - 3D disc effect */}
            <div
              className="relative"
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* Front face */}
              <div
                className={`relative rounded-full ${ring} overflow-hidden`}
                style={{ background: avatarBg, backfaceVisibility: "hidden" }}
              >
                <ChildAvatar
                  emoji={child.emoji}
                  avatarUrl={child.avatarUrl}
                  size={isGold ? "3xl" : "2xl"}
                />
                {sparkle && (
                  <span
                    className="absolute -top-1 -right-1 text-sm animate-pulse select-none"
                    aria-hidden
                  >
                    ✨
                  </span>
                )}
              </div>
              {/* Edge layers for 3D disc thickness */}
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: "linear-gradient(135deg, #d4a574, #a0785a, #8b6544)",
                    transform: `translateZ(${-(i + 1) * 2}px)`,
                    backfaceVisibility: "hidden",
                  }}
                  aria-hidden
                />
              ))}
              {/* Back face */}
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background: "linear-gradient(135deg, #c49a6c, #96704e)",
                  transform: "translateZ(-18px) rotateY(180deg)",
                  backfaceVisibility: "hidden",
                }}
                aria-hidden
              />
            </div>
          </div>
        </div>

        {/* Body SVG */}
        <svg
          width={bodyWidth}
          height={bodyHeight}
          viewBox={`0 0 ${bodyWidth} ${bodyHeight}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="mx-auto"
          aria-hidden
        >
          {/* Torso */}
          <line
            x1={cx}
            y1={neckY}
            x2={cx}
            y2={hipY}
            stroke="currentColor"
            strokeWidth={strokeW}
            strokeLinecap="round"
          />

          {/* Left arm */}
          <g
            className={`${prefix}dance-${dIdx}-armL`}
            style={{ transformOrigin: `${cx}px ${armAttachY}px` }}
          >
            <line
              x1={cx}
              y1={armAttachY}
              x2={cx - 28}
              y2={armAttachY + 36}
              stroke="currentColor"
              strokeWidth={strokeW}
              strokeLinecap="round"
            />
          </g>

          {/* Right arm */}
          <g
            className={`${prefix}dance-${dIdx}-armR`}
            style={{ transformOrigin: `${cx}px ${armAttachY}px` }}
          >
            <line
              x1={cx}
              y1={armAttachY}
              x2={cx + 28}
              y2={armAttachY + 36}
              stroke="currentColor"
              strokeWidth={strokeW}
              strokeLinecap="round"
            />
          </g>

          {/* Left leg */}
          <g
            className={`${prefix}dance-${dIdx}-legL`}
            style={{ transformOrigin: `${cx}px ${hipY}px` }}
          >
            <line
              x1={cx}
              y1={hipY}
              x2={cx - 20}
              y2={hipY + legLen}
              stroke="currentColor"
              strokeWidth={strokeW}
              strokeLinecap="round"
            />
          </g>

          {/* Right leg */}
          <g
            className={`${prefix}dance-${dIdx}-legR`}
            style={{ transformOrigin: `${cx}px ${hipY}px` }}
          >
            <line
              x1={cx}
              y1={hipY}
              x2={cx + 20}
              y2={hipY + legLen}
              stroke="currentColor"
              strokeWidth={strokeW}
              strokeLinecap="round"
            />
          </g>
        </svg>
      </div>
    </div>
  );
}
