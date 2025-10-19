import allStops from "@/content/public-transport/allStops.json";
import { GeolocationPosition } from "@/lib/geolocation";

export interface StopWithDistance {
    id: number;
    name: string;
    lat: number;
    long: number;
    distance: number; // in meters
}

/**
 * Calculate the distance between two points using the Haversine formula
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
    const R = 6371000; // Earth's radius in meters
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

/**
 * Find the nearest stations to a given location
 * @param position - User's geolocation position
 * @param count - Number of nearest stations to return (default: 3)
 * @returns Array of stops with distance information, sorted by distance
 */
export function findNearestStations(
    position: GeolocationPosition,
    count: number = 3
): StopWithDistance[] {
    const stopsWithDistance: StopWithDistance[] = allStops.map((stop) => ({
        id: stop.id,
        name: stop.name,
        lat: stop.lat,
        long: stop.long,
        distance: calculateDistance(
            position.latitude,
            position.longitude,
            stop.lat,
            stop.long
        ),
    }));

    // Sort by distance and return the nearest ones
    return stopsWithDistance
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
