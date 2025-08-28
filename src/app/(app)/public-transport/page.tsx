"use client";

import PublicTransportDisplayCopy from "@/components/home/public-transport/pub-tra-display-copy";
import { getDeparturesAtStop, getVehiclePassage, ApiError, ParsingError } from "@/lib/public-transport/swu-api";
import { Departure } from "@/lib/public-transport/public-transport.type";
import { TramFront } from "lucide-react";
import BaseLayout from "@/layouts/base-layout";
import { VehiclePassage } from "@/lib/public-transport/vehicle-passage.type";
import React, { useState, useEffect } from "react";
import VehicleRouteDisplay from "@/components/home/public-transport/vehicle-route-display";
import PublicTransportAlert from "@/components/home/public-transport/public-transport-alert";
import { Alert, AlertDescription, AlertTitle } from "@/ui/alert";
import { initialPublicTransportStop } from "@/config/public-transport";
import { TriangleAlert } from "lucide-react";
import StopSelector from "@/components/home/public-transport/stop-selector";


export default function PublicTransportPage() {
  const [departures, setDepartures] = useState<Departure[] | null>(null);
  const [selectedVehicleNumber, setSelectedVehicleNumber] = useState<number | null>(null);
  const [vehiclePassage, setVehiclePassage] = useState<VehiclePassage | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentStopId, setCurrentStopId] = useState<string>(initialPublicTransportStop);

  useEffect(() => {
    async function fetchInitialData() {
      try {
        const initialDepartures = await getDeparturesAtStop(+currentStopId);
        setDepartures(initialDepartures);

        if (initialDepartures && initialDepartures.length > 0) {
          // Find the next upcoming departure
          const now = new Date();
          const upcomingDepartures = initialDepartures.filter(
            (d) => new Date(d.actualTime) > now,
          ).sort((a, b) => new Date(a.actualTime).getTime() - new Date(b.actualTime).getTime());

          if (upcomingDepartures.length > 0) {
            setSelectedVehicleNumber(upcomingDepartures[0].vehicleNumber);
          }
        }
      } catch (err) {
        if (err instanceof ApiError || err instanceof ParsingError) {
          setError(err.message);
        } else {
          setError("An unexpected error occurred while fetching departures.");
        }
        setDepartures([]); // Clear departures on error
      }
    }
    fetchInitialData();
  }, [currentStopId]);

  useEffect(() => {
    async function fetchVehicleRoute() {
      if (selectedVehicleNumber) {
        try {
          const data = await getVehiclePassage(selectedVehicleNumber);
          setVehiclePassage(data);
        } catch (err) {
          if (err instanceof ApiError || err instanceof ParsingError) {
            setError(err.message);
          } else {
            setError("An unexpected error occurred while fetching vehicle route.");
          }
          setVehiclePassage(null);
        }
      } else {
        setVehiclePassage(null);
      }
    }
    fetchVehicleRoute();
  }, [selectedVehicleNumber]);

  const handleDepartureClick = (vehicleNumber: number) => {
    setSelectedVehicleNumber(vehicleNumber);
  };

  const handleStopSelect = (stopId: string) => {
    setCurrentStopId(stopId);
    setSelectedVehicleNumber(null); // Reset selected vehicle when stop changes
    setVehiclePassage(null); // Clear vehicle passage when stop changes
  };

  return (
    <BaseLayout className="space-y-8 md:space-y-8">
      <PublicTransportAlert />
      {error && (
        <Alert variant="destructive">
          <TriangleAlert className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <section className="grid grid-cols-1 gap-4 md:grid-cols-7">
        {/* Left box: 4/7 of screen width */}
        <div className="bg-card border-y px-4 py-4 md:border md:col-span-4 flex flex-col">
          <div className="flex items-center gap-4">
            <TramFront className="text-primary size-8" />
            <h2 className="flex-1 text-2xl font-bold">Echtzeit-ÖPNV</h2>
            <StopSelector onSelectStop={handleStopSelect} currentStopId={currentStopId} />
          </div>
          {departures ? (
            <PublicTransportDisplayCopy 
              initialStopNumber={+currentStopId}
              departures={departures}
              onDepartureClick={handleDepartureClick}
              selectedVehicleNumber={selectedVehicleNumber} // Pass selectedVehicleNumber
              onStopSelectFromTabs={handleStopSelect} // Pass the handler for tab selection
            />
          ) : (
            <p className="text-muted-foreground mt-4">Loading departures...</p>
          )}
        </div>
        {/* Right box: 3/7 of screen width */}
        <div className="bg-card border-y px-4 py-4 md:border md:col-span-3 flex flex-col static md:sticky md:top-4 md:self-start">
          <VehicleRouteDisplay vehiclePassage={vehiclePassage} />
        </div>
      </section>
    </BaseLayout>
  );
}
