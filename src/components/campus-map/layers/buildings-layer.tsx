/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";
import { GeoJSON, useMap } from "react-leaflet";

export default function BuildingsMapLayer({
  buildings,
  searchTerm,
  defaultColor = "#fab005",
  minZoomLevel = 17,
}: {
  buildings: any;
  searchTerm?: string;
  defaultColor?: string;
  minZoomLevel?: number;
}) {
  const map = useMap();
  const layersRef = React.useRef<any[]>([]);

  React.useEffect(() => {
    const updateLabels = () => {
      const zoom = map.getZoom();
      layersRef.current.forEach((layer) => {
        if (zoom >= minZoomLevel) {
          layer.openTooltip();
        } else {
          layer.closeTooltip();
        }
      });
    };

    map.on("zoomend", updateLabels);
    updateLabels();

    return () => {
      map.off("zoomend", updateLabels);
    };
  }, [map]);

  const onEachItem = (feature: any, layer: any) => {
    if (feature.properties && feature.properties.name) {
      layer.bindTooltip(feature.properties.name, {
        permanent: true,
        direction: "center",
        className: "font-bold",
      });
      layersRef.current.push(layer);
    }
  };

  const style = ({ properties }: any) => {
    const selectedColor = "#fa5252";
    const color =
      searchTerm &&
      properties.name.toLowerCase().includes(searchTerm.toLowerCase())
        ? selectedColor
        : defaultColor;

    return {
      fillColor: color,
      fillOpacity: 0.3,
      color: color,
      weight: 2,
      opacity: 1,
    };
  };

  return <GeoJSON data={buildings} style={style} onEachFeature={onEachItem} />;
}

function getPolygonCentroid(coords: number[][]): [number, number] {
  let x = 0,
    y = 0;
  coords.forEach(([lng, lat]) => {
    x += lng;
    y += lat;
  });
  const n = coords.length;
  return [y / n, x / n]; // [lat, lng]
}
