import { cn } from "@/lib/utils";
import { Button } from "@/ui/button";
import { Skeleton } from "@/ui/skeleton";
import { ExternalLink } from "lucide-react";
import Link from "next/link";

export default function MensaSectionLoading({
  className,
}: React.ComponentProps<"section">) {
  const date = new Date();

  const dateFormatter = Intl.DateTimeFormat("de-DE", {
    month: "short",
    day: "numeric",
    weekday: "long",
  });

  return (
    <section className={cn("bg-card border-y px-4 py-4 md:border", className)}>
      <div className="flex items-center gap-4 md:justify-between">
        <h2 className="text-2xl font-bold">Mensa</h2>
        <p className="text-muted-foreground text-sm">
          Heute, {dateFormatter.format(date)}
        </p>
      </div>

      <div className="mt-2 mb-4 space-y-2">
        <Skeleton className="h-18 w-full" />
        <Skeleton className="h-18 w-full" />
      </div>

      <div className="flex items-center justify-center">
        <Link
          href="https://mensa.ulmiversitaet.de"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button variant="outline" className="cursor-pointer">
            Mehr Gerichte
            <ExternalLink className="size-3" />
          </Button>
        </Link>
      </div>
    </section>
  );
}
