import { cn } from "@/lib/utils";
import React from "react";

interface PublicTransportSectionProps extends React.ComponentProps<"section"> {}

export function PublicTransportSection({
  className,
}: PublicTransportSectionProps) {
  return (
    <section className={cn("bg-card border-y px-4 py-2 md:border", className)}>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">ÖPNV</h2>
      </div>
    </section>
  );
}
