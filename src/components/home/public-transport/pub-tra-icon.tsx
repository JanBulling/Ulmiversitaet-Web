import { cn } from "@/lib/utils";

interface RouteIconProps extends React.ComponentProps<"svg"> {
  route: string;
}

const routeToColorMap: Record<string, string> = {
  "1": "#E52129",
  "2": "#3EAD56",
  "4": "#14816E",
  "5": "#17A9BF",
  "6": "#F39437",
  "7": "#B2116C",
  "8": "#77418F",
  "9": "#E09DBC",
  "10": "#A5A158",
  "11": "#085EA4",
  "12": "#B22E2B",
  "13": "#7CC191",
  "14": "#26ABE3",
  "15": "#B281B8",
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

const squareIcon = ["1", "2", "W", "F", "-"];

const specialRouteMap: Record<string, string> = {
  "101": "1", // Route 1 as a bus
  "102": "2", // Route 2 as a bus
  "201": "S", // Werkstattfahrt
  "202": "S", // Fahrschule
  "19": "E",
};

export default function PublicTransportRouteIcon({
  route,
  className,
  ...props
}: RouteIconProps) {
  const actualRoute = specialRouteMap[route] ?? route;
  const isTram = squareIcon.includes(actualRoute);
  const color = routeToColorMap[actualRoute] ?? defaultColor;

  const isWhite = color === "#FFFFFF";

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 40 40"
      width="40"
      height="40"
      className={cn("size-8", className)}
      {...props}
    >
      {isTram ? (
        <rect
          x="0"
          y="0"
          width="40"
          height="40"
          fill={color}
          stroke={isWhite ? "#000000" : "transparent"}
          strokeWidth="2"
        />
      ) : (
        <circle
          cx="20"
          cy="20"
          r="20"
          fill={color}
          stroke={isWhite ? "#000000" : "transparent"}
          strokeWidth="2"
        />
      )}
      <text
        x="50%"
        y="50%"
        fill={isWhite ? "#000000" : "#FFFFFF"}
        fontSize="26"
        fontWeight="400"
        fontFamily="sans-serif"
        textAnchor="middle"
        dominantBaseline="central"
      >
        {actualRoute}
      </text>
    </svg>
  );
}
