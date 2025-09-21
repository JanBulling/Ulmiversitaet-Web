import { env } from "@/env.mjs";
import { calendar_v3, google } from "googleapis";

export type CalendarResponse = {
  nextSyncToken: string | null;
  events: CalendarEvent[];
};

type EventStatus = "CANCELLED" | "CONFIRMED" | "TENTATIVE";

export type CalendarEvent = {
  id: string;
  status: EventStatus;

  summary: string;
  description?: string | null;
  location?: string | null;
  htmlLink?: string | null;

  color?: string | null;

  start: Date;
  end: Date;

  createdAt: Date;
  updatedAt: Date;
};

// the colorId from google calendar `id - 1` is the index of the array
// const colors = ["#ac725e", "#d06b64","#f83a22","#fa573c","#ff7537","#ffad46","#42d692","#16a765","#7bd148","#b3dc6c","#fbe983","#fad165","#92e1c0","#9fe1e7","#9fc6e7","#4986e7","#9a9cff","#b99aff","#c2c2c2","#cabdbf","#cca6ac","#f691b2","#cd74e6","#a47ae2"];
const colors = [
  "#a4bdfc",
  "#7ae7bf",
  "#dbadff",
  "#ff887c",
  "#fbd75b",
  "#46d6db",
  "#e1e1e1",
  "#5484ed",
  "#51b749",
  "#dc2127",
];
const defaultColor = "#f83a22";

function googleOAuth2() {
  const oauth2Client = new google.auth.OAuth2(
    env.GOOGLE_CLIENT_ID,
    env.GOOGLE_CLIENT_SECRET,
  );

  oauth2Client.setCredentials({
    refresh_token: env.GOOGLE_REFRESH_TOKEN,
  });

  return oauth2Client;
}

function formatDate(
  dateTime?: string | null,
  date?: string | null,
  _timeZone?: string | null,
): Date {
  if (date) return new Date(date);

  if (dateTime) return new Date(dateTime);

  return new Date();
}

export async function performSync(
  calendarId: string,
  syncToken?: string,
): Promise<CalendarResponse> {
  const auth = googleOAuth2();
  const calendar = google.calendar({ version: "v3", auth: auth });

  let nextPageToken: string | null = null;
  let nextSyncToken: string | null = null;
  const events: CalendarEvent[] = [];

  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

  do {
    const eventData: calendar_v3.Schema$Events = (
      await calendar.events.list({
        calendarId: calendarId,
        timeMin: !syncToken ? oneYearAgo.toISOString() : undefined,
        maxResults: 30,
        singleEvents: true,
        syncToken: syncToken,
        pageToken: nextPageToken ?? undefined,
      })
    ).data;

    nextPageToken = eventData.nextPageToken ?? null;
    nextSyncToken = eventData.nextSyncToken ?? null;

    const calendarEvents = eventData.items;

    calendarEvents?.forEach((e) =>
      events.push({
        id: e.id ?? "",
        status: (e.status?.toUpperCase() as EventStatus) ?? "CONFIRMED",
        summary: e.summary ?? "",
        description: e.description ?? undefined,
        location: e.location ?? undefined,
        htmlLink: e.htmlLink ?? undefined,
        color: e.colorId ? colors[+e.colorId] : defaultColor,
        start: formatDate(e.start?.dateTime, e.start?.date, e.start?.timeZone),
        end: formatDate(e.end?.dateTime, e.end?.date, e.end?.timeZone),
        createdAt: formatDate(e.created),
        updatedAt: formatDate(e.updated),
      }),
    );
  } while (nextPageToken !== null);

  return { nextSyncToken, events };
}
