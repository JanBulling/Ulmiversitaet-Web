import { CalendarClock } from "lucide-react";

import { Calendar } from "@/ui/calendar";
import { cn } from "@/lib/utils";
import { unstable_cache as cache } from "next/cache";
import { db } from "@/lib/db/db";
import { eventsTable } from "@/lib/db/schema";
import { asc } from "drizzle-orm";
import EventItem from "./event-item";
import { ScrollArea } from "@/ui/scroll-area";
import { getLocale, getTranslations } from "next-intl/server";

const getEvents = cache(
  async () => {
    return await db
      .select()
      .from(eventsTable)
      .orderBy(asc(eventsTable.startDate));
  },
  ["events"],
  { tags: ["events"], revalidate: 43200 },
);

export default async function EventSection({
  className,
}: React.ComponentProps<"section">) {
  const locale = await getLocale();
  const t = await getTranslations("HomePage.Events");
  const events = await getEvents();

  // apparently unstable_cache converts dates to strings (???) -> convert back if necessary
  const eventsFormatted = events.map((e) =>
    typeof e.startDate === "string"
      ? {
          ...e,
          startDate: new Date(e.startDate),
          endDate: new Date(e.endDate),
        }
      : e,
  );

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const twoMonthFromNow = new Date();
  twoMonthFromNow.setMonth(twoMonthFromNow.getMonth() + 2);

  const futureEvents = eventsFormatted.filter(
    (e) => e.startDate >= today && e.startDate <= twoMonthFromNow,
  );

  return (
    <section
      className={cn("bg-card w-full border-y px-4 py-4 md:border", className)}
    >
      <div className="flex items-center gap-4">
        <CalendarClock className="text-primary size-8" />
        <h2 className="flex-1 text-2xl font-bold">{t("title")}</h2>
      </div>

      <div className="my-2 grid grid-cols-1 gap-4 md:grid-cols-2">
        <Calendar
          locale={locale}
          events={eventsFormatted}
          className="hidden md:block"
        />

        <div className="md:max-h-[550px]">
          <h3 className="hidden text-xl font-bold md:block">
            {t("futureEvents")}
          </h3>

          <ScrollArea className="h-full md:mt-2 md:h-[calc(100%-28px-8px)]">
            <ol className="space-y-2 pb-4 md:px-2">
              {futureEvents.map((event) => (
                <EventItem event={event} key={event.id} />
              ))}
            </ol>
          </ScrollArea>
        </div>
      </div>
    </section>
  );
}
