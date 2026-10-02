import { cn } from "@/lib/utils";

interface RouteIconProps extends React.ComponentProps<"span"> {
  route: string;
  isTram: boolean;
  color?: string;
}

// Fallback for when the API has no live colour (no vehicle on the line yet)
const routeToColorMap: Record<string, string> = {
  "1": "#ED1B24",
  "2": "#37B355",
  "4": "#01806D",
  "5": "#1AA8BE",
  "6": "#F79534",
  "7": "#B1006A",
  "8": "#76408C",
  "9": "#DF9CBB",
  "10": "#A5A158",
  "11": "#005DA3",
  "12": "#B22C2B",
  "13": "#7AC4A5",
  "14": "#00ADEF",
  "15": "#B382BA",
  "16": "#DE4B95",
  "17": "#CC9900",
  E: "#FFFFFF",
  N1: "#E52129",
  N2: "#77418F",
  N3: "#82BC46",
  N4: "#1BB5EB",
  N5: "#085EA4",
  N6: "#057A4A",
  N7: "#DE4B95",
  N8: "#F39437",
};
const defaultColor = "#FFFFFF";

export default function PublicTransportRouteIcon({
  route,
  isTram,
  color: liveColor,
  className,
  ...props
}: RouteIconProps) {
  const color = liveColor ?? routeToColorMap[route] ?? defaultColor;

  const isWhite = color === "#FFFFFF";

  return (
    <span
      className={cn(
        "flex size-8 shrink-0 items-center justify-center font-sans text-[15px] leading-none font-semibold tabular-nums",
        isTram ? "rounded-none" : "rounded-full",
        isWhite ? "border-2 border-black text-black" : "text-white",
        className,
      )}
      style={{ backgroundColor: color }}
      {...props}
    >
      {route}
    </span>
  );
}
