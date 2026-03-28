"use client";

import { useEffect, useMemo, useState } from "react";

export function FunLoading() {
  const animals = useMemo(() => ["🐻", "🐼", "🦊", "🐰", "🐱"], []);
  const [currentAnimal, setCurrentAnimal] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAnimal((prev) => (prev + 1) % animals.length);
    }, 400);
    return () => clearInterval(interval);
  }, [animals.length]);

  return (
    <div className="text-center py-28">
      <div className="inline-flex items-center justify-center w-32 h-32 rounded-[2.5rem] bg-white/80 backdrop-blur shadow-2xl mb-6">
        <span
          className="text-7xl animate-bounce-fun"
          style={{ animationDuration: "0.6s" }}
        >
          {animals[currentAnimal]}
        </span>
      </div>
      <div className="flex justify-center gap-2 mb-4">
        {[
          "bg-purple-400",
          "bg-pink-400",
          "bg-amber-400",
          "bg-emerald-400",
          "bg-blue-400",
        ].map((color, i) => (
          <div
            key={i}
            className={`w-4 h-4 rounded-full ${color} animate-bounce-fun`}
            style={{
              animationDelay: `${i * 0.15}s`,
              animationDuration: "0.8s",
            }}
          />
        ))}
      </div>
      <p className="text-gray-500 font-bold text-xl animate-pulse">
        Đang tải bảng điểm...
      </p>
    </div>
  );
}
