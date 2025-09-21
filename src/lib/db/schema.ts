import { pgEnum, pgTableCreator, text, timestamp } from "drizzle-orm/pg-core";

const pgTable = pgTableCreator((name) => `ulmiversitaet_${name}`);

export const eventStatus = pgEnum("event-status", [
  "CANCELLED",
  "CONFIRMED",
  "TENTATIVE",
]);

export const eventsTable = pgTable("events", {
  id: text("id").notNull().primaryKey(),
  summary: text("summary").notNull(),
  description: text("description"),
  location: text("location"),
  status: eventStatus("status").notNull().default("CONFIRMED"),

  htmlLink: text("html_link"),
  color: text("color"),

  start: timestamp("start", { withTimezone: true, mode: "date" }).notNull(),
  end: timestamp("end", { withTimezone: true, mode: "date" }).notNull(),

  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const syncTokenTable = pgTable("event-sync-token", {
  syncToken: text("sync_token").notNull().primaryKey(),
});
