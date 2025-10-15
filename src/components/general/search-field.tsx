import { Search } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";

export default function HeaderSearchField() {
  const t = useTranslations("Nav");

  return (
    <Link href="/search">
      <div className="bg-background dark:border-input dark:bg-input/30 dark:hover:bg-input/50 hover:bg-muted hover:text-muted-foreground flex h-9 w-9 cursor-pointer items-center justify-center rounded-md border text-sm font-medium shadow-xs lg:w-48 lg:justify-between lg:px-4">
        <p className="text-muted-foreground hidden lg:inline-block">
          {t("search")}
        </p>
        <Search className="pointer-events-none size-4 shrink-0" />
      </div>
    </Link>
  );
}
