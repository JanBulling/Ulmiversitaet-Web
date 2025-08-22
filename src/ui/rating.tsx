import { cn } from "@/lib/utils";
import { LucideProps, StarIcon } from "lucide-react";
import { cloneElement, ReactElement } from "react";

export type RatingProps = LucideProps & {
  value?: number;
  maxRating?: number;
  numberRatings?: number;
  icon?: ReactElement<LucideProps>;
};

export const Rating = ({
  value = 0,
  maxRating = 5,
  numberRatings,
  size = 20,
  className,
  icon = <StarIcon />,
  ...props
}: RatingProps) => {
  return (
    <div
      aria-label="Rating"
      className={cn("inline-flex items-center gap-0.5", className)}
      role="radiogroup"
    >
      {Array.from({ length: maxRating }).map((_, idx) =>
        cloneElement(icon, {
          key: idx,
          size,
          ...props,
          className: cn(value - 0.5 >= idx && "fill-current"),
          "aria-hidden": true,
        }),
      )}
      <p className="ml-1 text-sm font-semibold">
        {value.toFixed(1)}{" "}
        {numberRatings !== 0 && numberRatings !== undefined && (
          <span className="font-normal">({numberRatings})</span>
        )}
      </p>
    </div>
  );
};
