import React from "react";
import { HueSlider } from "./hue-slider";
import { Saturation } from "./saturation";
import { hexToHsv, hsvToHex, type HsvColor } from "./converters";
import { Swatches } from "./swatches";
import { useUncontrolled } from "@/hooks/use-uncontrolled";

type Props = {
  onChange?: (value: string) => void;
  value: string;
  swatches?: string[];
  swatchesPerRow?: number;
  defaultValue?: string;
};

export function ColorPicker({
  onChange,
  value,
  defaultValue = "#FFFFFF",
  swatchesPerRow,
  swatches,
}: Props) {
  const valueRef = React.useRef<string>("");

  const [_value, setValue] = useUncontrolled({
    value,
    defaultValue,
    finalValue: "#FFFFFF",
    onChange,
  });

  const [parsed, setParsed] = React.useState<HsvColor>(
    hexToHsv(_value) ?? { h: 0, s: 0, v: 100 },
  );

  const handleChange = (color: Partial<HsvColor>) => {
    const next = { ...parsed, ...color };
    const nextHex = hsvToHex(next);
    valueRef.current = nextHex;

    setParsed(next);
    setValue(nextHex);
  };

  return (
    <>
      <Saturation value={parsed} onChange={handleChange} />
      <HueSlider
        className="mt-4"
        onChange={(h) => handleChange({ h })}
        value={parsed.h}
      />
      {swatches && (
        <Swatches
          onSelect={(hex) => {
            console.log("SELECT", hex);
            handleChange(hexToHsv(hex) ?? { h: 0, s: 0, v: 100 });
          }}
          swatches={swatches}
          swatchesPerRow={swatchesPerRow}
        />
      )}
    </>
  );
}
