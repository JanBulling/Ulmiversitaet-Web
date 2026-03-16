export interface GeolocationPosition {
    latitude: number;
    longitude: number;
    accuracy: number;
}

export interface GeolocationError {
    code: number;
    message: string;
}

export interface GeolocationOptions {
    enableHighAccuracy?: boolean;
    timeout?: number;
    maximumAge?: number;
}

/**
 * Gets the user's current position using the browser's geolocation API
 * @param options - Optional configuration for geolocation request
 * @returns Promise that resolves with position data or rejects with error
 */
export async function getCurrentPosition(
    options: GeolocationOptions = {}
): Promise<GeolocationPosition> {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            const error: GeolocationError = {
                code: 0,
                message: "Geolocation not supported by this browser"
            };
            reject(error);
            return;
        }

        const defaultOptions: PositionOptions = {
            enableHighAccuracy: true,
            timeout: 15000, // Increased for iOS Safari
            maximumAge: 60000, // 1 minute - reduced for better iOS compatibility
            ...options
        };

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const result: GeolocationPosition = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    accuracy: position.coords.accuracy
                };
                resolve(result);
            },
            (error) => {
                const geolocationError: GeolocationError = {
                    code: error.code,
                    message: getErrorMessage(error.code)
                };
                reject(geolocationError);
            },
            defaultOptions
        );
    });
}

/**
 * Gets a human-readable error message for geolocation error codes
 * @param code - The error code from the geolocation API
 * @returns Human-readable error message
 */
function getErrorMessage(code: number): string {
    switch (code) {
        case 1:
            return "Permission denied - Please allow location access in your browser settings";
        case 2:
            return "Position unavailable - Location services may be disabled or unavailable";
        case 3:
            return "Timeout - Location request timed out. Please try again";
        default:
            return "Unable to retrieve your location. Please check your location settings";
    }
}

/**
 * Simple function that logs the user's location to console (similar to your example)
 * @param options - Optional configuration for geolocation request
 */
export async function logCurrentPosition(
    options: GeolocationOptions = {}
): Promise<void> {
    try {
        const position = await getCurrentPosition(options);
        console.log(`Latitude: ${position.latitude}, Longitude: ${position.longitude}, Accuracy: ${position.accuracy}m`);
    } catch (error) {
        if (error instanceof Error) {
            console.log(`Unable to retrieve your location: ${error.message}`);
        } else {
            console.log("Unable to retrieve your location");
        }
    }
}
