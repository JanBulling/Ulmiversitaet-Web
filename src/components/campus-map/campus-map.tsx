"use client";

import dynamic from "next/dynamic";
import { CampusMapProps } from "./map";

const LazyMap = dynamic(() => import("./map"), {
  ssr: false,
  loading: () => <p>Loading...</p>,
});

export default function CampusMap({ ...props }: CampusMapProps) {
  return <LazyMap {...props} />;
}
