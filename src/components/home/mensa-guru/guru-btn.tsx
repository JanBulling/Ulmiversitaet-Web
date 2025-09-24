import { cn } from "@/lib/utils";
import { ShineBorder } from "@/ui/effects/shine-border";

export default function GuruButton({
  className,
  ...props
}: React.ComponentProps<"button">) {
  return (
    <button
      className={cn(
        "relative max-w-sm cursor-pointer overflow-hidden rounded-full px-7 py-2.5",
        "bg-white text-base dark:bg-zinc-900",
        "shadow-sm transition-transform duration-150 ease-out hover:scale-[1.02] active:scale-[0.99]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-background",
        className,
      )}
      aria-label="Frage den Guru"
      {...props}
    >
      <ShineBorder
        shineColor={["#22d3ee", "#06b6d4", "#8b5cf6"]}
        borderWidth={2}
        duration={10}
        className="pointer-events-none"
      />
      <span className="relative z-10 flex items-center gap-2 font-semibold">
        <span className="text-lg" aria-hidden>✨</span>
        <span className="bg-gradient-to-r from-cyan-400 via-teal-400 to-fuchsia-500 bg-clip-text text-transparent">
          Frage den Guru
        </span>
      </span>
    </button>
  );
}
