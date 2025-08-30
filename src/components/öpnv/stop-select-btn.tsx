"use client";

import * as React from "react";

import { Popover, PopoverContent, PopoverTrigger } from "@/ui/popover";
import { Button } from "@/ui/button";

import allStops from "@/content/public-transport/allStops.json";
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/ui/command";
import { cn } from "@/lib/utils";
import { defaultStop } from "@/content/public-transport/config";

interface StopSelectorButtonProps {
  stopId?: number;
  onStopIdChange?: (stopId: number) => void;
}

export default function StopSelectorButton({
  stopId,
  onStopIdChange,
}: StopSelectorButtonProps) {
  const [open, setOpen] = React.useState(false);

  const currentStop = allStops.find((stop) => stop.id === stopId);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[300px] justify-between"
        >
          {currentStop ? currentStop.name : "Haltestelle auswählen..."}
          <ChevronsUpDownIcon className="ml-2" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Haltestelle suchen..." />
          <CommandList>
            <CommandEmpty>Haltestelle nicht gefunden.</CommandEmpty>
            {allStops.map((stop) => (
              <CommandItem
                key={stop.id}
                value={stop.name}
                onSelect={(newValue) => {
                  const selectedStop = allStops.find(
                    (stop) => stop.name === newValue,
                  );
                  onStopIdChange?.(selectedStop?.id ?? defaultStop.stopId);
                  setOpen(false);
                }}
              >
                <CheckIcon
                  className={cn(
                    "mr-2 h-4 w-4",
                    stopId === stop.id ? "opacity-100" : "opacity-0",
                  )}
                />
                {stop.name}
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
