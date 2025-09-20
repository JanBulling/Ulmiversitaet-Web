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

function googleOAuth2() {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
  );

  oauth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
  });

  return oauth2Client;
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
        color: e.colorId ?? undefined,
        start: new Date(e.start?.dateTime ?? ""),
        end: new Date(e.end?.dateTime ?? ""),
        createdAt: new Date(e.created ?? ""),
        updatedAt: new Date(e.updated ?? ""),
      }),
    );
  } while (nextPageToken !== null);

  return { nextSyncToken, events };
}
