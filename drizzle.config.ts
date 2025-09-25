import type { Config } from "drizzle-kit";

export default {
  schema: "./src/lib/db/schema.ts",
  out: "./migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.NEON_DATABASE_URL_ADMIN ?? "",
  },

  tablesFilter: ["ulmiversitaet_*", "!meal*"],
} satisfies Config;
