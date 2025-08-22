import {
  MensaCategory,
  mensaCategoryColorMap,
  MensaCategoryDefaultIcon,
  mensaCategoryIconMap,
  MensaMeal,
} from "@/lib/mensa/menu.type";
import { generateSlug } from "@/lib/utils";
import { Rating } from "@/ui/rating";
import Link from "next/link";

interface MensaListMealProps {
  meals: MensaMeal[];
  category: MensaCategory;
}

export function MensaListMeal({ category, meals }: MensaListMealProps) {
  const Icon = mensaCategoryIconMap[category] ?? MensaCategoryDefaultIcon;

  return (
    <div className="py-4">
      <div
        className="flex items-center gap-2 px-4"
        style={{ color: mensaCategoryColorMap[category] }}
      >
        <h3 className="font-bold">{category}</h3>
        <Icon size={16} />
      </div>
      {meals.map((meal) => (
        <Link
          key={meal.name}
          href={`https://mensa.ulmiversitaet.de/meal/${generateSlug(meal.name)}`}
        >
          <div className="hover:bg-muted flex items-center justify-between px-4 py-1">
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-semibold">{meal.name}</h4>
              <Rating
                size={16}
                value={meal.rating ?? 0}
                numberRatings={meal.numberRatings ?? 0}
              />
            </div>
            <p className="text-muted-foreground text-sm">
              {meal.prices.student}€
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
