"use client";

import * as React from "react";

import { CalendarEvent } from "@/content/events/events";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import { Button } from "@/ui/button";
import DeleteEventDialog from "./delete-dialog";

export default function EventsTableAction({
  event,
}: {
  event?: CalendarEvent;
}) {
  // const [editOpen, setEditOpen] = React.useState<boolean>(false);
  const [deleteOpen, setDeleteOpen] = React.useState<boolean>(false);
  const [menuOpen, setMenuOpen] = React.useState<boolean>(false);

  if (!event) {
    return null;
  }

  return (
    <>
      <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <span className="sr-only">Open menu</span>
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {/* <DropdownMenuItem className="gap-2" onClick={() => setEditOpen(true)}>
            Bearbeiten
          </DropdownMenuItem> */}
          <DropdownMenuItem
            className="text-destructive gap-2"
            onClick={() => {
              setMenuOpen(false);
              setDeleteOpen(true);
            }}
          >
            Löschen
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DeleteEventDialog
        event={event}
        onOpenChange={() => setDeleteOpen(false)}
        open={deleteOpen}
      />
    </>
  );
}
