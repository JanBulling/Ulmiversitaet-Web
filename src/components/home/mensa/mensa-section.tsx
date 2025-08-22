import { getMensaMenu } from "@/lib/mensa/get-mensa-menu";
import { MensaCategory } from "@/lib/mensa/menu.type";
import { cn } from "@/lib/utils";
import React from "react";

const shownSingleCategories: MensaCategory[] = [
  "SATTMACHER",
  "TOPF UND PFANNE",
  "PRIMA KLIMA",
  "FLEISCH UND FISCH",
];

const shownListCategories: MensaCategory[] = ["PIZZA", "PASTA", "SNACKS"];

export async function MensaSection({
  className,
}: React.ComponentProps<"section">) {
  const { date, mensaPlan } = await getMensaMenu();

  const dateFormatter = Intl.DateTimeFormat("de-DE", {
    month: "short",
    day: "numeric",
    weekday: "long",
  });

  const singleCategoriesMensaPlan = mensaPlan?.filter(
    (menu) =>
      shownSingleCategories.includes(menu.category) && menu.meals.length === 1,
  );
  const listCategoriesMensaPlan = mensaPlan?.filter((menu) =>
    shownListCategories.includes(menu.category),
  );

  return (
    <section className={cn("bg-card border-y px-4 py-2 md:border", className)}>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Mensa</h2>
        <p className="text-muted-foreground text-sm">
          {dateFormatter.format(date)}
        </p>
      </div>
      {!singleCategoriesMensaPlan && !listCategoriesMensaPlan && (
        <div>Mensa heute geschlossen</div>
      )}
      <div className="divide-y">
        {singleCategoriesMensaPlan &&
          singleCategoriesMensaPlan.map((p) => {
            const meal = p.meals[0];

            return (
              <div key={p.category} className="py-2">
                <div className="flex items-center justify-between">
                  <p>{p.category}</p>
                  <p>{meal.rating}</p>
                </div>
                <div className="flex items-center justify-between">
                  <h4 className="font-bold">{meal.name}</h4>
                  <p>{meal.prices.student}€</p>
                </div>
              </div>
            );
          })}
      </div>
    </section>
  );
}
