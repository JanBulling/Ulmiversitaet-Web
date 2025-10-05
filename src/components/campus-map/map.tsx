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

export interface CampusMapProps {
  lectureHalls: any;
  buildings: any;
}

// from https://leaflet-extras.github.io/leaflet-providers/preview/
const urls: Record<string, string> = {
  oms: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  osmde: "https://{s}.tile.openstreetmap.de/{z}/{x}/{y}.png",
  grayscale_custom:
    "https://tile.jawg.io/1e8ee540-17ad-442c-8691-4adca97f27ad/{z}/{x}/{y}{r}.png?access-token=ieEEvH1lbKlND31leRzq0wNSN0BLvPQEXb9MzYBTzouHY5Hdhk6NCviRLDtDPr72",
  grayscale:
    "https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png",
  grayscaleDark:
    "https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png",
  satellite:
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
  watercolor:
    "https://tiles.stadiamaps.com/tiles/stamen_watercolor/{z}/{x}/{y}.jpg",
};

const layers = ["Gebäude", "Hörsaal", "Wichtige Orte"];

export default function Map({ lectureHalls, buildings }: CampusMapProps) {
  const [search, setSearch] = React.useState("");
  const [selectedLayer, setSelectedLayer] = React.useState(layers[0]);
  const { resolvedTheme } = useTheme();

  return (
    <div className="">
      <Select value={selectedLayer} onValueChange={setSelectedLayer}>
        <SelectTrigger className="w-[280px]">
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

      <form
        className="my-2 flex max-w-md gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          setSearch(e.currentTarget.search.value);
          e.currentTarget.search.blur();
          e.currentTarget.search.value = "";
        }}
      >
        <Input id="search" placeholder={`Suche ${selectedLayer}`} />
        <Button type="submit">
          <SearchIcon />
          Suchen
        </Button>
      </form>
      <div className="mt-4 h-[50vh] w-full md:h-[600px]">
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
              name="Graustufen"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url={urls.grayscale}
                maxNativeZoom={18}
                maxZoom={21}
                minZoom={14}
              />
            </LayersControl.BaseLayer>
            <LayersControl.BaseLayer
              checked={resolvedTheme === "dark"}
              name="Graustufen Dunkel"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url={urls.grayscaleDark}
                maxNativeZoom={18}
                maxZoom={21}
                minZoom={14}
              />
            </LayersControl.BaseLayer>
            <LayersControl.BaseLayer name="Satellit">
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url={urls.satellite}
                maxNativeZoom={18}
                maxZoom={19}
                minZoom={14}
              />
            </LayersControl.BaseLayer>
            <LayersControl.BaseLayer name="Wasserfarbe">
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url={urls.watercolor}
                maxNativeZoom={17}
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
