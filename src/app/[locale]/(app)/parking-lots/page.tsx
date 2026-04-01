import DeparturePassageSection from "@/components/öpnv/departues-passage-section";
import PassengerAlert from "@/components/öpnv/passenger-alert";
import SiteLayout from "@/layouts/site-layout";
import { getAllParkingLots } from "@/lib/parking/partking-api";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Parkplätze",
  description: "Echtzeitdaten für Parkplätze an der Uni",
};

function parkingLotColor(free: number, total: number) {
  const percent = free / total;

  if (total < 0) {
    return "#999999";
  }

  if (percent <= 0.05 || free <= 2) {
    return "#f35b5b";
  } else if (percent <= 0.1) {
    return "#f3c27b";
  } else {
    return "#A7BF48";
  }
}

export default async function ParkinglotsPage() {
  const data = await getAllParkingLots();

  return (
    <SiteLayout className="px-0 md:px-4">
      {data.map((p) => (
        <div className="hover:bg-muted flex items-center justify-between px-4 py-4">
          <div>
            {p.name ? (
              <h4 className="font-bold">
                {p.name}{" "}
                <span className="text-muted-foreground text-sm font-normal">
                  ({p.code})
                </span>
              </h4>
            ) : (
              <h4 className="font-bold">{p.code}</h4>
            )}
            {p.total !== -1 && (
              <p className="text-muted-foreground text-xs">
                {p.total} Parkplätze
              </p>
            )}
          </div>
          {p.total !== -1 && (
            <p
              className="text-5xl font-extrabold"
              style={{ color: parkingLotColor(p.freeSpaces, p.total) }}
            >
              {p.freeSpaces}
            </p>
          )}
        </div>
      ))}
    </SiteLayout>
  );
}
