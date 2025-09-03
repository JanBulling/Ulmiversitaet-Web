"use client";

import { Analytics as VercelAnalytics } from "@vercel/analytics/next";

export function AnalyticsProvider() {
  return <VercelAnalytics />;
}
