import {
  MensaCategory,
  mensaCategoryColorMap,
  MensaMeal,
} from "@/lib/mensa/menu.type";
import { generateSlug } from "@/lib/utils";
import { Rating } from "@/ui/rating";
import Link from "next/link";

interface MensaSingleMealProps {
  meal: MensaMeal;
  category: MensaCategory;
}

export function MensaSingleMeal({ category, meal }: MensaSingleMealProps) {
  const slug = generateSlug(meal.name);

  return (
    <Link href={`https://mensa.ulmiversitaet.de/meal/${slug}`}>
      <div className="hover:bg-muted px-4 py-2">
        <div
          className="flex items-center justify-between"
          style={{ color: mensaCategoryColorMap[category] }}
        >
          <h3 className="font-mono font-bold">{category}</h3>
          <Rating
            value={meal.rating ?? 0}
            numberRatings={meal.numberRatings ?? 0}
          />
        </div>
        <div className="mt-1 flex items-center justify-between gap-4">
          <h4 className="font-semibold">{meal.name}</h4>
          <p className="text-muted-foreground font-mono text-sm">
            {meal.prices.student}€
          </p>
        </div>
        <div className="text-muted-foreground flex items-center gap-2 text-xs">
          <p>
            <b>Kalorien:</b> {meal.nutrition.calories}kcal
          </p>
          <p>
            <b>Protein:</b> {meal.nutrition.protein}g
          </p>
        </div>
      </div>
    </Link>
  );
}
