import { QuickLink } from "@/content/quick-links";
import { LinkIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface QuickLinkProps {
  quickLink: QuickLink;
}

export function QuickLinkIcon({ quickLink }: QuickLinkProps) {
  return (
    <Link
      href={quickLink.href}
      aria-label={`Link öffnen: ${quickLink.label}`}
      target={quickLink.internalLink ? undefined : "_blank"}
      rel={quickLink.internalLink ? undefined : "noopener noreferrer"}
    >
      <div className="group">
        <div className="bg-card/25 group-hover:bg-muted/75 relative mx-auto flex aspect-square h-16 w-16 items-center justify-center rounded-2xl border-1 shadow backdrop-blur-lg sm:h-24 sm:w-24">
          {quickLink.icon ? (
            <Image
              src={quickLink.icon}
              alt={quickLink.label}
              width={48}
              height={48}
              className="size-10 sm:size-12 dark:invert"
            />
          ) : (
            <LinkIcon className="size-10 sm:size-12" />
          )}
          <div className="from-primary/35 pointer-events-none absolute inset-px rounded-lg bg-radial-[at_30%_20%] from-0% to-transparent to-70% mix-blend-overlay" />
        </div>

        <p className="mt-1 line-clamp-1 px-1 text-center text-xs font-bold">
          {quickLink.label}
        </p>
      </div>
    </Link>
  );
}
