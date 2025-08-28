"use client";

import { VehiclePassage, PassageData, PassageStatus } from "@/lib/public-transport/vehicle-passage.type";
import React, { useEffect, useState } from "react";
import { Skeleton } from "@/ui/skeleton";
import PublicTransportRouteIcon from "./pub-tra-icon";
import { countdownFormatter, isDelayed, delayFormatter } from "@/lib/public-transport/pub-tra-time-formatter";
import { cn } from "@/lib/utils";
import { getVehiclePassage, ApiError, ParsingError } from "@/lib/public-transport/swu-api";
import { Alert, AlertDescription, AlertTitle } from "@/ui/alert";
import { TriangleAlert } from "lucide-react";

interface VehicleRouteDisplayProps {
  vehiclePassage: VehiclePassage | null;
}

export default function VehicleRouteDisplay({
  vehiclePassage,
}: VehicleRouteDisplayProps) {
  const [currentVehiclePassage, setCurrentVehiclePassage] = useState<VehiclePassage | null>(vehiclePassage);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setCurrentVehiclePassage(vehiclePassage);
    if (!vehiclePassage) {
      setError(null);
    } else if (typeof vehiclePassage.VehicleNumber === 'undefined') {
      setError("Noch nicht im System.");
    } else if (vehiclePassage.VehicleNumber === null || vehiclePassage.VehicleNumber === 0) {
      setError("No vehicle selected or the route has not yet started.");
    } else {
      setError(null);
    }
  }, [vehiclePassage]);

  const [isFetchingData, setIsFetchingData] = useState(false);

  useEffect(() => {
    const updateInterval = setInterval(() => updateSecondCountdowns(), 1000);
    let fetchInterval: NodeJS.Timeout;

    const fetchNewVehiclePassageData = async () => {
      if (currentVehiclePassage?.VehicleNumber) {
        setIsFetchingData(true);
        try {
          const data = await getVehiclePassage(currentVehiclePassage.VehicleNumber, "Upcoming");
          setCurrentVehiclePassage(data);
          setError(null);
        } catch (err) {
          if (err instanceof ApiError || err instanceof ParsingError) {
            setError(err.message);
          } else {
            setError("An unexpected error occurred while fetching vehicle passage.");
          }
          setCurrentVehiclePassage(null);
        } finally {
          setIsFetchingData(false);
        }
      }
    };


    // Initial fetch if a vehicle is selected
    if (currentVehiclePassage?.VehicleNumber && !currentVehiclePassage.PassageData.length) {
      fetchNewVehiclePassageData();
    }

    fetchInterval = setInterval(fetchNewVehiclePassageData, 15000);

    return () => {
      clearInterval(updateInterval);
      clearInterval(fetchInterval);
    };
  }, [currentVehiclePassage?.VehicleNumber]); // Removed vehicleTripData from dependencies

  const isLoading = !currentVehiclePassage && isFetchingData;

  if (error) {
    return (
      <div className="mt">
        <Alert variant="destructive" className="mb-4">
          <TriangleAlert className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="mt-4 flex flex-col gap-2">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <div className="flex flex-col gap-2">
          <Skeleton className="h-12 w-full py-2" />
          <Skeleton className="h-12 w-full py-2" />
          <Skeleton className="h-12 w-full py-2" />
        </div>
      </div>
    );
  }

  function updateSecondCountdowns() {
    setCurrentVehiclePassage((current) => {
      if (!current) return null;
      return {
        ...current,
        PassageData: current.PassageData.map((cur) => ({
          ...cur,
          ArrivalCountdown: cur.ArrivalCountdown - 1,
          DepartureCountdown: cur.DepartureCountdown - 1,
        })),
      };
    });
  }

  const futureStops = currentVehiclePassage?.PassageData.filter(
    (stop) => stop.Status !== PassageStatus.Passed && stop.Status !== PassageStatus.Cancelled
  ) || [];

  const nextStop = futureStops.length > 0 ? futureStops[0] : null;

  return (
    <div className="mt">
      {error && (
        <Alert variant="destructive" className="mb-4">
          <TriangleAlert className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <div className="flex items-center gap-2 mb-4">
        <PublicTransportRouteIcon route={currentVehiclePassage?.RouteName || ""} className="size-7" />
        <div className="flex items-center gap-4 h-full">
            <h2 className="flex-1 text-2xl font-bold">
              {error === "No vehicle selected or the route has not yet started." ? "Unbekanntes Fahrzeug" : `Fahrzeug ${currentVehiclePassage?.VehicleNumber}`}
            </h2>
          </div>
         {nextStop && (
          <p
            className={cn(
              "text-xs font-semibold ml-2 text-right",
              isDelayed(new Date(nextStop.ArrivalTimeScheduled), new Date(nextStop.ArrivalTimeActual)) < 0
                ? "text-success"
                : isDelayed(new Date(nextStop.ArrivalTimeScheduled), new Date(nextStop.ArrivalTimeActual)) > 0
                  ? "text-destructive"
                  : "text-muted-foreground",
            )}
            style={{ flex: 1, textAlign: "right" }}
          >
            {delayFormatter(new Date(nextStop.ArrivalTimeScheduled), new Date(nextStop.ArrivalTimeActual))}
          </p>
        )}
      </div>
      <ul className="mt-2 divide-y max-h-[420px] overflow-y-auto pr-2 scrollbar-hide">
        {futureStops.length > 0 ? (
          futureStops.map((stop, idx) => (
            <li key={idx} className="flex items-center gap-4 py-2">
              <div className="flex-1">
                <p className="font-semibold">{stop.StopName}</p>
              </div>
              <p className="text-muted-foreground mx-2 font-mono font-semibold">
                {countdownFormatter(stop.ArrivalCountdown, new Date(stop.ArrivalTimeActual))}
              </p>
            </li>
          ))
        ) : (
          <p className="text-muted-foreground">Fahrt hat noch nicht begonnen.</p>
        )}
      </ul>
    </div>
  );
}
