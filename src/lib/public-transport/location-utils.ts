import allStops from "@/content/public-transport/allStops.json";
import { GeolocationPosition } from "@/lib/geolocation";

export interface StopWithDistance {
    id: number;
    name: string;
    short_name: string;
    lat: number;
    long: number;
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
    // Simple difference in degrees
    const dLat = lat2 - lat1;
    const dLon = lon2 - lon1;

    // Convert to meters (1 degree ≈ 111,320 meters)
    const x = dLon * 111320;
    const y = dLat * 111320;

    // Euclidean distance
    return Math.sqrt(x * x + y * y);
}

/**
 * Find the nearest stations to a given location
 * @param position - User's geolocation position
 * @param count - Number of nearest stations to return (default: 3)
 * @param maxDistance - Maximum distance in meters (default: 1000m = 1km)
 * @returns Array of stops with distance information, sorted by distance
 */
export function findNearestStations(
    position: GeolocationPosition,
    count: number = 3,
    maxDistance: number = 1000
): StopWithDistance[] {
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

/**
 * Format distance for display
 * @param distance - Distance in meters
 * @returns Formatted distance string
 */
export function formatDistance(distance: number): string {
    if (distance < 1000) {
        return `${Math.round(distance)}m`;
    } else {
        return `${(distance / 1000).toFixed(1)}km`;
    }
}
