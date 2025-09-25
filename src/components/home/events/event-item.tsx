import { CalendarEvent } from "@/content/events/events";
import { MapPin } from "lucide-react";

interface EventItemProps {
  event: CalendarEvent;
}

const DEFAULT_COLOR = "#f83a22";

const dateFormatter = new Intl.DateTimeFormat("de-DE", {
  month: "short",
  day: "numeric",
});

export default function EventItem({ event }: EventItemProps) {
  const color = event.color ?? DEFAULT_COLOR;
  const date = dateFormatter.format(event.startDate);
  const textSecondary = "text-gray-600 dark:text-gray-400";

  return (
    <li
      className="flex items-start justify-between gap-3 rounded-lg border p-3 shadow-sm transition-all duration-200"
      style={{
        borderColor: `${color}20`,
        backgroundColor: `${color}03`,
      }}
    >
      <div className="min-w-0 flex-1">
        <div className="mb-1 flex items-center gap-2">
          <div
            className="size-1.5 rounded-full"
            style={{ backgroundColor: color }}
          />
          <span className={`text-xs font-medium capitalize ${textSecondary}`}>
            {date}
          </span>
        </div>

        <h3 className="line-clamp-1 pr-2 text-sm font-semibold text-gray-900 dark:text-white">
          {event.summary}
        </h3>

        {(event.description || event.location) && (
          <div className={`mt-1 space-y-1 text-xs ${textSecondary}`}>
            {event.description && (
              <p className="line-clamp-1">{event.description}</p>
            )}
            {event.location && (
              <div className="flex items-center gap-1.5">
                <MapPin className="size-3 flex-shrink-0" />
                <span className="truncate">{event.location}</span>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex flex-col items-end gap-1 font-mono text-xs text-gray-700 dark:text-gray-300">
        TIME
      </div>
    </li>
  );
}
