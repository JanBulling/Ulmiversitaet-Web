import { db } from "@/lib/db/db";
import { eventsTable, syncTokenTable } from "@/lib/db/schema";
import { performSync } from "@/lib/google-apis/calendar";
import { revalidateTag } from "next/cache";

export async function GET(req_: Request) {
  const syncToken = await db.select().from(syncTokenTable).limit(1);

  const { nextSyncToken, events } = await performSync(
    process.env.CALENDAR_ID ?? "default",
    syncToken.length === 1 ? syncToken[0].syncToken : undefined,
  );

  events.forEach(
    async (e) =>
      await db
        .insert(eventsTable)
        .values({
          id: e.id,
          status: e.status,
          summary: e.summary,
          description: e.description,
          location: e.location,
          color: e.color,
          start: e.start,
          end: e.end,
          htmlLink: e.htmlLink,
          createdAt: e.createdAt,
          updatedAt: e.updatedAt,
        })
        .onConflictDoUpdate({
          target: eventsTable.id,
          set: {
            status: e.status,
            summary: e.summary,
            description: e.description,
            location: e.location,
            color: e.color,
            start: e.start,
            end: e.end,
            htmlLink: e.htmlLink,
            createdAt: e.createdAt,
            updatedAt: e.updatedAt,
          },
        }),
  );

  revalidateTag("events");

  if (!nextSyncToken) {
    console.error("[API/CALENDAR/SYNC - GET]", "No next-sync-token provided");
    await db.delete(syncTokenTable);
  } else {
    if (syncToken.length !== 1) {
      await db.insert(syncTokenTable).values({ syncToken: nextSyncToken });
    } else {
      await db.update(syncTokenTable).set({ syncToken: nextSyncToken });
    }
  }

  return new Response("success");
}
