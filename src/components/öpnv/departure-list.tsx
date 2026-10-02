"use client";

import { useTranslations } from "next-intl";

import PublicTransportRouteIcon from "@/components/home/public-transport/pub-tra-icon";
import {
  countdownFormatter,
  delayFormatter,
  isDelayed,
} from "@/lib/public-transport/pub-tra-time-formatter";
import { Departure } from "@/lib/public-transport/public-transport.type";
import { cn } from "@/lib/utils";

interface DepartureListProps {
  departures: Departure[];
  onVehicleClick?: (vehicleNumber: number) => void;
  selectedVehicle?: number;
}

export default function DepartureList({
  departures,
  onVehicleClick,
  selectedVehicle,
}: DepartureListProps) {
  const t = useTranslations("HomePage.PublicTransport");

  if (departures.length === 0)
    return <p className="text-muted-foreground mt-4">{t("noDepartures")}</p>;

  return (
    <ol className="mt-2 divide-y">
      {departures.map((d, idx) => {
        const delayed = isDelayed(d.scheduledTime, d.actualTime);

        const isSelected =
          selectedVehicle === d.vehicleNumber && selectedVehicle !== 0;
        // Route numbers 101–199 are replacement buses (SEV) for tram lines
        const isReplacementBus = d.routeNumber >= 101 && d.routeNumber <= 199;

        // Spans only: the row may be rendered inside a <button>
        const content = (
          <>
            <PublicTransportRouteIcon
              route={d.route}
              isTram={d.isTram}
              color={d.color}
              className="size-7"
            />
            <span className="flex-1">
              <span className="flex items-center gap-2 text-sm font-semibold">
                {d.directionText}
                {isReplacementBus && (
                  <span
                    className="rounded border px-1 text-[10px] leading-4 font-semibold uppercase"
                    title={t("replacementBusHint")}
                  >
                    {t("replacementBus")}
                  </span>
                )}
              </span>
              <span
                className={cn(
                  "block text-xs",
                  delayed < 0
                    ? "text-success"
                    : delayed > 0
                      ? "text-destructive"
                      : "text-muted-foreground",
                )}
              >
                {delayFormatter(d.scheduledTime, d.actualTime, t("onTime"))}
              </span>
            </span>
            <span className="text-muted-foreground mx-2 font-mono font-semibold">
              {countdownFormatter(d.countdown, d.actualTime, t)}
            </span>
          </>
        );

        return (
          <li key={idx}>
            {onVehicleClick ? (
              <button
                type="button"
                aria-pressed={isSelected}
                className={cn(
                  "hover:bg-muted focus-visible:ring-ring flex w-full cursor-pointer items-center gap-4 py-2 text-left outline-none focus-visible:ring-2",
                  isSelected && "bg-muted",
                )}
                onClick={() => onVehicleClick(d.vehicleNumber)}
              >
                {content}
              </button>
            ) : (
              <div className="flex items-center gap-4 py-2">{content}</div>
            )}
          </li>
        );
      })}
    </ol>
  );
}
