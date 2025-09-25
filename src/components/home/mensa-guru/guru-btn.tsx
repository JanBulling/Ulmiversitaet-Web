import { cn } from "@/lib/utils";
import { Icons } from "@/ui/icons";

export default function GuruButton({
  className,
  ...props
}: React.ComponentProps<"button">) {
  return (
    <button
      className={cn(
        "relative max-w-sm cursor-pointer overflow-hidden rounded-full px-7 py-2.5",
        "text-base text-white",
        "bg-gradient-to-r from-cyan-400 via-sky-500 to-fuchsia-600",
        "shadow-[0_10px_30px_-10px_rgba(56,189,248,0.6)] transition-transform duration-150 ease-out hover:scale-[1.02] active:scale-[0.99]",
        "focus-visible:ring-offset-background focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:outline-none",
        className,
      )}
      aria-label="Frage den Guru"
      {...props}
    >
      {/*   <ShineBorder
        shineColor={["#22d3ee", "#60a5fa", "#ec4899"]}
        borderWidth={2}
        duration={10}
        className="pointer-events-none"
      /> */}
      <span className="relative z-10 flex items-center gap-2 font-semibold tracking-wide">
        <Icons.sparkles className="size-5" aria-hidden />
        <span>Frage den Guru</span>
      </span>
    </button>
  );
}
