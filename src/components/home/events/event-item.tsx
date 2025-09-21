import { CalendarEvent } from "@/lib/google-apis/calendar";
import { MapPin } from "lucide-react";

interface EventItemProps {
  event: CalendarEvent;
}

const defaultColor = "#f83a22";

const timeFormatter = Intl.DateTimeFormat("de-DE", {
  hour: "2-digit",
  minute: "2-digit",
});

const dateFormatter = Intl.DateTimeFormat("de-DE", {
  month: "long",
  day: "2-digit",
});

export default function EventItem({ event }: EventItemProps) {
  const color = event.color ?? defaultColor;

  const date = dateFormatter.format(event.start);
  const startTime = timeFormatter.format(event.start);
  const endTime = timeFormatter.format(event.end);

  return (
    <li
      className="flex items-start justify-between gap-4 rounded-md border-2 px-2 py-2 sm:px-4"
      style={{ backgroundColor: `${color}55`, borderColor: color }}
    >
      <div>
        <p className="font-mono text-sm font-semibold md:text-base">{date}</p>
        <h4 className="text-base font-semibold">{event.summary}</h4>
        <p className="text-xs sm:text-sm">{event.description}</p>
        {event.location && (
          <div className="flex items-center gap-2 text-xs sm:text-sm">
            <MapPin className="size-4 shrink-0" />
            {event.location}
          </div>
        )}
      </div>
      <div className="font-mono text-xs sm:text-sm">
        <p>{startTime}</p>
        <div
          className="mx-auto my-1 h-6 w-1 rounded"
          style={{ backgroundColor: `${color}` }}
        />
        <p>{endTime}</p>
      </div>
    </li>
  );
}
