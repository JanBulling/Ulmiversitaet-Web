import { db } from "@/lib/db/db";
import { eventsTable } from "@/lib/db/schema";
import z from "zod";

const schema = z.object({
  summary: z.string().min(1),
  description: z.string().optional(),
  location: z.string().optional(),
  isWholeDay: z.boolean().optional(),
  startDate: z.string(),
  startTime: z.string().optional(),
  endDate: z.string(),
  endTime: z.string().optional(),
  color: z.string().optional(),
});

// ================================================================================================
// ======                               POST-ROUTES                                          ======
// ================================================================================================
export async function POST(req: Request) {
  try {
    const json = await req.json();
    const body = schema.safeParse(json);
    if (!body.success) {
      console.error(body.error);
      return new Response("Wrongly formatted data", { status: 400 });
    }

    const event = body.data;

    const startDate = Date.parse(event.startDate);
    const endDate = Date.parse(event.endDate);
    if (isNaN(startDate) || isNaN(endDate))
      return new Response("Wrongly formatted data", { status: 400 });

    await db.insert(eventsTable).values({
      summary: event.summary,
      description: event.description,
      location: event.location,
      color: event.color,

      wholeDay: event.isWholeDay ?? false,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      startTime: event.startTime,
      endTime: event.endTime,
    });

    return new Response("success");
  } catch (err) {
    console.error("[/events - POST]", "Internal server error", err);
    return new Response("Internal server error", { status: 500 });
  }
}

export function PATCH(_req: Request) {}
