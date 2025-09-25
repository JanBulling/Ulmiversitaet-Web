"use client";

import { cn } from "@/lib/utils";

interface SmokeEffectProps {
  particleCount?: number;
  particleSize?: number;
  color?: string[];
  className?: string;
}

export default function SmokeEffect({
  particleCount = 40,
  particleSize = 28,
  color = ["#22d3ee", "#60a5fa", "#a78bfa", "#ec4899"],
  className,
}: SmokeEffectProps) {
  const particles = Array.from({ length: particleCount });

  return (
    <div id="smoke" className={cn("relative w-full max-w-sm", className)}>
      {particles.map((_, i) => (
        <div
          key={i}
          className="animate-smoke absolute rounded-full blur-sm"
          style={{
            opacity: 0,
            backgroundImage: `radial-gradient(circle at 30% 30%, ${color[i % color.length]}99, transparent 60%)`,
            width: `${Math.random() * particleSize + 8}%`,
            height: `${Math.random() * particleSize + 8}%`,
            left: `${Math.random() * 90 + 2}%`,
            bottom: `${Math.random() * 45}%`,
            animationDelay: `${i * 0.1 - 0.05 * particleCount}s`,
          }}
        />
      ))}
    </div>
  );
}
