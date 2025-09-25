"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

import { DataTable } from "@/ui/table/data-table";
import { Button } from "@/ui/button";
import { CalendarEvent } from "@/content/events/events";
import EventsTableAction from "./events-action";

const dateFormatter = Intl.DateTimeFormat("de-DE", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

export const columns: ColumnDef<CalendarEvent>[] = [
  {
    accessorKey: "color",
    header: "",
    cell: ({ row }) => {
      const colorHex = row.getValue("color") as string;

      return (
        <div
          className="border-foreground h-5 w-5 border"
          style={{ backgroundColor: colorHex }}
        />
      );
    },
  },
  { accessorKey: "summary", header: "Event" },
  { accessorKey: "description", header: "Beschreibung" },
  { accessorKey: "location", header: "Ort" },
  {
    accessorKey: "startDate",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Startdatum
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      let text = dateFormatter.format(row.getValue("startDate"));

      const time = row.original.startTime;
      if (time) {
        text += ", " + time;
      }

      return text;
    },
  },
  {
    accessorKey: "endDate",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Endzeit
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      let text = dateFormatter.format(row.getValue("endDate"));

      const time = row.original.endTime;
      if (time) {
        text += ", " + time;
      }

      return text;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <EventsTableAction event={row.original} />,
  },
];

interface EventTableProps {
  events: CalendarEvent[];
}

export default function EventsTable({ events }: EventTableProps) {
  return <DataTable searchColumn="summary" columns={columns} data={events} />;
}
