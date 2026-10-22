import { cn } from "@/lib/utils";
import { Button } from "@/ui/button";
import { Skeleton } from "@/ui/skeleton";
import { ChevronRight, Loader2, TramFront } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";

export default function PublicTransportLoading({
  className,
}: React.ComponentProps<"section">) {
  const t = useTranslations("HomePage.PublicTransport");

  return (
    <section className={cn("bg-card border-y px-4 py-4 md:border", className)}>
      <div className="flex items-center gap-4">
        <TramFront className="text-primary size-8" />
        <h2 className="flex-1 text-2xl font-bold">{t("title")}</h2>
        <Loader2 className="animate-spin" />
      </div>

      <Skeleton className="my-2 h-8 w-full" />

      <div className="mt-2 space-y-2">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>

      <div className="my-2 flex items-center justify-center">
        <Link href="/public-transport">
          <Button variant="outline">
            {t("moreStops")}
            <ChevronRight />
          </Button>
        </Link>
      </div>
    </section>
  );
}
