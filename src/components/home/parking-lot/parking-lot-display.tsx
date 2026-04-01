"use client";

import * as React from "react";

import { getMainParkingLots, ParkingLotData } from "@/lib/parking/partking-api";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/ui/button";
import { mainLotsMobile } from "@/content/parking-lots/allParkingLots";

interface ParkingLotDisplayProps {
  initialData: ParkingLotData[];
}

function parkingLotColor(free: number, total: number) {
  const percent = free / total;

  if (percent <= 0.05 || free <= 2) {
    return "#f35b5b";
  } else if (percent <= 0.1) {
    return "#f3c27b";
  } else {
    return "#A7BF48";
  }
}

export default function ParkingLotDisplay({
  initialData,
}: ParkingLotDisplayProps) {
  const [data, setData] = React.useState<ParkingLotData[]>(initialData);

  async function fetchParkingLotData() {
    try {
      const newData = await getMainParkingLots();
      setData(newData);
    } catch (error) {
      console.error("Failed to fetch parking lot data", error);
    }
  }

  React.useEffect(() => {
    const updateInterval = setInterval(
      async () => await fetchParkingLotData(),
      60000,
    );

    return () => {
      clearInterval(updateInterval);
    };
  }, []);

  return (
    <div className="my-2">
      <ol className="mb-2 hidden items-center justify-between gap-2 px-1 md:flex">
        {data.map((d) => (
          <li key={d.id} className="flex flex-col items-center">
            <h4 className="font-semibold">
              {d.name}{" "}
              <span className="text-muted-foreground text-sm font-normal">
                ({d.code})
              </span>
            </h4>
            <p
              className="my-1 text-5xl font-extrabold"
              style={{ color: parkingLotColor(d.freeSpaces, d.total) }}
            >
              {d.freeSpaces}
            </p>
            <p className="text-muted-foreground text-xs">von {d.total}</p>
          </li>
        ))}
        <li>
          <Link href="/parking-lots">
            <Button variant="outline" size="icon">
              <ChevronRight />
            </Button>
          </Link>
        </li>
      </ol>
      <ol className="mb-2 flex items-center justify-between gap-2 px-1 md:hidden">
        {data
          .filter((p) => mainLotsMobile.includes(p.code))
          .map((d) => (
            <li key={d.id} className="flex flex-col items-center">
              <h4 className="font-semibold">
                {d.nameShort}{" "}
                <span className="text-muted-foreground text-sm font-normal">
                  ({d.code})
                </span>
              </h4>
              <p
                className="my-1 text-5xl font-extrabold"
                style={{ color: parkingLotColor(d.freeSpaces, d.total) }}
              >
                {d.freeSpaces}
              </p>
              <p className="text-muted-foreground text-xs">von {d.total}</p>
            </li>
          ))}
        <li>
          <Link href="/parking-lots">
            <Button variant="outline" size="icon">
              <ChevronRight />
            </Button>
          </Link>
        </li>
      </ol>
    </div>
  );
}
