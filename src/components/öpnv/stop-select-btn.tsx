"use client";

import * as React from "react";
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";

import allStops from "@/content/public-transport/allStops.json";
import { Popover, PopoverContent, PopoverTrigger } from "@/ui/popover";
import { Drawer, DrawerContent, DrawerTrigger } from "@/ui/drawer";
import { Button } from "@/ui/button";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/ui/command";
import { cn } from "@/lib/utils";
import { defaultStop } from "@/content/public-transport/config";
import { useMediaQuery } from "@/hooks/use-media-query";

interface StopSelectorButtonProps {
  stopId?: number;
  onStopIdChange?: (stopId: number) => void;
}

export default function StopSelectorButton({
  stopId,
  onStopIdChange,
}: StopSelectorButtonProps) {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const currentStop = allStops.find((stop) => stop.id === stopId);

  if (isDesktop) {
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
          <StopList
            setOpen={setOpen}
            onStopIdChange={onStopIdChange}
            stopId={stopId}
          />
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[300px] justify-between"
        >
          {currentStop ? currentStop.name : "Haltestelle auswählen..."}
          <ChevronsUpDownIcon className="ml-2" />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mt-4 border-t">
          <StopList
            setOpen={setOpen}
            onStopIdChange={onStopIdChange}
            stopId={stopId}
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
}

function StopList({
  setOpen,
  stopId,
  onStopIdChange,
}: {
  setOpen: (open: boolean) => void;
  stopId?: number;
  onStopIdChange?: (stopId: number) => void;
}) {
  return (
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
  );
}
