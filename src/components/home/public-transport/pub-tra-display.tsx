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
import { featuredStops, defaultStop } from "@/content/public-transport/config";
import { useTranslations } from "next-intl";

interface PublicTransportDisplayProps {
  initialStopNumber: number;
  initialDepartures: Departure[];
}

export default function PublicTransportDisplay({
  initialStopNumber,
  initialDepartures,
}: PublicTransportDisplayProps) {
  const t = useTranslations("HomePage.PublicTransport");

  const [stopNumber, setStopNumber] = React.useState<number>(initialStopNumber);
  const [departures, setDepartures] =
    React.useState<Departure[]>(initialDepartures);

  async function fetchNewDeparture(stopNr: number) {
    try {
      const data = await getDeparturesAtStop(stopNr);
      setDepartures(data || []);
    } catch (error) {
      console.error("Failed to fetch new departures:", error);
    }
  }

  function updateSecondDepartures() {
    setDepartures((current) =>
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

  async function updateStopNumber(number: string) {
    const newStopNumber = +number;
    setStopNumber(newStopNumber);
    await fetchNewDeparture(newStopNumber); // Re-added this line
  }

  return (
    <div className="my-2">
      <Tabs
        defaultValue={defaultStop.stopId.toString()}
        onValueChange={updateStopNumber}
      >
        <TabsList className="w-full">
          {featuredStops.map((stop) => (
            <TabsTrigger key={stop.stopId} value={stop.stopId.toString()}>
              {stop.name}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      <ol className="mt-2 divide-y">
        {departures?.length > 0 ? (
          departures.map((d, idx) => (
            <li key={idx} className="flex items-center gap-4 py-2">
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
                  {delayFormatter(d.scheduledTime, d.actualTime, t("onTime"))}
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
