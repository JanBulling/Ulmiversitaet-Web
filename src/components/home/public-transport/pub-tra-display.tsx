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
import LocationButton from "@/components/öpnv/location-button";
import { findNearestStations, StopWithDistance } from "@/lib/public-transport/location-utils";
import { GeolocationPosition } from "@/lib/geolocation";

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
  const [nearestStations, setNearestStations] = React.useState<StopWithDistance[]>([]);
  const [currentStops, setCurrentStops] = React.useState(featuredStops);
  const [isLocationMode, setIsLocationMode] = React.useState(false);

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
    await fetchNewDeparture(newStopNumber);
  }

  function handleLocationFound(position: GeolocationPosition) {
    const nearest = findNearestStations(position, 3);
    setNearestStations(nearest);

    // Convert nearest stations to the same format as featured stops
    const nearestStops = nearest.map(station => ({
      name: station.name.length > 10 ? station.name.substring(0, 10) + "..." : station.name,
      stopId: station.id
    }));

    setCurrentStops(nearestStops);
    setIsLocationMode(true);

    // Automatically select the nearest station
    if (nearest.length > 0) {
      setStopNumber(nearest[0].id);
      fetchNewDeparture(nearest[0].id);
    }
  }

  function handleRevertToOriginal() {
    setCurrentStops(featuredStops);
    setIsLocationMode(false);
    setStopNumber(defaultStop.stopId);
    fetchNewDeparture(defaultStop.stopId);
  }

  function handleLocationError(error: string) {
    console.error("Location error:", error);
    // You could show a toast notification here
  }

  return (
    <div className="my-2">
      <div className="flex items-center gap-2 mb-2">
        <Tabs
          value={stopNumber.toString()}
          onValueChange={updateStopNumber}
          className="flex-1"
        >
          <TabsList className="w-full">
            {currentStops.map((stop) => (
              <TabsTrigger key={stop.stopId} value={stop.stopId.toString()}>
                {stop.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <LocationButton
          onLocationFound={handleLocationFound}
          onError={handleLocationError}
          onRevert={handleRevertToOriginal}
          isLocationMode={isLocationMode}
          size="sm"
        />
      </div>
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
          <p className="text-muted-foreground mt-4">{t("noDepartures")}</p>
        )}
      </ol>
    </div>
  );
}
