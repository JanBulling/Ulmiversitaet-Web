"use client";

import { Departure } from "@/lib/public-transport/public-transport.type";
import { getDeparturesAtStop } from "@/lib/public-transport/swu-api";
import * as React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/ui/tabs";
import { featuredStops, defaultStop } from "@/content/public-transport/config";
import LocationButton from "@/components/öpnv/location-button";
import DepartureList from "@/components/öpnv/departure-list";
import { useLiveCountdowns } from "@/hooks/use-live-countdowns";
import { findNearestStations } from "@/lib/public-transport/location-utils";
import { GeolocationPosition } from "@/lib/geolocation";

interface PublicTransportDisplayProps {
  initialStopNumber: number;
  initialDepartures: Departure[];
}

export default function PublicTransportDisplay({
  initialStopNumber,
  initialDepartures,
}: PublicTransportDisplayProps) {
  const [stopNumber, setStopNumber] = React.useState<number>(initialStopNumber);
  const { items: departures } = useLiveCountdowns(
    stopNumber,
    getDeparturesAtStop,
    initialDepartures,
  );
  const [currentStops, setCurrentStops] =
    React.useState<{ name: string; stopId: number; distance?: number }[]>(
      featuredStops,
    );
  const [isLocationMode, setIsLocationMode] = React.useState(false);

  async function handleLocationFound(position: GeolocationPosition) {
    let nearest;
    try {
      nearest = await findNearestStations(position, 3);
    } catch (error) {
      console.error("Failed to load stops:", error);
      return;
    }

    // Convert nearest stations to the same format as featured stops
    const nearestStops = nearest.map((station) => ({
      name:
        station.short_name.length > 14
          ? station.short_name.substring(0, 13) + "..."
          : station.short_name,
      stopId: station.id,
      distance: station.distance,
    }));

    setCurrentStops(nearestStops);
    setIsLocationMode(true);

    // Automatically select the nearest station
    if (nearest.length > 0) setStopNumber(nearest[0].id);
  }

  function handleRevertToOriginal() {
    setCurrentStops(featuredStops);
    setIsLocationMode(false);
    setStopNumber(defaultStop.stopId);
  }

  function handleLocationError(error: string) {
    console.error("Location error:", error);
    // You could show a toast notification here
  }

  return (
    <div className="my-2">
      <div className="mb-2 flex items-center gap-2">
        <Tabs
          value={stopNumber.toString()}
          onValueChange={(value) => setStopNumber(+value)}
          className="flex-1"
        >
          <TabsList className="w-full">
            {currentStops.map((stop) => (
              <TabsTrigger key={stop.stopId} value={stop.stopId.toString()}>
                {stop.name}
                {stop.distance !== undefined && (
                  <span className="text-muted-foreground text-xs">
                    ({Math.round(stop.distance)}m)
                  </span>
                )}
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
      <DepartureList departures={departures} />
    </div>
  );
}
