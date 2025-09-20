import { CalendarClock } from "lucide-react";

import { getEvents } from "@/content/events/events";
import { Calendar } from "@/ui/calendar";
import { cn } from "@/lib/utils";

export default function EventSection({
  className,
}: React.ComponentProps<"section">) {
  const events = getEvents();

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
