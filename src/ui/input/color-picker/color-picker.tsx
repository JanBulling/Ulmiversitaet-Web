import React from "react";
import { HueSlider } from "./hue-slider";
import { Saturation } from "./saturation";
import { HsvColor } from "./converters";

type Props = {
  onChange(value: HsvColor): void;
  value: HsvColor;
};

export function ColorPicker({ onChange, value }: Props) {
  const [colorValue, setColorValue] = React.useState<HsvColor>(value);

  React.useEffect(() => onChange(colorValue), [colorValue, onChange]);

  return (
    <>
      <Saturation
        value={value}
        onChange={(e) => setColorValue((old) => ({ ...old, ...e }))}
      />
      <HueSlider
        className="mt-4"
        onChange={(h) => setColorValue((old) => ({ ...old, h: h }))}
        value={value.h}
      />
    </>
  );
}
