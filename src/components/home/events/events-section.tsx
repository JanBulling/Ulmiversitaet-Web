import { CalendarClock } from "lucide-react";

import { Calendar } from "@/ui/calendar";
import { cn } from "@/lib/utils";
import { unstable_cache as cache } from "next/cache";
import { db } from "@/lib/db/db";
import { eventsTable } from "@/lib/db/schema";
import { ne } from "drizzle-orm";

const getEvents = cache(
  async () => {
    return await db
      .select()
      .from(eventsTable)
      .where(ne(eventsTable.status, "CANCELLED"));
  },
  [],
  { tags: ["events"] },
);

export default async function EventSection({
  className,
}: React.ComponentProps<"section">) {
  const events = await getEvents();

  return (
    <section
      className={cn("bg-card w-full border-y px-4 py-4 md:border", className)}
    >
      <div className="flex items-center gap-4">
        <CalendarClock className="text-primary size-8" />
        <h2 className="flex-1 text-2xl font-bold">Events</h2>
      </div>

      <Calendar events={events} />
    </section>
  );
}
