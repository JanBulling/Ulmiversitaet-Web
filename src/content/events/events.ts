export type CalendarEvent = {
  id?: string | null;

  summary: string;
  description?: string | null;
  location?: string | null;
  color?: string | null;

  startDate: Date;
  endDate: Date;

  startTime?: string | null;
  endTime?: string | null;

  wholeDay: boolean;
};
