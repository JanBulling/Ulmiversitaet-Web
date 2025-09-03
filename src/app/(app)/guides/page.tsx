import GuideCard from "@/components/guides/guide-card";
import { getAllGuides } from "@/content/guides/guides";
import SiteLayout from "@/layouts/site-layout";

export const dynamic = "force-static";

export default function GuidesPage() {
  const allGuides = getAllGuides();

  return (
    <SiteLayout>
      <h1 className="text-2xl font-bold">Anleitungen der Ulmiversität</h1>
      <p className="text-muted-foreground text-sm">
        Die Ulmiversität hat eine Sammlung von Anleitungen, die den Uni-Alltag
        erleichtern sollen. Eine Anleitung fehlt oder Du hast weitere Ideen?{" "}
        <a href="mailto:info@ulmiversitaet.de" className="underline">
          <span>Schreibe uns!</span>
        </a>
      </p>

      <div className="my-8 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {allGuides.map((guide) => (
          <GuideCard key={guide.slug} guide={guide} />
        ))}
      </div>
    </SiteLayout>
  );
}
