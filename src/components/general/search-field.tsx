import { Search } from "lucide-react";
import Link from "next/link";

export default function HeaderSearchField() {
  return (
    <Link href="/search">
      <div className="bg-background dark:border-input dark:bg-input/30 dark:hover:bg-input/50 hover:bg-muted hover:text-muted-foreground flex h-9 w-9 cursor-pointer items-center justify-center rounded-md border text-sm font-medium shadow-xs md:w-48 md:justify-between md:px-4">
        <p className="text-muted-foreground hidden md:inline-block">Suche...</p>
        <Search className="pointer-events-none size-4 shrink-0" />
      </div>
    </Link>
  );
}
