import { cn } from "@/lib/utils";
import Link from "next/link";

interface LogoProps {
  className?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  textHiddenOnSmall?: boolean;
}

const sizeMap = {
  xs: { logo: "w-6 h-6", bigText: "text-base", text: "text-xs" },
  sm: { logo: "w-8 h-8", bigText: "text-lg", text: "text-sm" },
  md: { logo: "w-10 h-10", bigText: "text-xl", text: "text-base" },
  lg: { logo: "w-12 h-12", bigText: "text-2xl", text: "text-lg" },
  xl: { logo: "w-16 h-16", bigText: "text-3xl", text: "text-xl" },
};

export default function Logo({
  className,
  size = "md",
  textHiddenOnSmall,
}: LogoProps) {
  return (
    <Link href="/" className="flex items-center gap-2">
      <img
        src="/logo.png"
        alt="Ulmiversität Logo"
        className={cn(
          "aspect-square dark:invert",
          sizeMap[size].logo,
          className,
        )}
      />
      <p
        className={cn(
          "font-semibold",
          sizeMap[size].text,
          textHiddenOnSmall && "hidden md:inline-block",
        )}
      >
        <span
          className={cn("text-primary font-extrabold", sizeMap[size].bigText)}
        >
          Ulm
        </span>
        iversität
      </p>
    </Link>
  );
}
