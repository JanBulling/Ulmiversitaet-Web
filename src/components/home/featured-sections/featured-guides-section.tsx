import { getFeaturedGuides } from "@/content/guides/guides";
import { ArrowRight, BookTextIcon, ChevronRight } from "lucide-react";
import { unstable_cache } from "next/cache";
import Link from "next/link";

const featuredGuides = unstable_cache(
  async () => await getFeaturedGuides(),
  ["featured_guides"],
  { revalidate: 86400, tags: ["featured_guides"] },
);

export async function FeaturedGuidesSection() {
  const guides = await featuredGuides();

  return (
    <section className="px-4">
      <h2 className="text-2xl font-bold">Anleitungen</h2>
      <p className="text-muted-foreground text-sm">
        Es gibt diverse Anleitungen für den Uni-Alltag von der Ulmiversität
      </p>

      <ul className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
        {guides.map((guide) => (
          <Link
            key={guide.filePath}
            href={`/guides/${guide.filePath}`}
            className="group block"
            aria-label={`Anleitung öffnen: ${guide.metadata.title}`}
          >
            <li className="bg-muted hover:bg-background flex h-full items-center gap-2 rounded-lg border px-4 py-2 transition-colors duration-200">
              <div className="h-full flex-1">
                <h3 className="font-semibold">{guide.metadata.title}</h3>
                <p className="text-muted-foreground text-sm">
                  {guide.metadata.summary}
                </p>
              </div>
              <ChevronRight className="text-muted-foreground mt-1 size-5 shrink-0 self-center transition-transform duration-200 group-hover:translate-x-0.5" />
            </li>
          </Link>
        ))}
        <Link href="/guides" className="group block rounded-xl sm:col-span-2">
          <li className="border-primary hover:border-primary/50 hover:text-primary/50 text-primary flex items-center gap-4 rounded-lg border-2 border-dashed px-4 py-4">
            <BookTextIcon className="size-6" />
            <h3 className="flex-1 font-semibold">Weitere Anleitungen</h3>
            <ArrowRight className="size-5 shrink-0 self-center transition-transform duration-200 group-hover:translate-x-0.5" />
          </li>
        </Link>
      </ul>
    </section>
  );
}
