"use client";

import * as React from "react";

import { CalendarEvent } from "@/content/events/events";
import { Button } from "@/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/ui/dialog";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface EventDeleteDialogProps {
  event: CalendarEvent;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function DeleteEventDialog({
  event,
  open,
  onOpenChange,
}: EventDeleteDialogProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string>();
  const router = useRouter();

  React.useEffect(() => {
    console.log("OPEN", open);
  }, [open]);

  async function deleteEvent() {
    setIsLoading(true);

    const request = await fetch("/api/event", {
      method: "DELETE",
      body: JSON.stringify({ id: event.id }),
    });

    setIsLoading(false);

    if (request.ok) {
      router.refresh();
      onOpenChange(false);
    } else {
      const text = await request.text();
      console.error("DELETE", text);
      setError("Something went wrong: " + (text ?? "??"));
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Kategorie löschen</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Das ausgewählte Event{" "}
          <span className="font-bold">{event.summary}</span> wird unwiderruflich
          gelöscht.
        </DialogDescription>

        {error && <p className="text-destructive text-xs">{error}</p>}

        <DialogFooter>
          <Button variant="destructive" onClick={() => deleteEvent()}>
            {isLoading && <Loader2 />}
            Löschen
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
