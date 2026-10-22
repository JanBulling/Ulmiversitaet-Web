import { GeolocationPosition } from "@/lib/geolocation";
import { Stop } from "./public-transport.type";
import { getStops } from "./swu-api";

export interface StopWithDistance extends Stop {
    distance: number; // in meters
}

/**
 * Calculate the distance between two points using simple Euclidean distance
 * Suitable for small distances within 20km - treats Earth as flat
 * @param lat1 - Latitude of first point
 * @param lon1 - Longitude of first point
 * @param lat2 - Latitude of second point
 * @param lon2 - Longitude of second point
 * @returns Distance in meters
 */
function calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
): number {
    // Equirectangular approximation: 1° latitude ≈ 111,320 m,
    // 1° longitude shrinks with cos(latitude)
    const x = (lon2 - lon1) * 111320 * Math.cos((lat1 * Math.PI) / 180);
    const y = (lat2 - lat1) * 111320;

    return Math.sqrt(x * x + y * y);
}

/**
 * Find the nearest stations to a given location
 * @param position - User's geolocation position
 * @param count - Number of nearest stations to return (default: 3)
 * @param maxDistance - Maximum distance in meters (default: 10km)
 * @returns Array of stops with distance information, sorted by distance
 */
export async function findNearestStations(
    position: GeolocationPosition,
    count: number = 3,
    maxDistance: number = 10000
): Promise<StopWithDistance[]> {
    const allStops = await getStops();
    const stopsWithDistance: StopWithDistance[] = allStops.map((stop) => ({
        id: stop.id,
        name: stop.name,
        short_name: stop.short_name,
        lat: stop.lat,
        long: stop.long,
        distance: calculateDistance(
            position.latitude,
            position.longitude,
            stop.lat,
            stop.long
        ),
    }));

    // Filter by distance and sort by distance, then return the nearest ones
    return stopsWithDistance
        .filter(stop => stop.distance <= maxDistance)
        .sort((a, b) => a.distance - b.distance)
        .slice(0, count);
}
