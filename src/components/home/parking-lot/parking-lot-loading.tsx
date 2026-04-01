import { cn } from "@/lib/utils";
import { Button } from "@/ui/button";
import { Skeleton } from "@/ui/skeleton";
import { ChevronRight, Loader2, ParkingCircle } from "lucide-react";
import Link from "next/link";

export default function ParkingLotLoading({
  className,
}: React.ComponentProps<"section">) {
  return (
    <section className={cn("bg-card border-y px-4 py-4 md:border", className)}>
      <div className="flex items-center gap-4">
        <ParkingCircle className="text-primary size-8" />
        <h2 className="flex-1 text-2xl font-bold">Parkplätze</h2>
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
