"use client";

import * as React from "react";
import { Button } from "@/ui/button";
import { getCurrentPosition, GeolocationPosition } from "@/lib/geolocation";
import { Loader2, MapPin, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface LocationButtonProps {
    onLocationFound?: (position: GeolocationPosition) => void;
    onError?: (error: string) => void;
    onRevert?: () => void;
    isLocationMode?: boolean;
    className?: string;
    size?: "sm" | "md" | "lg";
}

export default function LocationButton({
    onLocationFound,
    onError,
    onRevert,
    isLocationMode = false,
    className,
    size = "md",
}: LocationButtonProps) {
    const [isLoading, setIsLoading] = React.useState(false);

    const handleClick = async () => {
        if (isLocationMode) {
            // If in location mode, revert to original stations
            onRevert?.();
        } else {
            // If not in location mode, get location
            setIsLoading(true);

            try {
                const position = await getCurrentPosition({
                    enableHighAccuracy: true,
                    timeout: 15000, // Increased for iOS Safari
                    maximumAge: 60000, // 1 minute - better iOS compatibility
                });

                onLocationFound?.(position);
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : "Unable to retrieve your location";
                onError?.(errorMessage);
            } finally {
                setIsLoading(false);
            }
        }
    };

    const sizeClasses = {
        sm: "size-8",
        md: "size-10",
        lg: "size-12"
    };

    const iconSizes = {
        sm: "size-4",
        md: "size-5",
        lg: "size-6"
    };

    return (
        <Button
            variant="outline"
            size="icon"
            onClick={handleClick}
            disabled={isLoading}
            className={cn(
                "relative",
                sizeClasses[size],
                className
            )}
            title={isLocationMode ? "Revert to original stations" : "Find nearest stations using your location"}
        >
            {isLoading ? (
                <Loader2 className={cn("animate-spin", iconSizes[size])} />
            ) : isLocationMode ? (
                <X className={iconSizes[size]} />
            ) : (
                <MapPin className={iconSizes[size]} />
            )}
        </Button>
    );
}
