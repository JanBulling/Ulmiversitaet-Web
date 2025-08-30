import { getPassengerAlert } from "@/lib/public-transport/swu-api";
import { Alert, AlertDescription, AlertTitle } from "@/ui/alert";
import { AlertTriangleIcon } from "lucide-react";

export default async function PassengerAlert() {
  const alert = await getPassengerAlert();

  return (
    <Alert
      variant={alert.currentStatus === "OK" ? "success" : "destructive"}
      icon={AlertTriangleIcon}
    >
      <AlertTitle>
        {alert.title ??
          (alert.currentStatus === "OK" ? "Keine Störung" : "Aktuelle Störung")}
      </AlertTitle>
      <AlertDescription>{alert.data}</AlertDescription>
    </Alert>
  );
}
