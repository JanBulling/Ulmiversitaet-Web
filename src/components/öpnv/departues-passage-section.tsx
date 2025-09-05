"use client";

import { Departure } from "@/lib/public-transport/public-transport.type";
import * as React from "react";
import SingleStopDepartures from "./single-stop-departures";
import VehiclePassage from "./vehicle-passage";

interface DeparturePassageSectionProps {
  initialStopNumber: number;
  initialDepartures: Departure[];
}

export default function DeparturePassageSection({
  initialStopNumber,
  initialDepartures,
}: DeparturePassageSectionProps) {
  const [vehicleId, setVehicleId] = React.useState<number>();

  return (
    <div className="my-8 grid h-min items-start gap-4 md:grid-cols-2">
      <SingleStopDepartures
        initialDepartures={initialDepartures}
        initialStopNumber={initialStopNumber}
        onVehicleClick={setVehicleId}
        vehicleId={vehicleId}
      />
      <VehiclePassage vehicleNumber={vehicleId} />
    </div>
  );
}
