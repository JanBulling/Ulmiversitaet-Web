import AddEventForm from "@/components/admin/events/add-event-form";
import EventsTable from "@/components/admin/events/events-table";
import { db } from "@/lib/db/db";
import { eventsTable } from "@/lib/db/schema";
import { asc } from "drizzle-orm";

export const dynamic = "force-dynamic";

export default async function AdminEventsPage() {
  const events = await db
    .select()
    .from(eventsTable)
    .orderBy(asc(eventsTable.startDate));

  return (
    <div>
      <h1 className="text-2xl font-bold">Events</h1>
      <p className="text-muted-foreground text-sm">
        Events auf der Ulmiversität hinzufügen und ändern
      </p>

      <AddEventForm className="mt-8" />

      <div className="bg-card my-8 rounded-md border p-4 shadow">
        <h2 className="text-xl font-semibold">Aktuelle Events</h2>
        <EventsTable events={events} />
      </div>
    </div>
  );
}
