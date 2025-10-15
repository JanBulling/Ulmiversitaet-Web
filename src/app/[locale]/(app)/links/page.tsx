import LinkCategoryCard from "@/components/links/link-category-card";
import { getAllLinkCategories } from "@/content/links/links";
import BaseLayout from "@/layouts/base-layout";
import { Metadata } from "next";
import { useTranslations } from "next-intl";

// Wrong since already statically generated using internationalization
// export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Links",
  description:
    "Sammlung aller nützlichen Links für Studierende an der Universität Ulm.",
};

export default function LinksPage() {
  const t = useTranslations("LinkPage");

  const allLinkCategories = getAllLinkCategories();

  return (
    <BaseLayout>
      <div className="px-4">
        <h1 className="text-2xl font-bold">{t("title")}</h1>
        <p className="text-muted-foreground text-sm">
          {t.rich("description", {
            a: (chunks) => (
              <a href="mailto:info@ulmiversitaet.de" className="underline">
                {chunks}
              </a>
            ),
          })}
        </p>
      </div>

      <div className="my-8 flex flex-col gap-4 md:px-4">
        {allLinkCategories.map((category) => (
          <LinkCategoryCard key={category.slug} linkCategory={category} />
        ))}
      </div>
    </BaseLayout>
  );
}
