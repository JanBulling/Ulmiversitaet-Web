import { CalendarEvent } from "@/content/events/events";
import { CalendarIcon, ClockIcon, MapPin } from "lucide-react";

interface EventItemProps {
  event: CalendarEvent;
}

const DEFAULT_COLOR = "#f83a22";

const dateFormatter = new Intl.DateTimeFormat("de-DE", {
  month: "short",
  day: "2-digit",
});

const singleDateFormatter = new Intl.DateTimeFormat("de-DE", {
  day: "numeric",
  month: "short",
  weekday: "short",
});

export default function EventItem({ event }: EventItemProps) {
  const color = event.color ?? DEFAULT_COLOR;
  const startDateFormatted = dateFormatter.format(event.startDate);
  const textSecondary = "text-gray-600 dark:text-gray-400";

  let dateRange = startDateFormatted;

  const isMultiDay =
    event.startDate.toDateString() !== event.endDate.toDateString();

  return (
    <li
      className="flex w-full max-w-xl flex-col space-y-2 rounded-xl border p-4 shadow-md"
      style={{ borderLeft: `4px solid ${color}` }}
    >
      <div className="flex items-center gap-2">
        <div
          className="h-2 w-2 rounded-full"
          style={{ backgroundColor: color }}
        />
        <h3 className="text-lg font-semibold">{event.summary}</h3>
      </div>

      {isMultiDay ? (
        <div>
          <p className="flex items-center gap-2 text-sm">
            <CalendarIcon className="size-4 shrink-0" />
            <span className="font-semibold">Start:</span>
            <span className="font-mono">
              {dateFormatter.format(event.startDate)}
            </span>
            {event.startTime && (
              <>
                um
                <span className="font-mono">{event.startTime}</span>
              </>
            )}
          </p>
          <p className="flex items-center gap-2 text-sm">
            <CalendarIcon className="size-4 shrink-0" />
            <span className="font-semibold">Ende:</span>
            <span className="font-mono">
              {dateFormatter.format(event.endDate)}
            </span>
            {event.endTime && (
              <>
                um
                <span className="font-mono">{event.endTime}</span>
              </>
            )}
          </p>
        </div>
      ) : (
        <div>
          <p className="flex items-center gap-2 text-sm font-semibold">
            <CalendarIcon className="size-4 shrink-0" />
            {singleDateFormatter.format(event.startDate)}
          </p>
          {(event.startTime || event.endTime) && (
            <p className="flex items-center gap-2 text-sm">
              <ClockIcon className="size-4 shrink-0" />
              {`${event.startTime} - ${event.endTime?.length === 2 ? event.endTime : "open end"}`}
            </p>
          )}
        </div>
      )}

      {event.description && (
        <p className="text-muted-foreground text-sm">{event.description}</p>
      )}
      {event.location && (
        <p className="text-muted-foreground flex items-center gap-2 text-sm">
          <MapPin className="size-4 shrink-0" />
          {event.location}
        </p>
      )}
    </li>
  );
}
