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
  let response: Response;

  try {
    const url = `${BASE_URL}/stop/passage/Departures?StopNumber=${stopNumber}&Limit=${limit ?? 8}`;
    response = await fetch(url);
  } catch (error) {
    console.error("[getDeparturesAtStop]", "Fetch Error", error);
    throw new ApiError("Unable to reach the API", 0);
  }

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
  let response: Response;

  try {
    const url = `${BASE_URL}/vehicle/trip/Passage?VehicleNumber=${vehicleNumber}&Range=${range ?? ""}`;
    response = await fetch(url);
  } catch (error) {
    console.error("[getVehiclePassage]", "Fetch Error", error);
    throw new ApiError("Unable to reach the API", 0);
  }

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
          scheduledTime: new Date(apiPas["ArrivalTimeScheduled"]),
          actualTime: new Date(apiPas["ArrivalTimeActual"]),
          countdown: +apiPas["ArrivalCountdown"],
          deviation: +apiPas["ArrivalDeviation"],
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
  let response: Response;

  try {
    const url = `${BASE_URL}/passenger/alert/UnplannedAlert?ContentScope=minimal`;
    response = await fetch(url);
  } catch (error) {
    console.error("[getUnplannedAlert]", "Fetch Error", error);
    throw new ApiError("Unable to reach the API", 0);
  }

  if (!response.ok) {
    throw new ApiError(
      `Failed to fetch unplanned alert: ${response.statusText}`,
      response.status,
    );
  }

  const responseJson = await response.json();

  try {
    const alertApiData = responseJson["PassengerAlert"];

    const apiStatus =
      alertApiData["CurrentStatus"] === "no result found" ? "OK" : "DISRUPTION";

    const status =
      alertApiData["AlertData"] !== undefined ? "DISRUPTION" : apiStatus;

    const alertDataResponse: string | undefined = alertApiData["AlertData"];
    const alertData = alertDataResponse
      ?.trim()
      ?.split("+++")
      .map((s: string) => s.trim());

    const departures: PassengerAlert = {
      status: status,
      timestamp: new Date(alertApiData["CurrentTimestamp"]),
      title: alertApiData["AlertTitle"],
      data: alertData,
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
