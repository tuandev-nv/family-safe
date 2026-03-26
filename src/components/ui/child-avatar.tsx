"use client";

import { useState } from "react";

interface ChildAvatarProps {
  emoji: string;
  avatarUrl?: string | null;
  size?: "sm" | "md" | "lg" | "xl" | "2xl";
  className?: string;
}

const sizeMap = {
  sm: "w-8 h-8 text-lg",
  md: "w-11 h-11 text-2xl",
  lg: "w-14 h-14 text-3xl",
  xl: "w-20 h-20 text-5xl",
  "2xl": "w-24 h-24 text-6xl",
};

export function ChildAvatar({ emoji, avatarUrl, size = "md", className = "" }: ChildAvatarProps) {
  const [imgError, setImgError] = useState(false);
  const sizeClass = sizeMap[size];

  if (avatarUrl && !imgError) {
    return (
      /* eslint-disable-next-line @next/next/no-img-element */
      <img
        src={avatarUrl}
        alt=""
        className={`${sizeClass} rounded-full object-cover ${className}`}
        onError={() => setImgError(true)}
      />
    );
  }

  return (
    <span className={`${sizeClass} inline-flex items-center justify-center rounded-full ${className}`}>
      {emoji}
    </span>
  );
}
