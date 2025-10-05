"use client";

import React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/ui/popover";
import { HsvColor, hexToHsv, hsvToHex } from "./converters";
import { ColorPicker } from "./color-picker";
import { Input } from "../input";
import { useUncontrolled } from "@/hooks/use-uncontrolled";

type Props = {
  onChange: (value: string) => void;
  value?: string;
  initial?: string;
  swatches?: string[];
};

const ColorInput = React.forwardRef<
  React.ElementRef<typeof Input>,
  Omit<
    React.ComponentPropsWithoutRef<typeof Input>,
    "icon" | "right" | "value" | "onChange"
  > &
    Props
>(({ initial, swatches, onChange, value, ...props }, ref) => {
  const [open, setOpen] = React.useState<boolean>();

  const [_value, setValue] = useUncontrolled({
    value,
    defaultValue: initial ?? "#000000",
    finalValue: "",
    onChange,
  });

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        asChild
        onClick={(e) => {
          e.preventDefault();
        }}
      >
        <div>
          <div className="flex items-center gap-2">
            <div
              className="h-5 w-5 shrink-0 rounded-full border"
              style={{
                backgroundColor: `${_value.length === 7 ? _value : "#ffffff"}`,
              }}
            />
            <Input
              className="max-w-xs"
              ref={ref}
              value={_value}
              onClick={() => setOpen(true)}
              onFocus={() => setOpen(true)}
              onChange={(event) => {
                const inputValue = event.currentTarget.value;
                setValue(inputValue);
              }}
              {...props}
            />
          </div>
        </div>
      </PopoverTrigger>
      <PopoverContent side="top" align="start">
        <ColorPicker
          onChange={setValue}
          value={_value}
          swatches={swatches}
          defaultValue={initial}
        />
      </PopoverContent>
    </Popover>
  );
});
ColorInput.displayName = "ColorInput";

export { ColorInput };
