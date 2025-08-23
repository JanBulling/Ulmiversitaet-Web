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

interface PublicTransportDisplayProps {
  initialStopNumber: number;
  initialDepartures: Departure[];
}

export default function PublicTransportDisplay({
  initialStopNumber,
  initialDepartures,
}: PublicTransportDisplayProps) {
  const [stopNumber, setStopNumber] = React.useState<number>(initialStopNumber);
  const [departures, setDepartures] =
    React.useState<Departure[]>(initialDepartures);

  async function fetchNewDeparture(stopNr: number) {
    console.log("FETCH", stopNr);
    const data = await getDeparturesAtStop(stopNr);
    setDepartures(data!);
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
    await fetchNewDeparture(newStopNumber);
  }

  return (
    <div className="my-2">
      <Tabs defaultValue={"1240"} onValueChange={updateStopNumber}>
        <TabsList className="w-full">
          <TabsTrigger value="1240">Uni Süd</TabsTrigger>
          <TabsTrigger value="1241">Bot. Garten</TabsTrigger>
          <TabsTrigger value="1245">Uni Nord</TabsTrigger>
          <TabsTrigger value="1246">Uni West</TabsTrigger>
          {/* <TabsTrigger value="1008">Hbf.</TabsTrigger>
          <TabsTrigger value="1350">Ehing. Tor</TabsTrigger> */}
        </TabsList>
      </Tabs>
      <ol className="mt-2 divide-y">
        {departures?.map((d, idx) => (
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
                {delayFormatter(d.scheduledTime, d.actualTime)}
              </p>
            </div>
            <p className="text-muted-foreground mx-2 font-mono font-semibold">
              {countdownFormatter(d.countdown, d.actualTime)}
            </p>
          </li>
        ))}
      </ol>
    </div>
  );
}
