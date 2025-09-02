"use client";

import {
  countdownFormatter,
  delayFormatter,
} from "@/lib/public-transport/pub-tra-time-formatter";
import { Passage } from "@/lib/public-transport/public-transport.type";
import { useSearchParams } from "next/navigation";

export default function VehiclePassage({
  initialPassage,
}: {
  initialPassage: Passage[];
}) {
  const searchParams = useSearchParams();
  const search = searchParams.get("vehicle");

  return (
    <div className="bg-card h-full overflow-y-auto border-y px-4 py-4 md:border">
      <ol className="">
        {initialPassage.map((p) => (
          <li key={p.countdown} className="flex items-center gap-4">
            <div className="flex-1">
              <h4 className="text-sm font-semibold">{p.name}</h4>
              <p className="text-xs">
                {delayFormatter(p.scheduledTime, p.actualTime)}
              </p>
            </div>
            <p className="text-muted-foreground mx-2 font-mono font-semibold">
              {countdownFormatter(p.countdown, p.actualTime)}
            </p>
            <p className="text-muted-foreground mx-2 font-mono font-semibold">
              {p.actualTime.toLocaleTimeString()}
            </p>
          </li>
        ))}
      </ol>
    </div>
  );
}
