import { isInCidr } from "@/lib/ip-utils";
import { headers } from "next/headers";

const uniUlmVpnCidr = ["134.60.240.0/23", "134.60.246.0/23", "134.60.248.0/22"];

const eduroamCidr = ["134.60.0.0/16", "193.197.64.0/22"];

export default async function NetworkChecker() {
  const ip = (await headers()).get("x-forwarded-for");

  if (!ip) return null;

  const isVpn = uniUlmVpnCidr.some((cidr) => isInCidr(ip, cidr));
  if (isVpn)
    return (
      <div className="flex items-center">
        <div className="bg-success h-4 w-4 rounded-full" />
        <p className="text-xs font-bold">Uni-VPN aktiv</p>
      </div>
    );

  const isEduroam = eduroamCidr.some((cidr) => isInCidr(ip, cidr));
  if (isEduroam)
    return (
      <div className="flex items-center">
        <div className="bg-success h-4 w-4 rounded-full" />
        <p className="text-xs font-bold">Eduroam aktiv</p>
      </div>
    );

  return null;
}
