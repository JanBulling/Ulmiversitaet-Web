import { Departure, PassengerAlertData } from "./public-transport.type";
import { VehiclePassage, VehicleTripData } from "./vehicle-passage.type";

const BASE_URL = process.env.NEXT_PUBLIC_SWU_API_BASE_URL || "https://api.swu.de/mobility/v1/";

export class ApiError extends Error {
  constructor(message: string, public status: number) {
    super(message);
    this.name = "ApiError";
  }
}

export class ParsingError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ParsingError";
  }
}

export async function getDeparturesAtStop(
  stopNumber: number,
  limit?: number,
): Promise<Departure[]> {
  const response = await fetch(
    `${BASE_URL}/stop/passage/Departures?StopNumber=${stopNumber}&Limit=${limit ?? 8}`,
  );

  if (!response.ok) {
    throw new ApiError(`Failed to fetch departures: ${response.statusText}`, response.status);
  }

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
          vehicleNumber: +apiDep["VehicleNumber"],
        }) satisfies Departure,
    );

    return departures;
  } catch (error) {
    console.error(
      "[getDeparturesAtStop]",
      "Parsing Error - Unexpected API format",
      error,
    );
    throw new ParsingError("Failed to parse departures data.");
  }
}

export async function getVehiclePassage(
  vehicleNumber: number,
  range?: string,
): Promise<VehiclePassage> {
  const rangeParam = range ? `&Range=${range}` : '';
  const response = await fetch(
    `${BASE_URL}/vehicle/trip/Passage?VehicleNumber=${vehicleNumber}${rangeParam}`,
  );

  if (!response.ok) {
    throw new ApiError(`Failed to fetch vehicle passage: ${response.statusText}`, response.status);
  }

  const responseJson = await response.json();

  try {
    const vehiclePassage: VehiclePassage = responseJson["VehiclePassage"];
    return vehiclePassage;
  } catch (error) {
    console.error(
      "[getVehiclePassage]",
      "Parsing Error - Unexpected API format",
      error,
    );
    throw new ParsingError("Failed to parse vehicle passage data.");
  }
}

export async function getUnplannedAlert(): Promise<PassengerAlertData> {
  const response = await fetch(
    `${BASE_URL}/passenger/alert/UnplannedAlert?ContentScope=minimal`,
  );

  if (!response.ok) {
    throw new ApiError(`Failed to fetch unplanned alert: ${response.statusText}`, response.status);
  }

  const responseJson = await response.json();

  try {
    const passengerAlert: PassengerAlertData = responseJson["PassengerAlert"];
    return passengerAlert;
  } catch (error) {
    console.error(
      "[getUnplannedAlert]",
      "Parsing Error - Unexpected API format",
      error,
    );
    throw new ParsingError("Failed to parse unplanned alert data.");
  }
}
