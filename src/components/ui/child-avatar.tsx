"use client";

import { useState } from "react";

interface ChildAvatarProps {
  emoji: string;
  avatarUrl?: string | null;
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl";
  className?: string;
}

const sizeMap = {
  sm: { cls: "w-8 h-8 text-lg", px: 32 },
  md: { cls: "w-11 h-11 text-2xl", px: 44 },
  lg: { cls: "w-14 h-14 text-3xl", px: 56 },
  xl: { cls: "w-20 h-20 text-5xl", px: 80 },
  "2xl": { cls: "w-24 h-24 text-6xl", px: 96 },
  "3xl": { cls: "w-32 h-32 text-7xl", px: 128 },
  "4xl": { cls: "w-40 h-40 text-8xl", px: 160 },
};

export function ChildAvatar({ emoji, avatarUrl, size = "md", className = "" }: ChildAvatarProps) {
  const [imgError, setImgError] = useState(false);
  const { cls, px } = sizeMap[size];

  if (avatarUrl && !imgError) {
    return (
      /* eslint-disable-next-line @next/next/no-img-element */
      <img
        src={avatarUrl}
        alt=""
        width={px * 2}
        height={px * 2}
        decoding="async"
        className={`${cls} rounded-full object-cover ${className}`}
        style={{ imageRendering: "auto" }}
        onError={() => setImgError(true)}
      />
    );
  }

  return (
    <span className={`${cls} inline-flex items-center justify-center rounded-full ${className}`}>
      {emoji}
    </span>
  );
}
