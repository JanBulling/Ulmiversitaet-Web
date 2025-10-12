import DeparturePassageSection from "@/components/öpnv/departues-passage-section";
import PassengerAlert from "@/components/öpnv/passenger-alert";
import { defaultStop } from "@/content/public-transport/config";
import SiteLayout from "@/layouts/site-layout";
import { getDeparturesAtStop } from "@/lib/public-transport/swu-api";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Echtzeit ÖPNV",
  description:
    "Echtzeitdaten für den öffentlichen Nahverkehr in Ulm und Neu-Ulm",
};

export default async function PublicTransportPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const stopIdParam = (await searchParams)["stop-id"];
  const stopId: number = Array.isArray(stopIdParam)
    ? parseInt(stopIdParam[0])
    : stopIdParam
      ? parseInt(stopIdParam)
      : defaultStop.stopId;

  const initialDepartures = await getDeparturesAtStop(stopId, 12);

  return (
    <SiteLayout className="px-0 md:px-4">
      <PassengerAlert />

      <DeparturePassageSection
        initialDepartures={initialDepartures}
        initialStopNumber={stopId}
      />
    </SiteLayout>
  );
}
