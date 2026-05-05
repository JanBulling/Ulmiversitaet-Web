type LocationKey = "ulm" | "garmisch" | "innsbruck";

type Location = {
  lat: number;
  lon: number;
  alt: number;
};

type WeatherStation = {
  location: LocationKey;
  temperature: number;
  humidity: number;
  pressure: number;
  dewPoint: number;
  visibility: number;
  precipitation: number;
  windSpeed: number;
  windDirection: number;
  cloudCover: number;
  cloudCoverLow: number;
  cloudCoverMid: number;
  cloudCoverHigh: number;
};

type EvaluationResult = {
  verdictKey:
    | "veryLikely"
    | "likely"
    | "possible"
    | "unlikely"
    | "no";
  score: number;
  scoreNote: string;
  factors: string[];
};

const LOCATIONS: Record<LocationKey, Location> = {
  ulm: { lat: 48.3984, lon: 9.9908, alt: 480 },
  garmisch: { lat: 47.4912, lon: 11.0956, alt: 708 },
  innsbruck: { lat: 47.2692, lon: 11.4041, alt: 582 },
};

const BASE_URL = "https://api.open-meteo.com/v1/forecast";
const LAPSE = 0.12;

const CURRENT_FIELDS = [
  "temperature_2m",
  "relative_humidity_2m",
  "surface_pressure",
  "dew_point_2m",
  "visibility",
  "precipitation",
  "wind_speed_10m",
  "wind_direction_10m",
  "cloud_cover",
  "cloud_cover_low",
  "cloud_cover_mid",
  "cloud_cover_high",
] as const;

function scoreThreshold(
  value: number,
  thresholds: Array<[number, number]>,
): number {
  const match = thresholds.find(([limit]) => value <= limit);
  return match ? match[1] : thresholds[thresholds.length - 1][1];
}

function normalizedPressure(pressure: number, altitude: number): number {
  return pressure + LAPSE * altitude;
}

async function fetchStation(
  location: LocationKey,
  coords: Location,
): Promise<WeatherStation> {
  const url = new URL(BASE_URL);
  url.searchParams.set("latitude", String(coords.lat));
  url.searchParams.set("longitude", String(coords.lon));
  url.searchParams.set("current", CURRENT_FIELDS.join(","));
  url.searchParams.set("wind_speed_unit", "kmh");
  url.searchParams.set("timezone", "Europe/Berlin");

  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Open-Meteo failed for ${location}: ${response.status}`);
  }

  const data = (await response.json()) as {
    current: Record<string, number>;
  };
  const current = data.current ?? {};

  return {
    location,
    temperature: current.temperature_2m ?? 0,
    humidity: current.relative_humidity_2m ?? 0,
    pressure: current.surface_pressure ?? 0,
    dewPoint: current.dew_point_2m ?? 0,
    visibility: current.visibility ?? 0,
    precipitation: current.precipitation ?? 0,
    windSpeed: current.wind_speed_10m ?? 0,
    windDirection: current.wind_direction_10m ?? 0,
    cloudCover: current.cloud_cover ?? 0,
    cloudCoverLow: current.cloud_cover_low ?? 0,
    cloudCoverMid: current.cloud_cover_mid ?? 0,
    cloudCoverHigh: current.cloud_cover_high ?? 0,
  };
}

function analyzeClouds(
  ulm: WeatherStation,
  garmisch: WeatherStation,
): { score: number; cap: number; details: string[] } {
  const details: string[] = [];
  let score = 0;

  const specs: Array<{
    value: number;
    thresholds: Array<[number, number]>;
    label: string;
  }> = [
    {
      value: Math.max(garmisch.cloudCoverLow, garmisch.cloudCoverMid),
      thresholds: [
        [10, 50],
        [25, 38],
        [50, 20],
        [75, 8],
        [100, 0],
      ],
      label: "Garmisch low+mid cloud deck",
    },
    {
      value: garmisch.cloudCover,
      thresholds: [
        [20, 20],
        [40, 14],
        [60, 7],
        [80, 2],
        [100, 0],
      ],
      label: "Garmisch total cloud cover",
    },
    {
      value: ulm.cloudCoverLow,
      thresholds: [
        [10, 15],
        [30, 10],
        [55, 4],
        [100, 0],
      ],
      label: "Ulm low clouds",
    },
    {
      value: ulm.cloudCoverMid,
      thresholds: [
        [10, 10],
        [30, 7],
        [60, 3],
        [100, 0],
      ],
      label: "Ulm mid clouds",
    },
    {
      value: ulm.cloudCoverHigh,
      thresholds: [
        [20, 5],
        [50, 3],
        [80, 1],
        [100, 0],
      ],
      label: "Ulm high clouds",
    },
  ];

  for (const spec of specs) {
    const points = scoreThreshold(spec.value, spec.thresholds);
    score += points;
    details.push(`${spec.label}: ${spec.value}% (${points} pts)`);
  }

  const garmischCritical = Math.max(garmisch.cloudCoverLow, garmisch.cloudCoverMid);
  const ulmCritical = Math.max(ulm.cloudCoverLow, ulm.cloudCoverMid);
  const cap = Math.min(
    scoreThreshold(garmischCritical, [
      [49, 100],
      [74, 50],
      [89, 25],
      [100, 10],
    ]),
    scoreThreshold(ulmCritical, [
      [49, 100],
      [74, 55],
      [89, 30],
      [100, 15],
    ]),
    scoreThreshold(ulm.cloudCover, [
      [59, 100],
      [79, 80],
      [94, 60],
      [100, 45],
    ]),
  );

  if (cap < 100) {
    details.push(`Cloud cap active: max ${cap} points`);
  }

  return { score, cap, details };
}

function analyzeFoehn(
  ulm: WeatherStation,
  garmisch: WeatherStation,
  innsbruck: WeatherStation,
): { score: number; details: string[] } {
  const details: string[] = [];
  let score = 0;

  const ulmP = normalizedPressure(ulm.pressure, LOCATIONS.ulm.alt);
  const gapP = normalizedPressure(garmisch.pressure, LOCATIONS.garmisch.alt);
  const ibkP = normalizedPressure(innsbruck.pressure, LOCATIONS.innsbruck.alt);

  const dIbkGap = ibkP - gapP;
  const dIbkUlm = ibkP - ulmP;
  const tempDiff = garmisch.temperature - ulm.temperature;

  const gradientPoints = scoreThreshold(dIbkGap, [
    [1, 8],
    [3, 18],
    [5, 30],
    [8, 40],
    [999, 40],
  ]);
  score += gradientPoints;
  details.push(`IBK->GAP pressure gradient: ${dIbkGap.toFixed(1)} hPa (${gradientPoints} pts)`);

  const ulmGradientPoints = scoreThreshold(dIbkUlm, [
    [1, 5],
    [3, 10],
    [6, 15],
    [999, 15],
  ]);
  score += ulmGradientPoints;
  details.push(`IBK->ULM pressure gradient: ${dIbkUlm.toFixed(1)} hPa (${ulmGradientPoints} pts)`);

  const tempPoints = scoreThreshold(tempDiff, [
    [0, 3],
    [2, 6],
    [4, 10],
    [999, 10],
  ]);
  score += tempPoints;
  details.push(`GAP-ULM temperature difference: ${tempDiff.toFixed(1)} C (${tempPoints} pts)`);

  const humidityPoints = scoreThreshold(garmisch.humidity, [
    [40, 5],
    [55, 3],
    [100, 0],
  ]);
  score += humidityPoints;
  details.push(`Garmisch humidity: ${garmisch.humidity}% (${humidityPoints} pts)`);

  const garmischWindPoints =
    garmisch.windDirection >= 120 && garmisch.windDirection <= 230 ? 20 : 0;
  const ulmWindPoints = ulm.windDirection >= 135 && ulm.windDirection <= 235 ? 10 : 0;
  score += garmischWindPoints + ulmWindPoints;
  details.push(
    `Garmisch wind direction: ${garmisch.windDirection.toFixed(0)} deg (${garmischWindPoints} pts)`,
  );
  details.push(`Ulm wind direction: ${ulm.windDirection.toFixed(0)} deg (${ulmWindPoints} pts)`);

  return { score, details };
}

function evaluate(
  ulm: WeatherStation,
  garmisch: WeatherStation,
  innsbruck: WeatherStation,
): EvaluationResult {
  const cloud = analyzeClouds(ulm, garmisch);
  const foehn = analyzeFoehn(ulm, garmisch, innsbruck);

  let score = 0;
  const factors: string[] = [];

  const weightedCloud = Math.round(cloud.score * 0.3);
  const weightedFoehn = Math.round(foehn.score * 0.1);
  score += weightedCloud + weightedFoehn;

  factors.push(`Cloud layer score: ${cloud.score}/100 -> weighted ${weightedCloud}/30`);
  factors.push(...cloud.details);
  factors.push(`Foehn score: ${foehn.score}/100 -> weighted ${weightedFoehn}/10`);
  factors.push(...foehn.details);

  const dewPointPoints = (() => {
    const dew = ulm.dewPoint;
    if (dew <= 0) return 30;
    if (dew <= 5) return 26;
    if (dew <= 8) return 19;
    if (dew <= 12) return 10;
    if (dew <= 15) return 4;
    return 0;
  })();
  score += dewPointPoints;
  factors.push(`Ulm dew point: ${ulm.dewPoint.toFixed(1)} C (${dewPointPoints}/30)`);

  const visibilityKm = ulm.visibility / 1000;
  const visibilityPoints = scoreThreshold(visibilityKm, [
    [30, 0],
    [50, 6],
    [80, 12],
    [999, 18],
  ]);
  score += visibilityPoints;
  factors.push(`Ulm visibility: ${visibilityKm.toFixed(0)} km (${visibilityPoints}/18)`);

  const humidityPoints = scoreThreshold(ulm.humidity, [
    [30, 7],
    [45, 5],
    [60, 2],
    [100, 0],
  ]);
  score += humidityPoints;
  factors.push(`Ulm humidity: ${ulm.humidity}% (${humidityPoints}/7)`);

  const precipitationPoints = ulm.precipitation === 0 ? 5 : 0;
  score += precipitationPoints;
  factors.push(`Ulm precipitation: ${ulm.precipitation} mm (${precipitationPoints}/5)`);

  score = Math.min(score, cloud.cap);

  const verdictKey =
    score >= 70
      ? "veryLikely"
      : score >= 50
        ? "likely"
        : score >= 35
          ? "possible"
          : score >= 20
            ? "unlikely"
            : "no";

  return {
    verdictKey,
    score,
    scoreNote: "",
    factors,
  };
}

export type AlpiversitaetDashboardData = {
  stations: Record<LocationKey, WeatherStation>;
  result: EvaluationResult;
  updatedAt: string;
};

export async function getAlpiversitaetDashboardData(): Promise<AlpiversitaetDashboardData> {
  const [ulm, garmisch, innsbruck] = await Promise.all([
    fetchStation("ulm", LOCATIONS.ulm),
    fetchStation("garmisch", LOCATIONS.garmisch),
    fetchStation("innsbruck", LOCATIONS.innsbruck),
  ]);

  return {
    stations: { ulm, garmisch, innsbruck },
    result: evaluate(ulm, garmisch, innsbruck),
    updatedAt: new Date().toISOString(),
  };
}

export { normalizedPressure };
