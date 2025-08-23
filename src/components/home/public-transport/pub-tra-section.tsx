import { getDeparturesAtStop } from "@/lib/public-transport/swu-api";
import { cn } from "@/lib/utils";
import React from "react";
import PublicTransportDisplay from "./pub-tra-display";

export async function PublicTransportSection({
  className,
}: React.ComponentProps<"section">) {
  const departures = await getDeparturesAtStop(1240);

  return (
    <section className={cn("bg-card border-y px-4 py-4 md:border", className)}>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Echtzeit-ÖPNV</h2>
      </div>
      <PublicTransportDisplay
        initialDepartures={departures!}
        initialStopNumber={1240}
      />
    </section>
  );
}
