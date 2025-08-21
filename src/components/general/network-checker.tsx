import { headers } from "next/headers";

export default async function NetworkChecker() {
  const ip = (await headers()).get("x-forwarded-for");

  return <p>{ip}</p>;
}
