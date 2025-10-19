"use client";

import * as React from "react";
import { Button } from "@/ui/button";
import { MapPin, Navigation } from "lucide-react";
import { cn } from "@/lib/utils";
import { StopWithDistance, formatDistance } from "@/lib/public-transport/location-utils";

interface NearestStationsDisplayProps {
    nearestStations: StopWithDistance[];
    onStationSelect?: (stopId: number) => void;
    className?: string;
}

export default function NearestStationsDisplay({
    nearestStations,
    onStationSelect,
    className,
}: NearestStationsDisplayProps) {
    if (nearestStations.length === 0) {
        return (
            <div className={cn("space-y-2", className)}>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Navigation className="size-4" />
                    <span>There are no stops within 1km of your location.</span>
                </div>
            </div>
        );
    }

    return (
        <div className={cn("space-y-2", className)}>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Navigation className="size-4" />
                <span>Nearest stations to your location:</span>
            </div>

            <div className="space-y-1">
                {nearestStations.map((station, index) => (
                    <Button
                        key={station.id}
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start gap-3 h-auto py-2"
                        onClick={() => onStationSelect?.(station.id)}
                    >
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                            <div className="flex items-center gap-1 text-xs text-muted-foreground min-w-0">
                                <span className="font-mono">#{index + 1}</span>
                                <MapPin className="size-3 flex-shrink-0" />
                                <span className="font-mono">{formatDistance(station.distance)}</span>
                            </div>
                            <span className="truncate text-left">
                                {station.name}
                            </span>
                        </div>
                    </Button>
                ))}
            </div>
        </div>
    );
}
