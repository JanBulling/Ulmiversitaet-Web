import React from "react";

type SwatchesProps = {
  onSelect(hex: string): void;
  swatches: string[];
  swatchesPerRow?: number;
};

export const Swatches = React.forwardRef<HTMLDivElement, SwatchesProps>(
  ({ onSelect, swatches, swatchesPerRow = 7 }, ref) => {
    return (
      <div
        ref={ref}
        className="mt-2 grid gap-1"
        style={{
          gridTemplateColumns: `repeat(${swatchesPerRow}, minmax(0, 1fr))`,
        }}
      >
        {swatches.map((hex) => (
          <div
            key={hex}
            className="aspect-square cursor-pointer rounded border"
            style={{ backgroundColor: hex }}
            onClick={() => onSelect(hex)}
          />
        ))}
      </div>
    );
  },
);
Swatches.displayName = "Swatches";
