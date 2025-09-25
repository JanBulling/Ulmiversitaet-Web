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

const dayFormatter = new Intl.DateTimeFormat("de-DE", {
  day: "numeric",
});

const monthDayFormatter = new Intl.DateTimeFormat("de-DE", {
  day: "numeric",
  month: "short",
});

const formatTime = (timeString: string | null | undefined) => {
  if (!timeString) return "";
  const [hours, minutes] = [timeString.slice(0, 2), timeString.slice(2, 4)];
  return `${parseInt(hours)}:${minutes} Uhr`;
};

export default function EventItem({ event }: EventItemProps) {
  const color = event.color ?? DEFAULT_COLOR;
  const startDateFormatted = dateFormatter.format(event.startDate);
  const textSecondary = "text-gray-600 dark:text-gray-400";

  let dateRange = startDateFormatted;

  if (event.startDate.toDateString() !== event.endDate.toDateString()) {
    if (event.startDate.getMonth() === event.endDate.getMonth()) {
      // Same month, different days: 7-9. Okt.
      dateRange = `${dayFormatter.format(event.startDate)}-${dateFormatter.format(event.endDate)}`;
    } else {
      // Different months: 27. Okt - 3. Sept.
      dateRange = `${monthDayFormatter.format(event.startDate)} - ${monthDayFormatter.format(event.endDate)}`;
    }
  }

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
            {dateRange}
            {event.startTime && ` ${formatTime(event.startTime)}`}
            {event.endTime && (
              <>
                {` - ${formatTime(event.endTime)}`}
              </>
            )}
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

      
    </li>
  );
}
