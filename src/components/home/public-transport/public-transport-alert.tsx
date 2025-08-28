"use client";

import { useEffect, useState } from "react";
import { getUnplannedAlert, ApiError, ParsingError } from "@/lib/public-transport/swu-api";
import { PassengerAlertData, AlertStatus } from "@/lib/public-transport/public-transport.type";
import { Alert, AlertDescription, AlertTitle } from "@/ui/alert";
import { Icons } from "@/ui/icons";
import { Skeleton } from "@/ui/skeleton";
import { TriangleAlert } from "lucide-react";

export default function PublicTransportAlert() {
  const [alertData, setAlertData] = useState<PassengerAlertData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAlert() {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getUnplannedAlert();
        setAlertData(data);
      } catch (err) {
        if (err instanceof ApiError || err instanceof ParsingError) {
          setError(err.message);
        } else {
          setError("An unexpected error occurred while fetching alerts.");
        }
        setAlertData(null); // Clear previous alert data on error
      } finally {
        setIsLoading(false);
      }
    }

    fetchAlert();
    const interval = setInterval(fetchAlert, 60000); // Fetch every 60 seconds

    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return <Skeleton className="h-12 w-full" />;
  }

  if (error) {
    return (
      <Alert variant="destructive" className="mb-4">
        <TriangleAlert className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <Alert variant={alertData?.CurrentStatus === AlertStatus.OK || alertData?.CurrentStatus === AlertStatus.NoResult ? "default" : "destructive"}>
      <Icons.alertTriangle className={`h-4 w-4 ${alertData?.CurrentStatus === AlertStatus.OK || alertData?.CurrentStatus === AlertStatus.NoResult ? "text-green-500" : "text-red-500"}`} />
      <AlertTitle>{alertData?.AlertTitle || (alertData?.CurrentStatus === AlertStatus.NoResult ? "Keine Störungen" : "Aktuelle Störung")}</AlertTitle>
      <AlertDescription className={alertData?.CurrentStatus === AlertStatus.OK || alertData?.CurrentStatus === AlertStatus.NoResult ? "text-green-600" : "text-red-600"}>
        {alertData?.AlertData || (alertData?.CurrentStatus === AlertStatus.NoResult ? "Aktuell keine Störung." : alertData?.CurrentStatus)}
      </AlertDescription>
    </Alert>
  );
}
