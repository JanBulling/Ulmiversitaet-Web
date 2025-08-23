import { Departure } from "./public-transport.type";

const BASE_URL = "https://api.swu.de/mobility/v1/";

export async function getDeparturesAtStop(
  stopNumber: number,
  limit?: number,
): Promise<Departure[] | null> {
  const response = await fetch(
    `${BASE_URL}/stop/passage/Departures?StopNumber=${stopNumber}&Limit=${limit ?? 8}`,
  );

  if (!response.ok) return null;

  const responseJson = await response.json();

  try {
    const departuresApiData = responseJson["StopPassage"]["DepartureData"];

    const departures: Departure[] = departuresApiData.map(
      /* eslint-disable @typescript-eslint/no-explicit-any */
      (apiDep: any) =>
        ({
          route: apiDep["RouteName"],
          directionText: apiDep["DepartureDirectionText"],
          scheduledTime: new Date(apiDep["DepartureTimeScheduled"]),
          actualTime: new Date(apiDep["DepartureTimeActual"]),
          countdown: +apiDep["DepartureCountdown"],
          deviation: +apiDep["DepartureDeviation"],
        }) satisfies Departure,
    );

    return departures;
  } catch {
    console.error(
      "[getDeparturesAtStop]",
      "Parsing Error - Unexpected API format",
    );
    return null;
  }
}
