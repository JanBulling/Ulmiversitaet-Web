"use client";

import React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/ui/popover";
import { HsvColor, hexToHsv, hsvToHex } from "./converters";
import { ColorPicker } from "./color-picker";
import { Input } from "../input";

type Props = {
  onChange?: (value: string) => void;
  value?: string;
  initial?: string;
};

const ColorInput = React.forwardRef<
  React.ElementRef<typeof Input>,
  Omit<
    React.ComponentPropsWithoutRef<typeof Input>,
    "icon" | "right" | "value" | "onChange"
  > &
    Props
>(({ initial, value, onChange, ...props }, ref) => {
  const [open, setOpen] = React.useState<boolean>();
  const [color, setColor] = React.useState<HsvColor>(
    hexToHsv(initial ?? "#ffffff") ?? { h: 0, s: 0, v: 100 },
  );
  const [colorHex, setColorHex] = React.useState<string>(initial ?? "#ffffff");

  React.useEffect(() => {
    const newVal = hsvToHex(color);
    setColorHex(newVal);
    onChange?.(colorHex);
  }, [color, value]);

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
                backgroundColor: `${
                  colorHex.length === 7 ? colorHex : "#ffffff"
                }`,
              }}
            />
            <Input
              className="max-w-xs"
              ref={ref}
              value={colorHex}
              onClick={() => setOpen(true)}
              onFocus={() => setOpen(true)}
              onChange={(e) => {
                const hexValue = e.target.value;
                setColorHex(hexValue);

                const hsvColor = hexToHsv(hexValue);
                if (hsvColor) setColor(hsvColor);
              }}
              {...props}
            />
          </div>
        </div>
      </PopoverTrigger>
      <PopoverContent side="top" align="start">
        <ColorPicker onChange={setColor} value={color} />
      </PopoverContent>
    </Popover>
  );
});
ColorInput.displayName = "ColorInput";

export { ColorInput };
