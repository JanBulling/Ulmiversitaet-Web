import { getMainParkingLots } from "@/lib/parking/partking-api";
import { cn } from "@/lib/utils";
import { ParkingCircle } from "lucide-react";
import { getTranslations } from "next-intl/server";
import ParkingLotDisplay from "./parking-lot-display";

export async function ParkingLotSection({
  className,
}: React.ComponentProps<"section">) {
  const t = await getTranslations("HomePage.ParkingLot");

  const parkingLots = await getMainParkingLots();

  return (
    <section className={cn("bg-card border-y px-4 py-4 md:border", className)}>
      <div className="flex items-center gap-4">
        <ParkingCircle className="text-primary size-6 md:size-8" />

        <h2 className="flex-1 text-xl font-bold md:text-2xl">{t("title")}</h2>
      </div>

      <ParkingLotDisplay initialData={parkingLots} />
    </section>
  );
}
