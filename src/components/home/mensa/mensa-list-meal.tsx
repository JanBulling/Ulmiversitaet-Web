import {
  MensaCategory,
  mensaCategoryColorMap,
  MensaCategoryDefaultIcon,
  mensaCategoryIconMap,
  MensaMeal,
} from "@/lib/mensa/menu.type";
import { Rating } from "@/ui/rating";
import { useLocale } from "next-intl";
import Link from "next/link";

interface MensaListMealProps {
  meals: MensaMeal[];
  category: MensaCategory;
}

export function MensaListMeal({ category, meals }: MensaListMealProps) {
  const locale = useLocale();

  const Icon = mensaCategoryIconMap[category] ?? MensaCategoryDefaultIcon;

  return (
    <div className="py-4">
      <div
        className="flex items-center gap-2 px-4"
        style={{ color: mensaCategoryColorMap[category] }}
      >
        <h3 className="font-mono font-bold">{category}</h3>
        <Icon size={16} />
      </div>
      {meals.map((meal) => (
        <Link
          key={meal.name}
          href={`https://mensa.ulmiversitaet.de/meal/${meal.slug}`}
        >
          <div className="hover:bg-muted flex items-center justify-between gap-4 px-4 py-1">
            <h4 className="flex-1 text-xs font-semibold md:text-sm">
              {locale === "de" ? meal.name : meal.nameEn}
            </h4>
            <Rating
              className="shrink-0"
              size={16}
              value={meal.rating ?? 0}
              numberRatings={meal.numberRatings ?? 0}
            />
            <p className="text-muted-foreground font-mono text-sm">
              {meal.prices.student}€
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
