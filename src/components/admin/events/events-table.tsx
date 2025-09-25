"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

import { DataTable } from "@/ui/table/data-table";
import { Button } from "@/ui/button";
import { CalendarEvent } from "@/content/events/events";

const dateFormatter = Intl.DateTimeFormat("de-DE", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

export const columns: ColumnDef<CalendarEvent>[] = [
  { accessorKey: "summary", header: "Event" },
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
    cell: ({ row }) =>
      `${dateFormatter.format(row.getValue("startDate"))},  ${row.original.startTime}`,
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
    cell: ({ row }) =>
      `${dateFormatter.format(row.getValue("endDate"))},  ${row.original.endTime}`,
  },
];

interface EventTableProps {
  events: CalendarEvent[];
}

export default function EventsTable({ events }: EventTableProps) {
  return <DataTable searchColumn="summary" columns={columns} data={events} />;
}
