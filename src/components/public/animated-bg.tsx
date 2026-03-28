"use client";

export function AnimatedBg() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 will-change-transform">
      {/* Gradient blobs - static, no animation to save GPU */}
      <div className="absolute -top-40 -left-40 w-125 h-125 bg-linear-to-br from-purple-400/30 to-fuchsia-400/20 rounded-full blur-2xl" />
      <div className="absolute top-1/4 -right-32 w-md h-112 bg-linear-to-br from-pink-400/20 to-rose-400/15 rounded-full blur-2xl" />
      <div className="absolute -bottom-32 left-1/4 w-125 h-125 bg-linear-to-br from-cyan-400/20 to-sky-400/15 rounded-full blur-2xl" />

      {/* Floating emojis - simple float only, GPU-friendly */}
      <div className="absolute top-[5%] left-[6%] text-4xl animate-float opacity-60">
        ⭐
      </div>
      <div
        className="absolute top-[10%] right-[10%] text-5xl animate-float opacity-40"
        style={{ animationDelay: "1s" }}
      >
        🌈
      </div>
      <div className="absolute top-[35%] left-[3%] text-3xl animate-wiggle opacity-40">
        🎈
      </div>
      <div
        className="absolute top-[60%] right-[5%] text-4xl animate-float opacity-40"
        style={{ animationDelay: "2s" }}
      >
        🦋
      </div>
      <div
        className="absolute bottom-[10%] left-[12%] text-3xl animate-float opacity-30"
        style={{ animationDelay: "3s" }}
      >
        🌸
      </div>
      <div
        className="absolute top-[20%] right-[28%] text-2xl animate-wiggle opacity-30"
        style={{ animationDelay: "1.5s" }}
      >
        💫
      </div>
      <div
        className="absolute bottom-[20%] right-[18%] text-3xl animate-float opacity-35"
        style={{ animationDelay: "0.8s" }}
      >
        🎵
      </div>
      <div
        className="absolute top-[75%] left-[40%] text-3xl animate-wiggle opacity-25"
        style={{ animationDelay: "2.5s" }}
      >
        🎀
      </div>
      <div
        className="absolute top-[15%] left-[45%] text-2xl animate-float opacity-25"
        style={{ animationDelay: "1.2s" }}
      >
        🍭
      </div>
      <div
        className="absolute top-[70%] left-[60%] text-3xl animate-float opacity-25"
        style={{ animationDelay: "3.5s" }}
      >
        🧸
      </div>

      {/* Sparkle dots */}
      <div className="absolute top-[8%] left-[30%] w-2 h-2 bg-yellow-300 rounded-full animate-sparkle-pop opacity-60" />
      <div
        className="absolute top-[45%] right-[15%] w-2 h-2 bg-pink-400 rounded-full animate-sparkle-pop opacity-50"
        style={{ animationDelay: "1s" }}
      />
      <div
        className="absolute bottom-[30%] left-[8%] w-2 h-2 bg-purple-400 rounded-full animate-sparkle-pop opacity-40"
        style={{ animationDelay: "2s" }}
      />
      <div
        className="absolute top-[70%] right-[35%] w-1.5 h-1.5 bg-cyan-400 rounded-full animate-sparkle-pop opacity-50"
        style={{ animationDelay: "3s" }}
      />
    </div>
  );
}
