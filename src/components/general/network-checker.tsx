import { isInCidr } from "@/lib/ip-utils";
import { CheckCircleIcon, CircleAlertIcon } from "lucide-react";
import { headers } from "next/headers";

const uniUlmVpnCidr = ["134.60.240.0/23", "134.60.246.0/23", "134.60.248.0/22"];

const eduroamCidr = ["134.60.0.0/16", "193.197.64.0/22"];

export default async function NetworkChecker({
  showIfFalse,
}: {
  showIfFalse?: boolean;
}) {
  const ip = (await headers()).get("x-forwarded-for");

  if (!ip) return null;

  const isVpn = uniUlmVpnCidr.some((cidr) => isInCidr(ip, cidr));
  if (isVpn)
    return (
      <div className="text-success bg-card flex w-fit items-center gap-2 rounded-sm border p-1 shadow">
        <CheckCircleIcon className="size-4" />
        <p className="text-xs font-bold">Uni VPN aktiv</p>
      </div>
    );

  const isEduroam = eduroamCidr.some((cidr) => isInCidr(ip, cidr));
  if (isEduroam)
    return (
      <div className="text-success bg-card flex w-fit items-center gap-2 rounded-sm border p-1 shadow">
        <CheckCircleIcon className="size-4" />
        <p className="text-xs font-bold">Eduroam® aktiv</p>
      </div>
    );

  if (showIfFalse) {
    return (
      <div className="text-destructive bg-card flex w-fit items-center gap-2 rounded-sm border p-1 shadow">
        <CircleAlertIcon className="size-4" />
        <p className="text-xs font-bold">Nicht im Uni-Netz</p>
      </div>
    );
  }

  return null;
}
