import { useTranslations } from "next-intl";

export function countdownFormatter(countdown: number, actualDeparture: Date) {
  if (countdown <= -60) return "Abgefahren";
  if (countdown <= 0) return "Jetzt";
  if (countdown <= 60) return `${countdown} s`;
  if (countdown <= 3600) return `${Math.ceil(countdown / 60)} min`;

  const formatter = Intl.DateTimeFormat("de-DE", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return formatter.format(actualDeparture);
}

export function delayFormatter(
  scheduledDeparture: Date,
  actualDeparture: Date,
) {
  const t = useTranslations("HomePage.PublicTransport");

  const difference = Math.round(
    (actualDeparture.getTime() - scheduledDeparture.getTime()) / 1000,
  );

  if (Math.abs(difference) < 10) return t("onTime");

  const delaySign = Math.sign(difference);
  const delayText = delaySign < 0 ? "-" : "+";

  const delayMinutes = Math.floor(Math.abs(difference) / 60);
  const delaySeconds = Math.abs(difference) % 60;

  if (delayMinutes !== 0) {
    return `${delayText}${delayMinutes}min ${delaySeconds}s`;
  }

  return `${delayText}${delaySeconds}s`;
}

export function isDelayed(scheduledDeparture: Date, actualDeparture: Date) {
  const difference = Math.round(
    (actualDeparture.getTime() - scheduledDeparture.getTime()) / 1000,
  );
  if (Math.abs(difference) < 10) return 0;
  return Math.sign(difference);
}
