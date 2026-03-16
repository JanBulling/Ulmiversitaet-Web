import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "de"],
  defaultLocale: "de",
  localePrefix: "as-needed",
  localeCookie: {
    name: "LANGUAGE",
    maxAge: 60 * 60 * 24 * 365, // 1 year
  },
});
