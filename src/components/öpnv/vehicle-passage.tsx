"use client";

import * as React from "react";

import {
  countdownFormatter,
} from "@/lib/public-transport/pub-tra-time-formatter";
import { Passage } from "@/lib/public-transport/public-transport.type";
import { getVehiclePassage } from "@/lib/public-transport/swu-api";
import { ExternalLink, Loader2, Rss } from "lucide-react";
import { Button } from "@/ui/button";
import Link from "next/link";

export default function VehiclePassage({
  vehicleNumber,
}: {
  vehicleNumber?: number;
}) {
  const [state, setState] = React.useState<
    "IDLE" | "LOADING" | "ERROR" | "SUCCESS"
  >("IDLE");
  const [futureStops, setFutureStops] = React.useState<Passage[]>([]);

  async function fetchPassageData(vehicleNum: number, showLoading = true) {
    if (showLoading) setState("LOADING");

    try {
      const passage = await getVehiclePassage(vehicleNum);

      const nextStops =
        passage.filter(
          (stop) => stop.status !== "PASSED" && stop.status !== "CANCELLED",
        ) ?? [];

      if (showLoading) setState("SUCCESS");
      setFutureStops(nextStops);
    } catch (error) {
      console.error("Failed to fetch vehicle passage data:", error);
      setState("ERROR");
    }
  }

  function updateCountdown() {
    setFutureStops((current) =>
      current?.map((cur) => ({
        ...cur,
        countdown: cur.countdown - 1,
      })),
    );
  }

  React.useEffect(() => {
    if (!vehicleNumber || vehicleNumber === 0) {
      setFutureStops([]);
      return;
    }

    fetchPassageData(vehicleNumber);

    const updateInterval = setInterval(() => updateCountdown(), 1000);
    const fetchInterval = setInterval(
      async () => await fetchPassageData(vehicleNumber, false),
      15000,
    );

    return () => {
      clearInterval(updateInterval);
      clearInterval(fetchInterval);
    };
  }, [vehicleNumber]);

  const timeFormatOptions: Intl.DateTimeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
  };

  return (
    <div className="bg-card h-full overflow-y-auto border-y px-4 py-4 md:border">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Abfahrten</h2>

        <div className="relative flex size-4">
          <div className="bg-primary absolute inline-flex h-full w-full animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite] rounded-full opacity-50" />
          <Rss className="text-primary inline-flex size-4 animate-pulse" />
        </div>
      </div>

      {state === "IDLE" && (
        <p className="text-muted-foreground my-8 text-center text-sm">
          Wähle eine Fahrt aus, um die Haltestellenfolge zu sehen.
        </p>
      )}

      {state === "LOADING" && (
        <div className="text-muted-foreground my-8 flex items-center justify-center text-sm">
          <Loader2 className="animate-spin" />
          <p>Laden...</p>
        </div>
      )}

      {state === "ERROR" && (
        <p className="text-destructive my-8 text-center text-sm">
          Fehler beim Laden der Fahrzeugdaten.
        </p>
      )}

      {state === "SUCCESS" && futureStops.length === 0 && (
        <p className="text-muted-foreground my-8 text-center text-sm">
          Keine Fahrzeugdaten verfügbar. Die Fahrt hat noch nicht begonnen.
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
                Echtzeit-Karte aufrufen
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
                  {countdownFormatter(p.countdown, p.actualTime)}
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
