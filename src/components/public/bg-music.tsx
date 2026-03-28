"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export function BgMusic() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const started = useRef(false);

  useEffect(() => {
    const audio = new Audio("/audio/bg-music.mp3");
    audio.loop = true;
    audio.volume = 0.3;
    audioRef.current = audio;

    const tryPlay = () => {
      if (started.current) return;
      started.current = true;
      audio
        .play()
        .then(() => setPlaying(true))
        .catch(() => {
          started.current = false;
        });
    };

    window.addEventListener("mousemove", tryPlay, { once: true });
    window.addEventListener("touchstart", tryPlay, { once: true });
    window.addEventListener("click", tryPlay, { once: true });

    return () => {
      audio.pause();
      window.removeEventListener("mousemove", tryPlay);
      window.removeEventListener("touchstart", tryPlay);
      window.removeEventListener("click", tryPlay);
    };
  }, []);

  const toggle = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio
        .play()
        .then(() => setPlaying(true))
        .catch(() => {});
    }
  }, [playing]);

  return (
    <button
      onClick={toggle}
      className="fixed bottom-6 right-6 z-40 w-12 h-12 rounded-full bg-white/80 backdrop-blur shadow-lg border border-purple-200/50 flex items-center justify-center text-xl hover:scale-110 transition-transform"
      title={playing ? "Tắt nhạc" : "Bật nhạc"}
    >
      {playing ? "🔊" : "🔇"}
    </button>
  );
}
