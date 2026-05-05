import { getTranslations } from "next-intl/server";
import BaseLayout from "@/layouts/base-layout";
import {
  getAlpiversitaetDashboardData,
  normalizedPressure,
} from "@/lib/alpiversitaet";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/ui/card";

export const dynamic = "force-dynamic";

const STATION_KEYS = ["ulm", "garmisch", "innsbruck"] as const;
const STATION_ALTITUDES = {
  ulm: 480,
  garmisch: 708,
  innsbruck: 582,
} as const;

function scoreColorClass(score: number) {
  return score >= 70
    ? "text-emerald-600"
    : score >= 50
      ? "text-lime-600"
      : score >= 35
        ? "text-amber-600"
        : "text-rose-600";
}

function ScoreColor({ score }: { score: number }) {
  const colorClass = scoreColorClass(score);
  return <span className={colorClass}>{score}/100</span>;
}

function PercentBar({ value }: { value: number }) {
  const safeValue = Math.max(0, Math.min(100, value));
  const colorClass =
    safeValue >= 70
      ? "bg-emerald-500"
      : safeValue >= 50
        ? "bg-lime-500"
        : safeValue >= 35
          ? "bg-amber-500"
          : "bg-rose-500";

  return (
    <div className="bg-muted h-2.5 w-full overflow-hidden rounded-full">
      <div
        className={`h-full rounded-full transition-all ${colorClass}`}
        style={{ width: `${safeValue}%` }}
      />
    </div>
  );
}

function ComparisonBar({
  label,
  value,
  suffix,
  max,
  status = "mid",
}: {
  label: string;
  value: number;
  suffix: string;
  max: number;
  status?: "good" | "mid" | "bad";
}) {
  const width = Math.max(0, Math.min(100, (value / max) * 100));
  const barColorClass =
    status === "good"
      ? "bg-emerald-500"
      : status === "mid"
        ? "bg-amber-400"
        : "bg-rose-500";

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium">
          {value.toFixed(1)}
          {suffix}
        </span>
      </div>
      <div className="bg-muted h-2 w-full overflow-hidden rounded-full">
        <div
          className={`h-full rounded-full ${barColorClass}`}
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
}

export default async function AlpiversitaetPage() {
  const t = await getTranslations("AlpiversitaetPage");

  try {
    const data = await getAlpiversitaetDashboardData();

    return (
      <BaseLayout className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>{t("title")}</CardTitle>
            <CardDescription>{t("description")}</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border p-4">
              <p className="text-muted-foreground text-sm">{t("verdict")}</p>
              <p className="mt-1 text-xl font-semibold">
                {t(`verdicts.${data.result.verdictKey}`)}
              </p>
            </div>
            <div className="rounded-lg border p-4">
              <p className="text-muted-foreground text-sm">{t("score")}</p>
              <p className="mt-1 text-3xl font-bold">
                <ScoreColor score={data.result.score} />
              </p>
              <div className="mt-3">
                <PercentBar value={data.result.score} />
                <div className="text-muted-foreground mt-1 flex justify-between text-xs">
                  <span>0</span>
                  <span>50</span>
                  <span>100</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("stationsTitle")}</CardTitle>
            <CardDescription>
              Visual comparison of key weather metrics used by the forecast model.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            {STATION_KEYS.map((key) => {
              const station = data.stations[key];
              const visibilityKm = station.visibility / 1000;
              const normalized = normalizedPressure(
                station.pressure,
                STATION_ALTITUDES[key],
              );
              const windNeedleStyle = {
                transform: `rotate(${station.windDirection}deg)`,
              };

              return (
                <div key={key} className="space-y-2 rounded-lg border p-4 text-sm">
                  <h3 className="text-base font-semibold">{t(`locations.${key}`)}</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="rounded-md border p-2 text-center">
                      <p className="text-muted-foreground text-xs">
                        {t("labels.temperature")}
                      </p>
                      <p className="text-lg font-semibold">
                        {station.temperature.toFixed(1)} C
                      </p>
                    </div>
                    <div className="rounded-md border p-2 text-center">
                      <p className="text-muted-foreground text-xs">
                        {t("labels.visibility")}
                      </p>
                      <p className="text-lg font-semibold">{visibilityKm.toFixed(0)} km</p>
                    </div>
                  </div>
                  <div className="space-y-2 pt-1">
                    <ComparisonBar
                      label={t("labels.humidity")}
                      value={station.humidity}
                      suffix="%"
                      max={100}
                      status={
                        station.humidity <= 45
                          ? "good"
                          : station.humidity <= 60
                            ? "mid"
                            : "bad"
                      }
                    />
                    <ComparisonBar
                      label={t("labels.cloudCover")}
                      value={station.cloudCover}
                      suffix="%"
                      max={100}
                      status={
                        station.cloudCover <= 40
                          ? "good"
                          : station.cloudCover <= 70
                            ? "mid"
                            : "bad"
                      }
                    />
                    <ComparisonBar
                      label={t("labels.cloudLow")}
                      value={station.cloudCoverLow}
                      suffix="%"
                      max={100}
                      status={
                        station.cloudCoverLow <= 25
                          ? "good"
                          : station.cloudCoverLow <= 55
                            ? "mid"
                            : "bad"
                      }
                    />
                    <ComparisonBar
                      label={t("labels.cloudMid")}
                      value={station.cloudCoverMid}
                      suffix="%"
                      max={100}
                      status={
                        station.cloudCoverMid <= 30
                          ? "good"
                          : station.cloudCoverMid <= 60
                            ? "mid"
                            : "bad"
                      }
                    />
                    <ComparisonBar
                      label={t("labels.cloudHigh")}
                      value={station.cloudCoverHigh}
                      suffix="%"
                      max={100}
                      status={
                        station.cloudCoverHigh <= 40
                          ? "good"
                          : station.cloudCoverHigh <= 70
                            ? "mid"
                            : "bad"
                      }
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <div className="rounded-md border p-2">
                      <p className="text-muted-foreground text-xs">{t("labels.wind")}</p>
                      <div className="mt-2 flex items-center gap-3">
                        <div className="bg-muted relative h-10 w-10 rounded-full border">
                          <span className="absolute inset-0 flex items-center justify-center text-[10px]">
                            N
                          </span>
                          <span
                            className="absolute left-1/2 top-1/2 h-4 w-0.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-600"
                            style={windNeedleStyle}
                          />
                        </div>
                        <p className="text-xs">
                          {station.windSpeed.toFixed(0)} km/h
                          <br />
                          {station.windDirection.toFixed(0)} deg
                        </p>
                      </div>
                    </div>
                    <div className="rounded-md border p-2">
                      <p className="text-muted-foreground text-xs">
                        {t("labels.normalizedPressure")}
                      </p>
                      <p className="mt-2 text-sm font-semibold">
                        {normalized.toFixed(1)} hPa
                      </p>
                      <p className="text-muted-foreground text-xs">
                        {t("labels.pressure")}: {station.pressure.toFixed(1)} hPa
                      </p>
                    </div>
                  </div>
                  <p>
                    {t("labels.dewPoint")}: {station.dewPoint.toFixed(1)} C
                  </p>
                  <p>
                    {t("labels.precipitation")}: {station.precipitation.toFixed(1)} mm
                  </p>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <p className="text-muted-foreground text-center text-xs">
          Data from{" "}
          <a
            href="https://open-meteo.com/"
            target="_blank"
            rel="noreferrer noopener"
            className="underline underline-offset-2"
          >
            Open-Meteo
          </a>
          .
        </p>
      </BaseLayout>
    );
  } catch {
    return (
      <BaseLayout>
        <Card>
          <CardHeader>
            <CardTitle>{t("errorsTitle")}</CardTitle>
            <CardDescription>{t("errorsDescription")}</CardDescription>
          </CardHeader>
        </Card>
      </BaseLayout>
    );
  }
}
