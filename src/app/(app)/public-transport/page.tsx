import PassengerAlert from "@/components/öpnv/passenger-alert";
import SingleStopDepartures from "@/components/öpnv/single-stop-departures";
import VehiclePassage from "@/components/öpnv/vehicle-passage";
import { defaultStop } from "@/content/public-transport/config";
import BaseLayout from "@/layouts/base-layout";
import { Passage } from "@/lib/public-transport/public-transport.type";
import {
  getDeparturesAtStop,
  getVehiclePassage,
} from "@/lib/public-transport/swu-api";

export default async function PublicTransportPage() {
  const initialDepartures = await getDeparturesAtStop(defaultStop.stopId, 12);

  let initialPassage: Passage[] = [];

  if (initialDepartures.length >= 1) {
    const firstVehicle = initialDepartures[0].vehicleNumber;
    initialPassage = await getVehiclePassage(firstVehicle);
  }

  return (
    <BaseLayout>
      <PassengerAlert />

      <div className="my-8 grid h-min items-start gap-4 md:grid-cols-2">
        <SingleStopDepartures
          initialDepartures={initialDepartures}
          initialStopNumber={defaultStop.stopId}
        />
        <VehiclePassage initialPassage={initialPassage} />
      </div>
    </BaseLayout>
  );
}
