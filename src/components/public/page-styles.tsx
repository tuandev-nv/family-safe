"use client";

export function PageStyles() {
  return (
    <style jsx>{`
      @keyframes dance {
        0%,
        100% {
          transform: translateY(0) rotate(0deg) scale(1);
        }
        20% {
          transform: translateY(-20px) rotate(10deg) scale(1.1);
        }
        40% {
          transform: translateY(-10px) rotate(-8deg) scale(0.95);
        }
        60% {
          transform: translateY(-25px) rotate(5deg) scale(1.05);
        }
        80% {
          transform: translateY(-5px) rotate(-3deg) scale(1);
        }
      }
      @keyframes dance-reverse {
        0%,
        100% {
          transform: translateY(0) rotate(0deg) scale(1);
        }
        20% {
          transform: translateY(-15px) rotate(-12deg) scale(1.05);
        }
        40% {
          transform: translateY(-25px) rotate(8deg) scale(1.1);
        }
        60% {
          transform: translateY(-8px) rotate(-5deg) scale(0.95);
        }
        80% {
          transform: translateY(-18px) rotate(3deg) scale(1.05);
        }
      }
      @keyframes firework-particle {
        0% {
          transform: translate(0, 0) scale(0);
          opacity: 0;
        }
        12% {
          transform: translate(0, 0) scale(1.4);
          opacity: 1;
        }
        50% {
          transform: translate(var(--fw-tx), var(--fw-ty)) scale(1);
          opacity: 0.9;
        }
        75% {
          transform: translate(var(--fw-tx), var(--fw-ty)) scale(0.7);
          opacity: 0.5;
        }
        100% {
          transform: translate(var(--fw-tx), calc(var(--fw-ty) + 20px))
            scale(0);
          opacity: 0;
        }
      }
      @keyframes wiggle {
        0%,
        100% {
          transform: rotate(0deg);
        }
        15% {
          transform: rotate(14deg);
        }
        30% {
          transform: rotate(-12deg);
        }
        45% {
          transform: rotate(10deg);
        }
        60% {
          transform: rotate(-8deg);
        }
        75% {
          transform: rotate(5deg);
        }
        90% {
          transform: rotate(-3deg);
        }
      }
      @keyframes bounce-fun {
        0%,
        100% {
          transform: translateY(0);
        }
        30% {
          transform: translateY(-12px);
        }
        50% {
          transform: translateY(-6px);
        }
        70% {
          transform: translateY(-10px);
        }
      }
      @keyframes jelly {
        0% {
          transform: scale(1, 1);
        }
        25% {
          transform: scale(0.95, 1.05);
        }
        50% {
          transform: scale(1.05, 0.95);
        }
        75% {
          transform: scale(0.97, 1.03);
        }
        100% {
          transform: scale(1, 1);
        }
      }
      @keyframes blob {
        0%,
        100% {
          transform: translate(0, 0) scale(1);
        }
        25% {
          transform: translate(30px, -30px) scale(1.1);
        }
        50% {
          transform: translate(-20px, 20px) scale(0.95);
        }
        75% {
          transform: translate(20px, 10px) scale(1.05);
        }
      }
      @keyframes shimmer {
        0% {
          transform: translateX(-200%);
        }
        100% {
          transform: translateX(200%);
        }
      }
      @keyframes sparkle-pop {
        0%,
        100% {
          opacity: 0;
          transform: scale(0) rotate(0deg);
        }
        30% {
          opacity: 1;
          transform: scale(1.3) rotate(90deg);
        }
        50% {
          opacity: 1;
          transform: scale(1) rotate(180deg);
        }
        70% {
          opacity: 0.8;
          transform: scale(1.2) rotate(270deg);
        }
      }
      @keyframes rain-left {
        0% {
          transform: translateY(-5vh) translateX(0) rotate(0deg);
          opacity: 0;
        }
        5% {
          opacity: 0.6;
        }
        50% {
          transform: translateY(50vh) translateX(-30px) rotate(180deg);
          opacity: 0.5;
        }
        95% {
          opacity: 0.3;
        }
        100% {
          transform: translateY(105vh) translateX(10px) rotate(360deg);
          opacity: 0;
        }
      }
      @keyframes rain-right {
        0% {
          transform: translateY(-5vh) translateX(0) rotate(0deg);
          opacity: 0;
        }
        5% {
          opacity: 0.6;
        }
        50% {
          transform: translateY(50vh) translateX(30px) rotate(-180deg);
          opacity: 0.5;
        }
        95% {
          opacity: 0.3;
        }
        100% {
          transform: translateY(105vh) translateX(-10px) rotate(-360deg);
          opacity: 0;
        }
      }
      @keyframes tap-sparkle {
        0% {
          transform: scale(0) rotate(0deg);
          opacity: 1;
        }
        50% {
          transform: scale(1.5) rotate(180deg);
          opacity: 0.8;
        }
        100% {
          transform: scale(0) rotate(360deg) translateY(-40px);
          opacity: 0;
        }
      }
      @keyframes star-pop {
        0% {
          transform: scale(0) rotate(-20deg);
        }
        50% {
          transform: scale(1.2) rotate(10deg);
        }
        100% {
          transform: scale(1) rotate(0deg);
        }
      }
      @keyframes card-entrance {
        0% {
          opacity: 0;
          transform: translateY(30px) scale(0.95);
        }
        100% {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }
      @keyframes header-entrance {
        0% {
          opacity: 0;
          transform: scale(0.5) rotate(-10deg);
        }
        60% {
          transform: scale(1.1) rotate(3deg);
        }
        100% {
          opacity: 1;
          transform: scale(1) rotate(0deg);
        }
      }
      @keyframes podium-rise {
        0% {
          opacity: 0;
          transform: translateY(60px);
        }
        60% {
          transform: translateY(-8px);
        }
        100% {
          opacity: 1;
          transform: translateY(0);
        }
      }
      @keyframes pillar-grow {
        0% {
          max-height: 0;
          opacity: 0;
        }
        100% {
          max-height: 200px;
          opacity: 1;
        }
      }
      @keyframes rainbow-title {
        0% {
          opacity: 0;
          transform: scale(0.8);
          filter: blur(10px);
        }
        100% {
          opacity: 1;
          transform: scale(1);
          filter: blur(0);
        }
      }
      @keyframes wave-char {
        0%,
        100% {
          transform: translateY(0) scale(1);
        }
        30% {
          transform: translateY(-8px) scale(1.12);
        }
        60% {
          transform: translateY(2px) scale(0.97);
        }
      }
      @keyframes title-shimmer {
        0%,
        100% {
          background-position: 0% 50%;
        }
        50% {
          background-position: 100% 50%;
        }
      }
      @keyframes float {
        0%,
        100% {
          transform: translateY(0);
        }
        50% {
          transform: translateY(-20px);
        }
      }
      :global(.animate-float) {
        animation: float 6s ease-in-out infinite;
      }
      :global(.animate-dance) {
        animation: dance 4s ease-in-out infinite;
      }
      :global(.animate-dance-reverse) {
        animation: dance-reverse 5s ease-in-out infinite;
      }
      :global(.animate-wiggle) {
        animation: wiggle 2.5s ease-in-out infinite;
      }
      :global(.animate-bounce-fun) {
        animation: bounce-fun 1.5s ease-in-out infinite;
      }
      :global(.animate-blob) {
        animation: blob 12s ease-in-out infinite;
      }
      :global(.animate-shimmer) {
        animation: shimmer 3s ease-in-out infinite;
      }
      :global(.animate-sparkle-pop) {
        animation: sparkle-pop 2.5s ease-in-out infinite;
      }
      :global(.animate-firework-particle) {
        animation: firework-particle 2s ease-out forwards;
      }
      :global(.animate-rain-left) {
        animation: rain-left linear infinite;
      }
      :global(.animate-rain-right) {
        animation: rain-right linear infinite;
      }
      :global(.animate-tap-sparkle) {
        animation: tap-sparkle 1s ease-out forwards;
      }
      :global(.animate-star-pop) {
        animation: star-pop 0.5s ease-out forwards;
      }
      :global(.animate-card-entrance) {
        animation: card-entrance 0.6s ease-out forwards;
      }
      :global(.animate-header-entrance) {
        animation: header-entrance 0.8s ease-out forwards;
      }
      :global(.animate-podium-rise) {
        animation: podium-rise 0.7s ease-out forwards;
      }
      :global(.animate-pillar-grow) {
        animation: pillar-grow 0.8s ease-out forwards;
      }
      :global(.animate-rainbow-title) {
        animation: rainbow-title 1s ease-out forwards;
      }
      :global(.animate-jelly) {
        animation: jelly 0.5s ease-in-out;
      }
      :global(.animate-wave-char) {
        animation: wave-char 2.5s ease-in-out infinite;
      }
      :global(.animate-title-shimmer) {
        animation: title-shimmer 4s ease-in-out infinite;
      }
    `}</style>
  );
}
