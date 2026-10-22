"use client";

import * as React from "react";

import { countdownFormatter } from "@/lib/public-transport/pub-tra-time-formatter";
import { getVehiclePassage } from "@/lib/public-transport/swu-api";
import { ExternalLink, Loader2, Rss } from "lucide-react";
import { Button } from "@/ui/button";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useLiveCountdowns } from "@/hooks/use-live-countdowns";

async function fetchFutureStops(vehicleNumber: number) {
  const passage = await getVehiclePassage(vehicleNumber);
  return passage.filter(
    (stop) => stop.status !== "PASSED" && stop.status !== "SKIPPED",
  );
}

export default function VehiclePassage({
  vehicleNumber,
}: {
  vehicleNumber?: number;
}) {
  const t = useTranslations("HomePage.PublicTransport");
  const { items: futureStops, status: state } = useLiveCountdowns(
    vehicleNumber || undefined,
    fetchFutureStops,
  );

  const timeFormatOptions: Intl.DateTimeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
  };

  return (
    <div className="bg-card h-full overflow-y-auto border-y px-4 py-4 md:border">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">{t("passageTitle")}</h2>

        <div className="relative flex size-4">
          <div className="bg-primary absolute inline-flex h-full w-full animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite] rounded-full opacity-50" />
          <Rss className="text-primary inline-flex size-4 animate-pulse" />
        </div>
      </div>

      {state === "IDLE" && (
        <p className="text-muted-foreground my-8 text-center text-sm">
          {t("selectTrip")}
        </p>
      )}

      {state === "LOADING" && (
        <div className="text-muted-foreground my-8 flex items-center justify-center text-sm">
          <Loader2 className="animate-spin" />
          <p>{t("loading")}</p>
        </div>
      )}

      {state === "ERROR" && (
        <p className="text-destructive my-8 text-center text-sm">
          {t("vehicleError")}
        </p>
      )}

      {state === "SUCCESS" && futureStops.length === 0 && (
        <p className="text-muted-foreground my-8 text-center text-sm">
          {t("tripNotStarted")}
        </p>
      )}

      {state === "SUCCESS" && futureStops.length > 0 && (
        <>
          <div className="my-2 flex items-center justify-center">
            <Link
              href={`https://echtzeit.swu.de/index.php?fzg=${vehicleNumber}`}
              target="_blank"
              rel="noreferrer"
            >
              <Button variant="outline">
                {t("liveMap")}
                <ExternalLink />
              </Button>
            </Link>
          </div>
          <ol className="mt-4 space-y-4">
            {futureStops.map((p, idx) => (
              <li key={idx} className="flex items-center gap-4">
                <h4 className="flex-1 truncate text-sm font-semibold">
                  {p.name}
                </h4>
                <p className="text-muted-foreground mx-2 font-mono font-semibold">
                  {countdownFormatter(p.countdown, p.actualTime, t)}
                </p>
                <p className="text-muted-foreground mx-2 font-mono font-semibold">
                  {p.actualTime.toLocaleTimeString("de-DE", timeFormatOptions)}
                </p>
              </li>
            ))}
          </ol>
        </>
      )}
    </div>
  );
}
