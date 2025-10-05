/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import "leaflet/dist/leaflet.css";
import * as React from "react";

import { LayersControl, MapContainer, TileLayer } from "react-leaflet";
import LectureHallsMapLayer from "./layers/lecture-halls-layer";
import { Input } from "@/ui/input/input";
import { Button } from "@/ui/button";
import { SearchIcon } from "lucide-react";
import { useTheme } from "next-themes";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/select";
import BuildingsMapLayer from "./layers/buildings-layer";
import { Label } from "@/ui/input/label";

export interface CampusMapProps {
  lectureHalls: any;
  buildings: any;
}

// from https://leaflet-extras.github.io/leaflet-providers/preview/
const urls: Record<string, string> = {
  osm: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  osmde: "https://{s}.tile.openstreetmap.de/{z}/{x}/{y}.png",
  topology: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
  opnv: "https://tileserver.memomaps.de/tilegen/{z}/{x}/{y}.png",
  grayscale:
    "https://api.maptiler.com/maps/dataviz/{z}/{x}/{y}{r}.jpg?key=aiupYKVO4aLhrM0FpgZb",
  grayscaleDark:
    "https://api.maptiler.com/maps/dataviz-dark/{z}/{x}/{y}{r}.jpg?key=aiupYKVO4aLhrM0FpgZb",
  satellite:
    "https://api.maptiler.com/maps/satellite/{z}/{x}/{y}{r}.jpg?key=aiupYKVO4aLhrM0FpgZb",
};

const layers = ["Gebäude", "Hörsaal", "Wichtige Orte"];

export default function Map({ lectureHalls, buildings }: CampusMapProps) {
  const [search, setSearch] = React.useState("");
  const [selectedLayer, setSelectedLayer] = React.useState(layers[0]);
  const { resolvedTheme } = useTheme();

  return (
    <div className="mt-2">
      <div className="px-4">
        <Label htmlFor="select-layer">Auswählen, was angezeigt wird</Label>
        <Select value={selectedLayer} onValueChange={setSelectedLayer}>
          <SelectTrigger id="select-layer" className="mt-1 w-[280px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="z-1000">
            {layers.map((layer) => (
              <SelectItem key={layer} value={layer}>
                {layer}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="relative mt-4 h-[60vh] w-full md:h-[600px]">
        <form
          className="absolute inset-x-0 top-0 z-30 mx-auto my-2 flex max-w-[250px] gap-2 md:max-w-md"
          onSubmit={(e) => {
            e.preventDefault();
            setSearch(e.currentTarget.search.value);
            e.currentTarget.search.blur();
          }}
        >
          <Input
            id="search"
            placeholder={`Suche ${selectedLayer}`}
            className="text-sm"
          />
          <Button type="submit" className="hidden md:inline-flex">
            <SearchIcon />
            Suchen
          </Button>
          <Button type="submit" className="md:hidden" size="icon">
            <SearchIcon />
          </Button>
        </form>
        <MapContainer
          center={[48.423027872722514, 9.951618595381513]}
          zoom={16}
          minZoom={14}
          maxBounds={[
            [48.43226619468818, 9.927174585419886],
            [48.41457242406036, 9.972591040846176],
          ]}
          // scrollWheelZoom={false}
          className="h-full max-h-screen w-full"
        >
          <LayersControl position="topright">
            <LayersControl.BaseLayer
              checked={resolvedTheme === "light"}
              name="Hell"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.maptiler.com/copyright">MapTiler</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>'
                url={urls.grayscale}
                maxNativeZoom={18}
                maxZoom={21}
                minZoom={14}
              />
            </LayersControl.BaseLayer>
            <LayersControl.BaseLayer
              checked={resolvedTheme === "dark"}
              name="Dunkel"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.maptiler.com/copyright">MapTiler</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>'
                url={urls.grayscaleDark}
                maxNativeZoom={18}
                maxZoom={21}
                minZoom={14}
              />
            </LayersControl.BaseLayer>
            <LayersControl.BaseLayer name="Satellit">
              <TileLayer
                attribution='&copy; <a href="https://www.maptiler.com/copyright">MapTiler</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>'
                url={urls.satellite}
                maxNativeZoom={18}
                maxZoom={19}
                minZoom={14}
              />
            </LayersControl.BaseLayer>
          </LayersControl>
          {selectedLayer === layers[0] && (
            <BuildingsMapLayer buildings={buildings} searchTerm={search} />
          )}
          {selectedLayer === layers[1] && (
            <LectureHallsMapLayer
              lectureHalls={lectureHalls}
              searchTerm={search}
              minZoomLevel={18}
            />
          )}
        </MapContainer>
      </div>
    </div>
  );
}
