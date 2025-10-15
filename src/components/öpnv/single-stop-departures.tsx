"use client";

import { Departure } from "@/lib/public-transport/public-transport.type";
import * as React from "react";
import PublicTransportRouteIcon from "../home/public-transport/pub-tra-icon";
import { cn } from "@/lib/utils";
import {
  countdownFormatter,
  delayFormatter,
  isDelayed,
} from "@/lib/public-transport/pub-tra-time-formatter";
import { getDeparturesAtStop } from "@/lib/public-transport/swu-api";
import StopSelectorButton from "./stop-select-btn";

interface SingleStopDeparturesProps {
  initialStopNumber: number;
  initialDepartures: Departure[];
  onVehicleClick?: (vehicleId: number) => void;
  vehicleId?: number;
}

export default function SingleStopDepartures({
  initialStopNumber,
  initialDepartures,
  onVehicleClick,
  vehicleId,
}: SingleStopDeparturesProps) {
  const [stopNumber, setStopNumber] = React.useState<number>(initialStopNumber);
  const [departures, setDepartures] =
    React.useState<Departure[]>(initialDepartures);

  async function fetchNewDeparture(stopNr: number) {
    try {
      const data = await getDeparturesAtStop(stopNr, 12);
      setDepartures(data || []);
    } catch (error) {
      console.error("Failed to fetch new departures:", error);
    }
  }

  function updateDepartureCountdown() {
    setDepartures((current) =>
      current?.map((cur) => ({
        ...cur,
        countdown: cur.countdown - 1,
      })),
    );
  }

  React.useEffect(() => {
    const updateInterval = setInterval(() => updateDepartureCountdown(), 1000);
    const fetchInterval = setInterval(
      async () => await fetchNewDeparture(stopNumber),
      15000,
    );

    return () => {
      clearInterval(updateInterval);
      clearInterval(fetchInterval);
    };
  }, [stopNumber]);

  async function updateStopNumber(stopId: number) {
    const newStopNumber = stopId;
    setStopNumber(newStopNumber);
    await fetchNewDeparture(newStopNumber); // Re-added this line
  }

  return (
    <div className="bg-card border-y px-4 py-4 md:border">
      <div className="flex items-center justify-center">
        <StopSelectorButton
          stopId={stopNumber}
          onStopIdChange={updateStopNumber}
        />
      </div>

      <ol className="mt-2 divide-y">
        {departures?.length > 0 ? (
          departures.map((d, idx) => (
            <li
              key={idx}
              className={cn(
                "hover:bg-muted flex cursor-pointer items-center gap-4 py-2",
                vehicleId === d.vehicleNumber && vehicleId !== 0 && "bg-muted",
              )}
              onClick={() => onVehicleClick?.(d.vehicleNumber)}
            >
              <PublicTransportRouteIcon route={d.route} className="size-7" />
              <div className="flex-1">
                <h4 className="text-sm font-semibold">{d.directionText}</h4>
                <p
                  className={cn(
                    "text-xs",
                    isDelayed(d.scheduledTime, d.actualTime) < 0
                      ? "text-success"
                      : isDelayed(d.scheduledTime, d.actualTime) > 0
                        ? "text-destructive"
                        : "text-muted-foreground",
                  )}
                >
                  {delayFormatter(d.scheduledTime, d.actualTime, "Pünktlich")}
                </p>
              </div>
              <p className="text-muted-foreground mx-2 font-mono font-semibold">
                {countdownFormatter(d.countdown, d.actualTime)}
              </p>
            </li>
          ))
        ) : (
          <p className="text-muted-foreground mt-4">No departures found.</p>
        )}
      </ol>
    </div>
  );
}
