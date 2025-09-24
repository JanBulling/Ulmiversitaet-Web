import { CalendarEvent } from "@/lib/google-apis/calendar";
import { MapPin } from "lucide-react";

interface EventItemProps {
  event: CalendarEvent;
}

const DEFAULT_COLOR = "#f83a22";

const timeFormatter = new Intl.DateTimeFormat("de-DE", {
  hour: "2-digit",
  minute: "2-digit",
});

const dateFormatter = new Intl.DateTimeFormat("de-DE", {
  month: "short",
  day: "numeric",
});

export default function EventItem({ event }: EventItemProps) {
  const color = event.color ?? DEFAULT_COLOR;
  const date = dateFormatter.format(event.start);
  const startTime = timeFormatter.format(event.start);
  const endTime = timeFormatter.format(event.end);
  const textSecondary = "text-gray-600 dark:text-gray-400";

  return (
    <li
      className="flex items-start justify-between gap-3 rounded-lg p-3 border shadow-sm transition-all duration-200"
      style={{
        borderColor: `${color}20`,
        backgroundColor: `${color}03`,
      }}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <div className="size-1.5 rounded-full" style={{ backgroundColor: color }} />
          <span className={`text-xs font-medium capitalize ${textSecondary}`}>
            {date}
          </span>
        </div>

        <h3 className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-1 pr-2">
          {event.summary}
        </h3>

        {(event.description || event.location) && (
          <div className={`mt-1 space-y-1 text-xs ${textSecondary}`}>
            {event.description && <p className="line-clamp-1">{event.description}</p>}
            {event.location && (
              <div className="flex items-center gap-1.5">
                <MapPin className="size-3 flex-shrink-0" />
                <span className="truncate">{event.location}</span>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex flex-col items-end gap-1 text-xs font-mono text-gray-700 dark:text-gray-300">
        {[startTime, endTime].map((t, i) =>
          i === 1 ? (
            <span
              key={t}
              className="font-semibold text-sm text-gray-900 dark:text-white"
            >
              {t}
            </span>
          ) : (
            <>
              <span
                key={t}
                className="font-semibold text-sm text-gray-900 dark:text-white"
              >
                {t}
              </span>
              <div className="mx-1 h-4 w-0.5 rounded transition-all duration-200" style={{ backgroundColor: color }} />
            </>
          )
        )}
      </div>
    </li>
  );
}