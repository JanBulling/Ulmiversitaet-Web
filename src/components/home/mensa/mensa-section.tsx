import { getMensaMenu } from "@/lib/mensa/get-mensa-menu";
import { MensaCategory } from "@/lib/mensa/menu.type";
import { cn } from "@/lib/utils";
import React from "react";
import { MensaSingleMeal } from "./mensa-single-meal";
import { MensaListMeal } from "./mensa-list-meal";
import { Button } from "@/ui/button";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import MensaGuru from "../mensa-guru/guru";
import { getTranslations } from "next-intl/server";

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
  const t = await getTranslations("HomePage.Mensa");

  const { date, mensaPlan } = await getMensaMenu();

  const singleCategoriesMensaPlan = mensaPlan?.filter(
    (menu) =>
      shownSingleCategories.includes(menu.category) && menu.meals.length === 1,
  );
  const listCategoriesMensaPlan = mensaPlan?.filter((menu) =>
    shownListCategories.includes(menu.category),
  );

  return (
    <section className={cn("bg-card border-y py-4 md:border", className)}>
      <div className="flex items-center justify-between gap-4 px-4">
        <h2 className="text-2xl font-bold">Mensa</h2>
        <div className="flex items-center gap-4">
          <p className="text-muted-foreground text-sm">
            <span className="xs:inline hidden">
              {t("date", { date: date })}
            </span>
          </p>
          <Link
            href="https://stwulm.my-mensa.de/mensatogo.php?mensa=2"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="default" size="sm" className="cursor-pointer">
              {t("orderWest")}
              <ExternalLink className="size-3" />
            </Button>
          </Link>
        </div>
      </div>

      {singleCategoriesMensaPlan?.length === 0 &&
        listCategoriesMensaPlan!.length === 0 && (
          <div className="text-muted-foreground mt-8 mb-12 text-center italic">
            {t("mensaClosed")}
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
          href="https://mensa.ulmiversitaet.de?utm=ulmiversitaet"
          // target="_blank"
          // rel="noopener noreferrer"
        >
          <Button variant="outline" className="cursor-pointer">
            {t("moreMeals")}
            <ExternalLink className="size-3" />
          </Button>
        </Link>
      </div>

      <div className="mt-4 flex items-center justify-center">
        <MensaGuru />
      </div>
    </section>
  );
}
