import { useMergedRef } from "@/hooks/use-merged-ref";
import { useMove } from "@/hooks/use-move";
import { cn } from "@/lib/utils";
import React from "react";

export interface BaseColorSliderProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "value" | "onChange"> {
  variant?: string;
  value: number;
  onChange(value: number): void;
}

interface ColorSliderProps extends BaseColorSliderProps {
  maxValue: number;
  overlays: React.CSSProperties[];
}

const THUMB_SIZES = 12;

export const ColorSlider = React.forwardRef<HTMLDivElement, ColorSliderProps>(
  ({ value, maxValue, overlays, onChange, className, ...props }, ref) => {
    const round = true;
    const [position, setPosition] = React.useState(value / maxValue);

    const getChangeValue = (val: number) =>
      round ? Math.round(val * maxValue) : val * maxValue;

    const { ref: sliderRef } = useMove(({ x }) => {
      setPosition(x);
      onChange(getChangeValue(x));
    });

    React.useEffect(() => {
      setPosition(value / maxValue);
    }, [value, maxValue]);

    const layers = overlays.map((overlay, index) => (
      <div
        className="absolute -inset-x-2 inset-y-0 rounded-full border"
        style={overlay}
        key={index}
      />
    ));

    return (
      <div
        ref={useMergedRef(sliderRef, ref)}
        className={cn("relative h-4 w-full", className)}
        role="slider"
        aria-valuenow={value}
        aria-valuemax={maxValue}
        aria-valuemin={0}
        {...props}
      >
        {layers}
        <div
          className="absolute inset-y-0 my-auto rounded-full border-[3px] border-white"
          style={{
            left: `calc(${position * 100}% - ${THUMB_SIZES}px / 2)`,
            height: THUMB_SIZES,
            width: THUMB_SIZES,
          }}
        />
      </div>
    );
  },
);
ColorSlider.displayName = "ColorSlider";
