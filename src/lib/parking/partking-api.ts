import {
  MAIN_LOTS,
  ParkingLot,
  parkingLots,
} from "@/content/parking-lots/allParkingLots";
import { ApiError } from "../error";

const BASE_URL = "http://tsu-app.rrooaarr.biz/front/soap.php";

export async function getCarsOnParkingLot(
  parkingSpaceId: number,
): Promise<number> {
  let response: Response;

  try {
    const url = `${BASE_URL}?counterid=${parkingSpaceId}`;
    response = await fetch(url);
  } catch (error) {
    console.error("[getFreeParkingSpots]", "Fetch Error", error);
    throw new ApiError("Unable to reach API", 0);
  }

  if (!response.ok)
    throw new ApiError(
      `Failed to fetch free parking spaces: ${response.statusText}`,
      response.status,
    );

  const responseTxt = await response.text();
  return Number(responseTxt);
}

export type ParkingLotData = ParkingLot & {
  freeSpaces: number;
};

export async function getMainParkingLots(): Promise<ParkingLotData[]> {
  const result: ParkingLotData[] = [];
  for (const lot of MAIN_LOTS) {
    const cars = await getCarsOnParkingLot(lot.id);

    const freeSpace = Math.max(0, lot.total - cars);

    result.push({
      ...lot,
      freeSpaces: freeSpace,
    });
  }

  return result;
}

export async function getAllParkingLots(): Promise<ParkingLotData[]> {
  const result: ParkingLotData[] = [];
  for (const lot of parkingLots) {
    if (lot.id !== -1) {
      const cars = await getCarsOnParkingLot(lot.id);
      const freeSpace = Math.max(0, lot.total - cars);

      result.push({
        ...lot,
        freeSpaces: freeSpace,
      });
    }
  }

  return result;
}
