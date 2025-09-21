import { env } from "@/env.mjs";
import { db } from "@/lib/db/db";
import { eventsTable, syncTokenTable } from "@/lib/db/schema";
import { performSync } from "@/lib/google-apis/calendar";
import { revalidatePath, revalidateTag } from "next/cache";

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${env.CRON_SECRET}`) {
      return new Response("Unauthorized", {
        status: 401,
      });
    }

    const syncToken = await db.select().from(syncTokenTable).limit(1);

    const { nextSyncToken, events } = await performSync(
      env.CALENDAR_ID ?? "default",
      syncToken.length === 1 ? syncToken[0].syncToken : undefined,
    );

    events.forEach(
      async (event) =>
        await db.insert(eventsTable).values(event).onConflictDoUpdate({
          target: eventsTable.id,
          set: event,
        }),
    );

    if (events.length >= 1) {
      revalidateTag("events");
      revalidatePath("/");
    }

    if (!nextSyncToken) {
      console.warn(
        "[API/CALENDAR/SYNC - GET]",
        "No next-sync-token provided",
        "Deleting current sync token",
      );
      await db.delete(syncTokenTable);
    } else {
      if (syncToken.length !== 1) {
        await db.insert(syncTokenTable).values({ syncToken: nextSyncToken });
      } else {
        await db.update(syncTokenTable).set({ syncToken: nextSyncToken });
      }
    }

    return new Response("success");
  } catch (err) {
    console.error(
      "[API/CALENDAR/SYNC - GET (CRON)]",
      "Unexpected server error",
      err,
    );
    return new Response("Unexpected server error", { status: 500 });
  }
}
