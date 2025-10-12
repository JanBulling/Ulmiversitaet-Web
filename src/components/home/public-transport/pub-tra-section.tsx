import { ChevronRight, Rss, TramFront } from "lucide-react";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import React from "react";

import {
  getDeparturesAtStop,
  getPassengerAlert,
} from "@/lib/public-transport/swu-api";
import { cn } from "@/lib/utils";
import PublicTransportDisplay from "./pub-tra-display";
import { Button } from "@/ui/button";
import { defaultStop } from "@/content/public-transport/config";
import { Alert, AlertDescription, AlertTitle } from "@/ui/alert";

export async function PublicTransportSection({
  className,
}: React.ComponentProps<"section">) {
  const t = await getTranslations("HomePage.PublicTransport");

  const departures = await getDeparturesAtStop(defaultStop.stopId);
  const passengerAlert = await getPassengerAlert();

  return (
    <section className={cn("bg-card border-y px-4 py-4 md:border", className)}>
      <div className="flex items-center gap-4">
        <TramFront className="text-primary size.6 md:size-8" />

        <h2 className="flex-1 text-xl font-bold md:text-2xl">{t("title")}</h2>

        <div className="relative flex size-4">
          <div className="bg-primary absolute inline-flex h-full w-full animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite] rounded-full opacity-50" />
          <Rss className="text-primary inline-flex size-4 animate-pulse" />
        </div>
      </div>

      {passengerAlert.status === "DISRUPTION" && (
        <Alert variant="destructive" className="mt-2">
          <AlertTitle>{passengerAlert.title}</AlertTitle>
          <AlertDescription>
            {passengerAlert.data?.map((alert) => (
              <p key={alert}>{alert}</p>
            ))}
          </AlertDescription>
        </Alert>
      )}

      <PublicTransportDisplay
        initialDepartures={departures!}
        initialStopNumber={defaultStop.stopId}
      />

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
