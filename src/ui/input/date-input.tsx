"use client";

import * as React from "react";

import { Popover, PopoverContent, PopoverTrigger } from "../popover";
import { Button } from "../button";
import { ChevronDownIcon } from "lucide-react";
import { Calendar } from "./calendar-input";

interface DateInputProps
  extends Omit<React.ComponentProps<"button">, "value" | "onChange"> {
  value?: Date;
  onChange?: (date?: Date) => void;
}

export function DateInput({ value, onChange, ...props }: DateInputProps) {
  const [open, setOpen] = React.useState(false);
  const [date, setDate] = React.useState<Date | undefined>(undefined);

  React.useEffect(() => {
    setDate(value);
  }, [value]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          id="date"
          className="w-48 justify-between font-normal"
          {...props}
        >
          {date ? date.toLocaleDateString() : "Datum auswählen"}
          <ChevronDownIcon />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto overflow-hidden p-0" align="start">
        <Calendar
          mode="single"
          selected={value}
          captionLayout="dropdown"
          onSelect={(date) => {
            setDate(date);
            onChange?.(date);
            setOpen(false);
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
