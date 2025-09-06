import path from "path";
import fs from "fs";

export type CalendarEvent = {
  title: string;
  date: string;
  time?: string;
  color?: string;
};

export function getEvents(): CalendarEvent[] {
  const folder = path.join(process.cwd(), "src", "content", "events");
  try {
    const files = fs.readdirSync(folder).filter((file) => {
      return path.extname(file) === ".json";
    });

    const events = files.map((file) => {
      const filePath = path.join(folder, file);
      const rawContent = fs.readFileSync(filePath, "utf-8");
      const data = JSON.parse(rawContent) as CalendarEvent[];

      return data;
    });
    return events.flat();
  } catch (err) {
    console.error("[GET-EVENTS]", err);
    return [];
  }
}
