import { getMensaMenu } from "@/lib/mensa/get-mensa-menu";
import { MensaCategory } from "@/lib/mensa/menu.type";
import { cn } from "@/lib/utils";
import React from "react";
import { MensaSingleMeal } from "./mensa-single-meal";
import { MensaListMeal } from "./mensa-list-meal";
import { Button } from "@/ui/button";
import Link from "next/link";
import { ExternalLink } from "lucide-react";

const shownSingleCategories: MensaCategory[] = [
  "SATTMACHER",
  "TOPF UND PFANNE",
  "PRIMA KLIMA",
  "FLEISCH UND FISCH",
];

const shownListCategories: MensaCategory[] = [
  "PIZZA",
  "PASTA",
  "SNACKS",
  "DESSERT",
];

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
    <section className={cn("bg-card border-y py-4 md:border", className)}>
      <div className="flex items-center gap-4 px-4 md:justify-between">
        <h2 className="text-2xl font-bold">Mensa</h2>
        <p className="text-muted-foreground text-sm">
          Heute, {dateFormatter.format(date)}
        </p>
      </div>

      {singleCategoriesMensaPlan?.length === 0 &&
        listCategoriesMensaPlan!.length === 0 && (
          <div className="text-muted-foreground mt-8 mb-12 text-center italic">
            Mensa heute geschlossen
          </div>
        )}

      <div className="divide-accent divide-y">
        {singleCategoriesMensaPlan &&
          singleCategoriesMensaPlan.map((p) => (
            <MensaSingleMeal
              key={p.category}
              meal={p.meals[0]}
              category={p.category}
            />
          ))}
      </div>
      {listCategoriesMensaPlan &&
        listCategoriesMensaPlan.map((p) => (
          <MensaListMeal
            key={p.category}
            meals={p.meals}
            category={p.category}
          />
        ))}

      <div className="flex items-center justify-center">
        <Link
          href="https://mensa.ulmiversitaet.de"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button variant="outline" className="cursor-pointer">
            Mehr Gerichte
            <ExternalLink className="size-3" />
          </Button>
        </Link>
      </div>
    </section>
  );
}
