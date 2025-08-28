"use client";

import { Departure } from "@/lib/public-transport/public-transport.type";
import { getDeparturesAtStop } from "@/lib/public-transport/swu-api";
import * as React from "react";
import PublicTransportRouteIcon from "./pub-tra-icon";
import { Tabs, TabsList, TabsTrigger } from "@/ui/tabs";
import {
  countdownFormatter,
  delayFormatter,
  isDelayed,
} from "@/lib/public-transport/pub-tra-time-formatter";
import { cn } from "@/lib/utils";
import { publicTransportStops } from "@/config/public-transport";

interface PublicTransportDisplayCopyProps {
  initialStopNumber: number;
  departures: Departure[]; // Add departures prop
  onDepartureClick?: (vehicleNumber: number) => void;
  selectedVehicleNumber?: number | null; // New prop
  onStopSelectFromTabs?: (stopId: string) => void; // New prop for tab selection
}

export default function PublicTransportDisplayCopy({
  initialStopNumber,
  departures, // Destructure departures prop
  onDepartureClick,
  selectedVehicleNumber, // Destructure new prop
  onStopSelectFromTabs, // Destructure new prop
}: PublicTransportDisplayCopyProps) {
  const [stopNumber, setStopNumber] = React.useState<number>(initialStopNumber);
  const [internalDepartures, setInternalDepartures] = React.useState<Departure[]>(departures);

  async function fetchNewDeparture(stopNr: number) {
    try {
      const data = await getDeparturesAtStop(stopNr);
      setInternalDepartures(data || []);
    } catch (error) {
      console.error("Failed to fetch new departures:", error);
    }
  }

  function updateSecondDepartures() {
    setInternalDepartures((current) =>
      current?.map((cur) => ({
        ...cur,
        countdown: cur.countdown - 1,
      })),
    );
  }

  React.useEffect(() => {
    const updateInterval = setInterval(() => updateSecondDepartures(), 1000);
    const fetchInterval = setInterval(
      async () => await fetchNewDeparture(stopNumber),
      15000,
    );

    return () => {
      clearInterval(updateInterval);
      clearInterval(fetchInterval);
    };
  }, [stopNumber]);

  React.useEffect(() => {
    if (initialStopNumber !== stopNumber) {
      setStopNumber(initialStopNumber);
      fetchNewDeparture(initialStopNumber);
    }
  }, [initialStopNumber]);

  // Update internal departures when prop changes
  React.useEffect(() => {
    setInternalDepartures(departures);
  }, [departures]);

  return (
    <div className="my-2"> {/* Removed relative class */}
      <Tabs value={stopNumber.toString()} onValueChange={onStopSelectFromTabs}>
        <TabsList className="w-full overflow-x-auto">
          {publicTransportStops.map((stop) => (
            <TabsTrigger key={stop.value} value={stop.value}>
              {stop.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      <ol className="mt-2 divide-y">
        {internalDepartures?.length > 0 ? (
          internalDepartures.map((d, idx) => (
            <li key={idx} className={cn("flex cursor-pointer items-center gap-4 py-2 hover:bg-muted/50 transition-colors",
                d.vehicleNumber === selectedVehicleNumber && "bg-muted"
              )}
                onClick={() => onDepartureClick?.(d.vehicleNumber)}>
              <PublicTransportRouteIcon route={d.route} className="size-7 shrink-0" />
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold truncate max-w-full">
                  {d.directionText}
                </h4>
                <p
                  className={cn(
                    "text-xs truncate max-w-full",
                    isDelayed(d.scheduledTime, d.actualTime) < 0
                      ? "text-success"
                      : isDelayed(d.scheduledTime, d.actualTime) > 0
                        ? "text-destructive"
                        : "text-muted-foreground",
                  )}
                >
                  {delayFormatter(d.scheduledTime, d.actualTime)}
                </p>
              </div>
              <p className="text-muted-foreground mx-2 font-mono font-semibold shrink-0">
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
