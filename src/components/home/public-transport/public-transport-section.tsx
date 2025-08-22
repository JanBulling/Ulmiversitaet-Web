import { cn } from "@/lib/utils";
import React from "react";

export function PublicTransportSection({
  className,
}: React.ComponentProps<"section">) {
  return (
    <section className={cn("bg-card border-y px-4 py-2 md:border", className)}>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">ÖPNV</h2>
      </div>
    </section>
  );
}
