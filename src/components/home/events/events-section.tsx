import { CalendarClock } from "lucide-react";

import { Calendar } from "@/ui/calendar";
import { cn } from "@/lib/utils";
import { unstable_cache as cache } from "next/cache";
import { db } from "@/lib/db/db";
import { eventsTable } from "@/lib/db/schema";
import { asc, ne } from "drizzle-orm";
import EventItem from "./event-item";

const getEvents = cache(
  async () => {
    return await db
      .select()
      .from(eventsTable)
      .where(ne(eventsTable.status, "CANCELLED"))
      .orderBy(asc(eventsTable.start));
  },
  ["events"],
  { tags: ["events"], revalidate: 43200 },
);

export default async function EventSection({
  className,
}: React.ComponentProps<"section">) {
  const events = await getEvents();

  // apparently unstable_cache converts dates to strings (???) -> convert back if necessary
  const eventsFormatted = events.map((e) =>
    typeof e.start === "string"
      ? {
          ...e,
          start: new Date(e.start),
          end: new Date(e.end),
          createdAt: new Date(e.createdAt),
          updatedAt: new Date(e.updatedAt),
        }
      : e,
  );

  const today = new Date();
  const futureEvents = eventsFormatted.filter((e) => e.end > today);

  return (
    <section
      className={cn("bg-card w-full border-y px-4 py-4 md:border", className)}
    >
      <div className="flex items-center gap-4">
        <CalendarClock className="text-primary size-8" />
        <h2 className="flex-1 text-2xl font-bold">Events</h2>
      </div>

      <div className="my-2 grid grid-cols-1 gap-4 md:grid-cols-2">
        <Calendar events={eventsFormatted} className="hidden md:block" />

        <div>
          <h3 className="hidden text-xl font-bold md:block">
            Zukünftige Events
          </h3>
          <ol className="mt-2 space-y-2">
            {futureEvents.map((event) => (
              <EventItem event={event} key={event.id} />
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
