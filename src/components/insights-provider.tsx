import { SpeedInsights as VercelInsights } from "@vercel/speed-insights/next";

export function InsightsProvider() {
  return <VercelInsights />;
}
