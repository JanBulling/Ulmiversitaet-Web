"use client";

import { cn } from "@/lib/utils";

interface SmokeEffectProps {
  particleCount?: number;
  particleSize?: number;
  color?: string[];
  className?: string;
}

export default function SmokeEffect({
  particleCount = 35,
  particleSize = 30,
  color = ["#525252", "#727272", "#B2B2B2"],
  className,
}: SmokeEffectProps) {
  const particles = Array.from({ length: particleCount });

  return (
    <div id="smoke" className={cn("relative w-full max-w-sm", className)}>
      {particles.map((_, i) => (
        <div
          key={i}
          className="animate-smoke absolute rounded-full"
          style={{
            opacity: 0,
            backgroundColor: color[i % color.length],
            width: `${Math.random() * particleSize + 5}%`,
            height: `${Math.random() * particleSize + 5}%`,
            left: `${Math.random() * 90 + 5}%`,
            bottom: `${Math.random() * 40}%`,
            animationDelay: `${i * 0.1 - 0.05 * particleCount}s`,
          }}
        />
      ))}
    </div>
  );
}
