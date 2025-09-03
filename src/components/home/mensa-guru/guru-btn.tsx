import { cn } from "@/lib/utils";

export default function GuruButton({
  className,
  ...props
}: React.ComponentProps<"button">) {
  return (
    <button
      className={cn(
        "relative max-w-sm cursor-pointer overflow-hidden rounded-xl bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 px-6 py-3 text-lg shadow-xl transition duration-200 ease-out hover:scale-105",
        className,
      )}
      {...props}
    >
      <span className="animate-shiny-text font-mono text-lg font-bold">
        💫✨ Frage den Guru ✨💫
      </span>
      <span className="animate-shimmer absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"></span>
    </button>
  );
}
