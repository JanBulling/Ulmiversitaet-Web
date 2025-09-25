import {
  boolean,
  date,
  pgTableCreator,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

const pgTable = pgTableCreator((name) => `ulmiversitaet_${name}`);

export const eventsTable = pgTable("events", {
  id: uuid("id").defaultRandom().primaryKey(),
  summary: text("summary").notNull(),
  description: text("description"),
  location: text("location"),
  color: text("color"),

  startDate: date("start_date", { mode: "date" }).notNull(),
  endDate: date("end_date", { mode: "date" }).notNull(),

  startTime: text("start_time"),
  endTime: text("end_time"),

  wholeDay: boolean("whole_day").notNull(),

  createdAt: timestamp("created_at").defaultNow(),
});

export const sessionsTable = pgTable("sessions", {
  id: uuid("id").defaultRandom().primaryKey(),
  role: text("role").notNull(),
  expires_in: timestamp("expires_in").notNull(),
});
