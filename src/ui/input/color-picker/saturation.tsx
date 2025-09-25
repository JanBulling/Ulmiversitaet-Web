import { useMove } from "@/hooks/use-move";
import React from "react";
import { HsvColor } from "./converters";

const THUMB_SIZES = 12;

type Props = {
  value: HsvColor;
  onChange(color: Partial<HsvColor>): void;
};

export function Saturation({ value, onChange }: Props) {
  const [position, setPosition] = React.useState({
    x: value.s / 100,
    y: 1 - value.v / 100,
  });
  const positionRef = React.useRef(position);

  React.useEffect(() => {
    setPosition({ x: value.s / 100, y: 1 - value.v / 100 });
  }, [value.s, value.v]);

  const { ref } = useMove(
    ({ x, y }) => {
      positionRef.current = { x, y };
      onChange({ s: Math.round(x * 100), v: Math.round((1 - y) * 100) });
    },
    {
      onScrubEnd: () => {
        const { x, y } = positionRef.current;
        onChange({ s: Math.round(x * 100), v: Math.round((1 - y) * 100) });
      },
    },
  );

  return (
    <div
      className="relative z-100 h-36 w-full rounded-md border"
      ref={ref}
      role="slider"
      aria-valuenow={0}
    >
      <div
        className="absolute -inset-2 rounded-md"
        style={{ backgroundColor: `hsl(${value.h}, 100%, 50%)` }}
      />
      <div
        className="absolute -inset-2 rounded-md"
        style={{ backgroundImage: "linear-gradient(90deg, #fff, transparent)" }}
      />

      <div
        className="absolute -inset-2 rounded-md"
        style={{ backgroundImage: "linear-gradient(0deg, #000, transparent)" }}
      />

      <div
        className="absolute rounded-full border-[3px] border-white"
        style={{
          left: `calc(${position.x * 100}% - ${THUMB_SIZES}px / 2)`,
          top: `calc(${position.y * 100}% - ${THUMB_SIZES}px / 2)`,
          height: THUMB_SIZES,
          width: THUMB_SIZES,
        }}
      />
    </div>
  );
}
