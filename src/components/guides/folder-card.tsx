import { ChevronRight, FolderOpenIcon } from "lucide-react";
import Link from "next/link";

interface FolderCardProps {
  folder: string;
}

export default function FolderCard({ folder }: FolderCardProps) {
  const displayName = folder.split("/").pop() ?? folder;

  return (
    <Link
      href={`/guides/${folder}`}
      className="group block focus:outline-none"
      aria-label={`Ordner öffnen: ${displayName}`}
      title={displayName}
    >
      <div className="bg-card hover:bg-accent/40 flex items-center justify-between gap-4 rounded-xl border p-5">
        <div className="flex min-w-0 items-center gap-3">
          <div className="bg-muted text-muted-foreground flex size-12 items-center justify-center rounded-lg">
            <FolderOpenIcon className="size-6" aria-hidden />
          </div>

          <div className="min-w-0">
            <p className="truncate text-xl leading-5 font-semibold">
              {displayName}
            </p>
          </div>
        </div>

        <ChevronRight
          className="text-muted-foreground size-5 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5"
          aria-hidden
        />
      </div>
    </Link>
  );
}
