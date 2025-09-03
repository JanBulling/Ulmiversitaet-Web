import LinkCategoryCard from "@/components/links/link-category-card";
import { getAllLinkCategories } from "@/content/links/links";
import BaseLayout from "@/layouts/base-layout";

export const dynamic = "force-static";

export default function LinksPage() {
  const allLinkCategories = getAllLinkCategories();

  return (
    <BaseLayout>
      <h1 className="text-2xl font-bold">Alle Links</h1>
      <p className="text-muted-foreground text-sm">
        Die Ulmiversität hat eine Sammlung von nützlichen Links, die den
        Uni-Alltag erleichtern sollen. Ein Link fehlt?{" "}
        <a href="mailto:info@ulmiversitaet.de" className="underline">
          <span>Schreibe uns!</span>
        </a>
      </p>

      <div className="my-8 flex flex-col gap-4">
        {allLinkCategories.map((category) => (
          <LinkCategoryCard key={category.slug} linkCategory={category} />
        ))}
      </div>
    </BaseLayout>
  );
}
