"use client";

import * as React from "react";
import { getDay, getDaysInMonth, isSameDay } from "date-fns";
import { Button } from "./button";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { CalendarEvent } from "@/content/events/events";

type CalendarState = {
  month: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;
  year: number;
};

interface CalendarProps {
  locale?: Intl.LocalesArgument;
  firstDayInWeek?: number;
  className?: string;
  events?: CalendarEvent[];
}

export function Calendar({
  locale = "de-DE",
  firstDayInWeek = 1,
  className,
  events,
}: CalendarProps) {
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const [month, setMonth] = React.useState<CalendarState["month"]>(
    new Date().getMonth() as CalendarState["month"],
  );
  const [year, setYear] = React.useState<number>(new Date().getFullYear());

  const handlePrevMonth = React.useCallback(() => {
    // does not allow to go back in time
    if (year === currentYear && month === currentMonth) return;

    if (month === 0) {
      setMonth(11);
      setYear(year - 1);
    } else {
      setMonth((month - 1) as CalendarState["month"]);
    }
  }, [month, year]);

  const handleNextMonth = React.useCallback(() => {
    if (month === 11) {
      setMonth(0);
      setYear(year + 1);
    } else {
      setMonth((month + 1) as CalendarState["month"]);
    }
  }, [month, year]);

  // ============ Do days calculation ===============
  const isPreviousMonthAvailable = React.useMemo(
    () => !(currentMonth === month && currentYear === year),
    [year, month],
  );
  // Memoize expensive date calculations
  const currentMonthDate = React.useMemo(
    () => new Date(year, month, 1),
    [year, month],
  );
  const daysInMonth = React.useMemo(
    () => getDaysInMonth(currentMonthDate),
    [currentMonthDate],
  );
  const firstDay = React.useMemo(
    () => (getDay(currentMonthDate) - firstDayInWeek + 7) % 7,
    [currentMonthDate, firstDayInWeek],
  );

  // Memoize previous month calculations
  const prevMonthData = React.useMemo(() => {
    const prevMonth = month === 0 ? 11 : month - 1;
    const prevMonthYear = month === 0 ? year - 1 : year;
    const prevMonthDays = getDaysInMonth(new Date(prevMonthYear, prevMonth, 1));
    const prevMonthDaysArray = Array.from(
      { length: prevMonthDays },
      (_, i) => i + 1,
    );
    return { prevMonthDays, prevMonthDaysArray };
  }, [month, year]);

  // Memoize next month calculations
  const nextMonthData = React.useMemo(() => {
    const nextMonth = month === 11 ? 0 : month + 1;
    const nextMonthYear = month === 11 ? year + 1 : year;
    const nextMonthDays = getDaysInMonth(new Date(nextMonthYear, nextMonth, 1));
    const nextMonthDaysArray = Array.from(
      { length: nextMonthDays },
      (_, i) => i + 1,
    );
    return { nextMonthDaysArray };
  }, [month, year]);

  // ============ Precalculate events ==============
  const eventsByDay = React.useMemo(() => {
    const result: { [day: number]: CalendarEvent[] | undefined } = {};
    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(year, month, day);
      result[day] = events?.filter((event) => {
        const startDateOnly = new Date(
          event.startDate.getFullYear(),
          event.startDate.getMonth(),
          event.startDate.getDate(),
        );
        const endDateOnly = new Date(
          event.endDate.getFullYear(),
          event.endDate.getMonth(),
          event.endDate.getDate(),
        );
        return currentDate >= startDateOnly && currentDate <= endDateOnly;
      });
    }
    return result;
  }, [events, daysInMonth, year, month]);

  // ============ Add days to calender ===============
  const days: React.ReactNode[] = [];

  for (let i = 0; i < firstDay; i++) {
    const day =
      prevMonthData.prevMonthDaysArray[
        prevMonthData.prevMonthDays - firstDay + i
      ];
    if (day) {
      days.push(<OutOfBoundsDay day={day} key={`prev-${i}`} />);
    }
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const eventsAtDay = eventsByDay[day];

    days.push(
      <Day
        day={day}
        events={eventsAtDay}
        isToday={isSameDay(new Date(year, month, day), new Date())}
        key={day}
      />,
    );
  }

  const remainingDays = 7 - ((firstDay + daysInMonth) % 7);
  if (remainingDays < 7) {
    for (let i = 0; i < remainingDays; i++) {
      const day = nextMonthData.nextMonthDaysArray[i];
      if (day) {
        days.push(<OutOfBoundsDay day={day} key={`next-${i}`} />);
      }
    }
  }

  return (
    <div className={cn("max-w-xl", className)}>
      <div className="flex items-center justify-center gap-4">
        <Button
          onClick={handlePrevMonth}
          size="icon"
          variant="outline"
          disabled={!isPreviousMonthAvailable}
        >
          <ChevronLeftIcon size={16} />
        </Button>
        <p className="text-normal font-semibold">
          {Intl.DateTimeFormat(locale, {
            month: "long",
            year: "numeric",
          }).format(new Date(year, month))}
        </p>
        <Button onClick={handleNextMonth} size="icon" variant="outline">
          <ChevronRightIcon />
        </Button>
      </div>

      <CalendarHeader
        firstDayOfWeek={firstDayInWeek}
        locale={locale}
        className="mt-2"
      />

      <div className="grid flex-grow grid-cols-7">
        {days.map((day, idx) => (
          <div key={idx} className="min-h-20 border p-0 md:min-h-19">
            {day}
          </div>
        ))}
      </div>
    </div>
  );
}
Calendar.displayName = "CalendarItem";

function CalendarHeader({
  firstDayOfWeek = 1,
  className,
  locale = "de-DE",
}: {
  firstDayOfWeek?: number;
  className?: string;
  locale?: Intl.LocalesArgument;
}) {
  const weeksToDays = React.useMemo(() => {
    const baseDate = new Date(Date.UTC(2024, 0, 7 + firstDayOfWeek));
    return Array.from({ length: 7 }).map((_, i) =>
      Intl.DateTimeFormat(locale, { weekday: "short" }).format(
        new Date(baseDate.getTime() + i * 86400000),
      ),
    );
  }, [locale, firstDayOfWeek]);

  return (
    <div className={cn("grid flex-grow grid-cols-7", className)}>
      {weeksToDays.map((day) => (
        <div
          className="text-muted-foreground p-3 text-center text-xs"
          key={day}
        >
          {day}
        </div>
      ))}
    </div>
  );
}

function OutOfBoundsDay({ day }: { day: number }) {
  return (
    <div className="bg-muted text-muted-foreground relative h-full w-full p-2 text-left text-xs">
      {day}
    </div>
  );
}

function Day({
  day,
  isToday = false,
  events,
}: {
  day: number;
  isToday?: boolean;
  events?: CalendarEvent[];
}) {
  return (
    <div
      className={cn(
        "bg-card text-foreground relative h-full w-full p-2 text-left text-sm",
        isToday && "bg-primary/40 font-semibold",
      )}
    >
      {day}
      <div className="mt-1 space-y-0.5 text-xs">
        {events?.slice(0, 2).map((event, idx) => (
          <div
            key={idx}
            className="flex items-center gap-1 rounded-sm px-1"
            style={{
              color: event.color!,
              backgroundColor: `${event.color}55`,
            }}
          >
            <div
              className="h-1.5 w-1.5 shrink-0 rounded-full"
              style={{ backgroundColor: event.color! }}
            />
            <p className="line-clamp-1">{event.summary}</p>
          </div>
        ))}
      </div>
      {events && events.length > 2 && (
        <span className="text-muted-foreground block text-xs">
          +{events.length - 2} mehr
        </span>
      )}
    </div>
  );
}
