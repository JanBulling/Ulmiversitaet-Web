import { db } from "@/lib/db/db";
import { eventsTable } from "@/lib/db/schema";
import { getServerSession } from "@/lib/session";
import { eq } from "drizzle-orm";
import { revalidatePath, revalidateTag } from "next/cache";
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
    const session = await getServerSession();
    if (!session || session.role !== "ADMIN") {
      return new Response("Not authenticated", { status: 401 });
    }

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

    revalidateTag("events");
    revalidatePath("/");

    return new Response("Success");
  } catch (err) {
    console.error("[/events - POST]", "Internal server error", err);
    return new Response("Internal server error", { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession();
    if (!session || session.role !== "ADMIN") {
      return new Response("Not authenticated", { status: 401 });
    }

    const json = await req.json();
    const body = schema.safeParse(json);
    if (!body.success) {
      console.error(body.error);
      return new Response("Wrongly formatted data", { status: 400 });
    }

    return new Response("Success");
  } catch (err) {
    console.error("[/events - DELETE]", "Internal server error", err);
    return new Response("Internal server error", { status: 500 });
  }
}

const deleteSchema = z.object({
  id: z.string().min(1),
});

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession();
    if (!session || session.role !== "ADMIN") {
      return new Response("Not authenticated", { status: 401 });
    }

    const json = await req.json();
    const body = deleteSchema.safeParse(json);
    if (!body.success) {
      console.error(body.error);
      return new Response("Wrongly formatted data", { status: 400 });
    }

    const data = body.data;

    await db.delete(eventsTable).where(eq(eventsTable.id, data.id));

    revalidateTag("events");
    revalidatePath("/");

    return new Response("Success");
  } catch (err) {
    console.error("[/events - DELETE]", "Internal server error", err);
    return new Response("Internal server error", { status: 500 });
  }
}
