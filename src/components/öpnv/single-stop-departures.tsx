"use client";

import { Departure } from "@/lib/public-transport/public-transport.type";
import * as React from "react";
import { getDeparturesAtStop } from "@/lib/public-transport/swu-api";
import { useLiveCountdowns } from "@/hooks/use-live-countdowns";
import DepartureList from "./departure-list";
import StopSelectorButton from "./stop-select-btn";

const fetchDepartures = (stopNumber: number) =>
  getDeparturesAtStop(stopNumber, 12);

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
  const { items: departures } = useLiveCountdowns(
    stopNumber,
    fetchDepartures,
    initialDepartures,
  );

  function selectStop(stopId: number) {
    setStopNumber(stopId);
    // Keep the stop in the URL so refreshing or sharing the page keeps it
    const params = new URLSearchParams(window.location.search);
    params.set("stop-id", stopId.toString());
    window.history.replaceState(null, "", `?${params}`);
  }

  return (
    <div className="bg-card border-y px-4 py-4 md:border">
      <div className="flex items-center justify-center">
        <StopSelectorButton
          stopId={stopNumber}
          onStopIdChange={selectStop}
        />
      </div>

      <DepartureList
        departures={departures}
        onVehicleClick={onVehicleClick}
        selectedVehicle={vehicleId}
      />
    </div>
  );
}
