import AddEventForm from "@/components/admin/events/add-event-form";
import EventsTable from "@/components/admin/events/events-table";
import { db } from "@/lib/db/db";
import { eventsTable } from "@/lib/db/schema";

export default async function AdminEventsPage() {
  const events = await db.select().from(eventsTable);

  return (
    <div>
      <h1 className="text-2xl font-bold">Events</h1>
      <p className="text-muted-foreground text-sm">
        Events auf der Ulmiversität hinzufügen und ändern
      </p>

      <AddEventForm className="mt-8" />

      <h2 className="mt-8 text-xl font-semibold">Aktuelle Events</h2>
      <EventsTable events={events} />
    </div>
  );
}
