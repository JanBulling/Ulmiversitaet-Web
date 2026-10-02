import { getPassengerAlert } from "@/lib/public-transport/swu-api";
import { Alert, AlertDescription, AlertTitle } from "@/ui/alert";
import { AlertTriangleIcon } from "lucide-react";
import { getTranslations } from "next-intl/server";

export default async function PassengerAlert() {
  const t = await getTranslations("HomePage.PublicTransport");

  let alert;
  try {
    alert = await getPassengerAlert();
  } catch (error) {
    console.error("[PassengerAlert]", error);
    return null;
  }

  return (
    <Alert
      variant={alert.status === "OK" ? "success" : "destructive"}
      icon={AlertTriangleIcon}
    >
      <AlertTitle>
        {alert.title ??
          (alert.status === "OK" ? t("noDisruption") : t("disruption"))}
      </AlertTitle>
      <AlertDescription>
        {alert.data?.map((a) => (
          <p key={a}>{a}</p>
        ))}
      </AlertDescription>
    </Alert>
  );
}
