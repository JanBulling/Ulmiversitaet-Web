import { cn } from "@/lib/utils";
import { Skeleton } from "@/ui/skeleton";
import { Loader2, TramFront } from "lucide-react";

export default function PublicTransportLoading({
  className,
}: React.ComponentProps<"section">) {
  return (
    <section className={cn("bg-card border-y px-4 py-4 md:border", className)}>
      <div className="flex items-center gap-4">
        <TramFront className="text-primary size-8" />
        <h2 className="flex-1 text-2xl font-bold">Echtzeit-ÖPNV</h2>
        <Loader2 className="animate-spin" />
      </div>

      <Skeleton className="my-2 h-8 w-full" />

      <div className="mt-2 space-y-2">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    </section>
  );
}
