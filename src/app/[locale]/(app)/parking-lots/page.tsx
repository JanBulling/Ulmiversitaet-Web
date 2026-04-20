import BaseLayout from "@/layouts/base-layout";
import SiteLayout from "@/layouts/site-layout";
import { getAllParkingLots } from "@/lib/parking/partking-api";
import { Separator } from "@/ui/separator";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

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
  const t = await getTranslations("ParkingLotPage");

  const data = await getAllParkingLots();

  return (
    <SiteLayout className="px-0 md:px-4">
      <div className="px-4">
        <h1 className="text-2xl font-bold">{t("title")}</h1>
        <p className="text-muted-foreground">{t("description")}</p>
      </div>

      <Separator className="my-8" />

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

      <p className="text-muted-foreground mt-4 text-sm">
        Real-time data taken from{" "}
        <Link
          className="underline"
          href="http://tsu-app.rrooaarr.biz/front/mitarbeiter.html"
          target="_blank"
          rel="noopener noreferrer"
        >
          DUU
        </Link>
        .
      </p>
    </SiteLayout>
  );
}
