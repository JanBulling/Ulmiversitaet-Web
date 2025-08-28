import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/ui/sheet";
import { Button } from "@/ui/button";
import allStops from "@/config/allStops.json";
import { publicTransportStops } from "@/config/public-transport";
import { ListFilter, Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface StopSelectorProps {
  onSelectStop: (stopId: string) => void;
  currentStopId: string;
}

interface Stop {
  id: string;
  name: string;
  lat: number;
  long: number;
}

export default function StopSelector({ onSelectStop, currentStopId }: StopSelectorProps) {
  const [stops, setStops] = useState<Stop[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    setStops(allStops as Stop[]);
  }, []);

  // Check if current stop is a hardcoded/preset stop
  const isHardcodedStop = publicTransportStops.some(stop => stop.value === currentStopId);
  
  // Get the button text based on whether it's a hardcoded stop or not
  const getButtonText = () => {
    if (isHardcodedStop) {
      return "Mehr";
    }
    const currentStop = stops.find((stop) => stop.id === currentStopId);
    return currentStop?.name || "Select a Stop";
  };

  // Filter stops based on search query
  const filteredStops = stops.filter(stop =>
    stop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    stop.id.includes(searchQuery)
  );

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="gap-2 flex-1">
          <ListFilter className="size-4" />
          <span className="hidden sm:inline">
            {getButtonText()}
          </span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Haltestelle auswählen</SheetTitle>
          <SheetDescription>
            Wähle eine Haltestella aus, um die dortigen Abfahrten anzuzeigen.
          </SheetDescription>
        </SheetHeader>
        <div className="mt-4 space-y-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground size-4" />
            <input
              type="text"
              placeholder="Haltestelle suchen..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-input bg-background rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
            />
          </div>
          
          {/* Stops List */}
          <div className="max-h-[calc(100svh-200px)] overflow-y-auto pr-2">
            <ul className="space-y-2">
              {filteredStops.length > 0 ? (
                filteredStops.map((stop) => (
                  <li key={stop.id}>
                    <Button
                      variant="ghost"
                      className={cn(
                        "w-full justify-start",
                        currentStopId === stop.id && "bg-muted hover:bg-muted"
                      )}
                      onClick={() => onSelectStop(stop.id)}
                    >
                      {stop.name}
                    </Button>
                  </li>
                ))
              ) : (
                <li className="text-center text-muted-foreground py-4">
                  No stops found matching "{searchQuery}"
                </li>
              )}
            </ul>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
