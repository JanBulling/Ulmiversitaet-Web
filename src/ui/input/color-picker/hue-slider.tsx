import React from "react";
import { BaseColorSliderProps, ColorSlider } from "./color-slider";

type HueSliderProps = BaseColorSliderProps;

export const HueSlider = React.forwardRef<HTMLDivElement, HueSliderProps>(
  ({ value, onChange, ...props }, ref) => {
    return (
      <ColorSlider
        ref={ref}
        onChange={onChange}
        value={value}
        maxValue={360}
        overlays={[
          {
            backgroundImage:
              "linear-gradient(to right,hsl(0,100%,50%),hsl(60,100%,50%),hsl(120,100%,50%),hsl(170,100%,50%),hsl(240,100%,50%),hsl(300,100%,50%),hsl(360,100%,50%))",
          },
          {
            boxShadow: `rgba(0, 0, 0, .05) 0 0 0 1rem inset, rgb(0, 0, 0, .15) 0 0 4rem inset`,
          },
        ]}
        {...props}
      />
    );
  },
);
HueSlider.displayName = "HueSlider";
