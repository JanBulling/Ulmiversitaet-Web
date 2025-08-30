import PassengerAlert from "@/components/öpnv/passenger-alert";
import SingleStopDepartures from "@/components/öpnv/single-stop-departures";
import { defaultStop } from "@/content/public-transport/config";
import BaseLayout from "@/layouts/base-layout";
import {
  getDeparturesAtStop,
  getVehiclePassage,
} from "@/lib/public-transport/swu-api";

export default async function PublicTransportPage() {
  const initialDepartures = await getDeparturesAtStop(defaultStop.stopId, 12);

  if (initialDepartures.length >= 1) {
    const firstVehicle = initialDepartures[0].vehicleNumber;
    const initialPassage = await getVehiclePassage(firstVehicle);
  }

  return (
    <BaseLayout>
      <PassengerAlert />

      <div className="my-8 grid md:grid-cols-2">
        <SingleStopDepartures
          initialDepartures={initialDepartures}
          initialStopNumber={defaultStop.stopId}
        />
        {/* <Passage /> */}
      </div>
    </BaseLayout>
  );
}
