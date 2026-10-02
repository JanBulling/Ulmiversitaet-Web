import allStops from "@/content/public-transport/allStops.json";
import { ApiError, ParsingError } from "../error";
import {
  Departure,
  Passage,
  passageStatusMap,
  PassengerAlert,
  Stop,
} from "./public-transport.type";

const BASE_URL = "https://api.swu.de/mobility/v1";

/* eslint-disable @typescript-eslint/no-explicit-any */

// The API always answers HTTP 200 and wraps the payload in one root object
// (e.g. {"StopPassage": {...}}). Returns that inner object.
async function swuGet(path: string): Promise<any> {
  let response: Response;

  try {
    response = await fetch(`${BASE_URL}${path}`, { cache: "no-store" });
  } catch (error) {
    console.error("[swuGet]", path, "Fetch Error", error);
    throw new ApiError("Unable to reach the API", 0);
  }

  if (!response.ok)
    throw new ApiError(
      `Failed to fetch ${path}: ${response.statusText}`,
      response.status,
    );

  const json = await response.json();
  return Object.values(json)[0];
}

// A single result comes back as an object instead of a list, and an empty
// result drops the data key entirely.
function asArray<T>(x: T | T[] | null | undefined): T[] {
  return x == null ? [] : Array.isArray(x) ? x : [x];
}

const shortNameByName = new Map(allStops.map((s) => [s.name, s.short_name]));

export async function getStops(): Promise<Stop[]> {
  const data = await swuGet("/stop/attributes/BaseData?ContentScope=minimal");

  return asArray<any>(data?.StopData).map((s) => ({
    id: s.StopNumber,
    name: s.StopName,
    short_name: shortNameByName.get(s.StopName) ?? s.StopName,
    lat: s.StopCoordinates.Latitude,
    long: s.StopCoordinates.Longitude,
  }));
}

async function getRouteCategories(): Promise<Map<number, number>> {
  const data = await swuGet("/route/attributes/BaseData?ContentScope=minimal");
  return new Map(
    asArray<any>(data?.RouteData).map((r) => [r.RouteNumber, r.RouteCategory]),
  );
}

// Line colours are only exposed by the live Pattern endpoint of a running vehicle.
// ponytail: in-memory per process/tab, 1 h TTL so colour changes still come through
const colorCache = new Map<number, { color: string; expires: number }>();

async function getRouteColor(
  routeNumber: number,
  vehicleNumber: number,
): Promise<string | undefined> {
  const cached = colorCache.get(routeNumber);
  if (cached && cached.expires > Date.now()) return cached.color;

  try {
    const data = await swuGet(
      `/vehicle/trip/Pattern?VehicleNumber=${vehicleNumber}`,
    );
    const color: string | undefined = data?.RouteColor || undefined;
    if (color && +data.RouteNumber === routeNumber)
      colorCache.set(routeNumber, { color, expires: Date.now() + 3600_000 });
    return color;
  } catch {
    return undefined;
  }
}

export async function getDeparturesAtStop(
  stopNumber: number,
  limit?: number,
): Promise<Departure[]> {
  const [data, categories] = await Promise.all([
    swuGet(
      `/stop/passage/Departures?StopNumber=${stopNumber}&Limit=${limit ?? 8}`,
    ),
    getRouteCategories().catch(() => new Map<number, number>()),
  ]);

  // One vehicle per route is enough to look up the line colour
  const vehicleByRoute = new Map<number, number>();
  const apiDepartures = asArray<any>(data?.DepartureData);
  for (const d of apiDepartures)
    if (d.VehicleNumber) vehicleByRoute.set(d.RouteNumber, d.VehicleNumber);

  const colors = new Map(
    await Promise.all(
      [...vehicleByRoute].map(
        async ([route, vehicle]) =>
          [route, await getRouteColor(route, vehicle)] as const,
      ),
    ),
  );

  try {
    return apiDepartures.map(
      (apiDep) =>
        ({
          route: apiDep["RouteName"],
          routeNumber: apiDep["RouteNumber"],
          // VehicleCategory is null until a vehicle is assigned
          isTram:
            (apiDep["VehicleCategory"] ??
              categories.get(apiDep["RouteNumber"])) === 1,
          color: colors.get(apiDep["RouteNumber"]),
          directionText: apiDep["DepartureDirectionText"],
          scheduledTime: new Date(apiDep["DepartureTimeScheduled"]),
          actualTime: new Date(apiDep["DepartureTimeActual"]),
          countdown: +apiDep["DepartureCountdown"],
          deviation: +apiDep["DepartureDeviation"],
          vehicleNumber: +apiDep["VehicleNumber"],
        }) satisfies Departure,
    );
  } catch {
    // Return empty array instead of throwing error to show "no vehicles upcoming"
    return [];
  }
}

export async function getVehiclePassage(
  vehicleNumber: number,
  range?: string,
): Promise<Passage[]> {
  const data = await swuGet(
    `/vehicle/trip/Passage?VehicleNumber=${vehicleNumber}&Range=${range ?? ""}`,
  );

  try {
    return asArray<any>(data?.PassageData).map(
      (apiPas) =>
        ({
          name: apiPas["StopName"],
          status: passageStatusMap[+apiPas["Status"]],
          scheduledTime: new Date(apiPas["ArrivalTimeScheduled"]),
          actualTime: new Date(apiPas["ArrivalTimeActual"]),
          countdown: +apiPas["ArrivalCountdown"],
          deviation: +apiPas["ArrivalDeviation"],
        }) satisfies Passage,
    );
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
  const alertApiData = await swuGet(
    "/passenger/alert/UnplannedAlert?ContentScope=minimal",
  );

  try {
    const apiStatus =
      alertApiData["CurrentStatus"] === "no result found" ? "OK" : "DISRUPTION";

    const status =
      alertApiData["AlertData"] !== undefined ? "DISRUPTION" : apiStatus;

    const alertDataResponse: string | undefined = alertApiData["AlertData"];
    const alertData = alertDataResponse
      ?.trim()
      ?.split("+++")
      .map((s: string) => s.trim());

    return {
      status: status,
      timestamp: new Date(alertApiData["CurrentTimestamp"]),
      title: alertApiData["AlertTitle"],
      data: alertData,
    };
  } catch (error) {
    console.error(
      "[getUnplannedAlert]",
      "Parsing Error - Unexpected API format",
      error,
    );
    throw new ParsingError("Failed to parse unplanned alert data.");
  }
}
