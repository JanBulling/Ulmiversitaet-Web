import { ApiError, ParsingError } from "../error";
import {
  Departure,
  Passage,
  passageStatusMap,
  PassengerAlert,
} from "./public-transport.type";

const BASE_URL = "https://api.swu.de/mobility/v1";

export async function getDeparturesAtStop(
  stopNumber: number,
  limit?: number,
): Promise<Departure[]> {
  const url = `${BASE_URL}/stop/passage/Departures?StopNumber=${stopNumber}&Limit=${limit ?? 8}`;
  const response = await fetch(url);

  if (!response.ok)
    throw new ApiError(
      `Failed to fetch departures: ${response.statusText}`,
      response.status,
    );

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
): Promise<Passage[]> {
  const url = `${BASE_URL}/vehicle/trip/Passage?VehicleNumber=${vehicleNumber}&Range=${range ?? ""}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new ApiError(
      `Failed to fetch vehicle passage: ${response.statusText}`,
      response.status,
    );
  }

  const responseJson = await response.json();

  try {
    const vehiclePassageApiData = responseJson["VehiclePassage"]["PassageData"];

    const passages: Passage[] = vehiclePassageApiData.map(
      /* eslint-disable @typescript-eslint/no-explicit-any */
      (apiPas: any) =>
        ({
          name: apiPas["StopName"],
          status: passageStatusMap[+apiPas["Status"]],
          scheduledTime: new Date(apiPas["DepartureTimeScheduled"]),
          actualTime: new Date(apiPas["DepartureTimeActual"]),
          countdown: +apiPas["DepartureCountdown"],
          deviation: +apiPas["DepartureDeviation"],
        }) satisfies Passage,
    );

    return passages;
  } catch (error) {
    console.error(
      "[getVehiclePassage]",
      "Parsing Error - Unexpected API format",
      error,
    );
    throw new ParsingError("Failed to parse vehicle passage data.");
  }
}

export async function getPassengerAlert(): Promise<PassengerAlert> {
  const url = `${BASE_URL}/passenger/alert/UnplannedAlert?ContentScope=minimal`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new ApiError(
      `Failed to fetch unplanned alert: ${response.statusText}`,
      response.status,
    );
  }

  const responseJson = await response.json();

  try {
    const alertApiData = responseJson["PassengerAlert"];
    const status =
      alertApiData["CurrentStatus"] === "no result found" ? "OK" : "DISRUPTION";

    const departures: PassengerAlert = {
      currentStatus: status,
      timestamp: new Date(alertApiData["CurrentTimestamp"]),
      title: alertApiData["Title"],
      data: alertApiData["Data"],
    };

    return departures;
  } catch (error) {
    console.error(
      "[getUnplannedAlert]",
      "Parsing Error - Unexpected API format",
      error,
    );
    throw new ParsingError("Failed to parse unplanned alert data.");
  }
}
