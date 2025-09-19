import GuideCard from "@/components/guides/guide-card";
import {
  getAllGuideFolders,
  getAllGuides,
  getAllGuidesInFolder,
  getGuide,
} from "@/content/guides/guides";
import GuideLayout from "@/layouts/guide-layout";
import { CustomMDX } from "@/mdx-components";
import Link from "next/link";
import {
  ChevronRight,
  FolderOpenIcon,
  Clock4,
  CircleUserRound,
  ArrowLeft,
} from "lucide-react";
import BaseLayout from "@/layouts/base-layout";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { Button } from "@/ui/button";
import { MdxCodeDecorator } from "@/ui/mdx-code-decorator";

interface GuidePageProps {
  params: Promise<{ slug: string[] }>;
}

export async function generateStaticParams() {
  const allGuides = getAllGuides();

  const slugs = allGuides.map((guide) => ({
    slug: guide.filePath.split(/[/\\]+/),
  }));

  // Also generate params for folder pages
  const folderSlugs = new Set<string>();
  allGuides.forEach((guide) => {
    const pathParts = guide.filePath.split(/[/\\]+/);
    // Generate slugs for all parent folders
    for (let i = 1; i < pathParts.length; i++) {
      const folderPath = pathParts.slice(0, i).join("/");
      folderSlugs.add(folderPath);
    }
  });

  // Add folder slugs to the result
  folderSlugs.forEach((folderPath) => {
    slugs.push({
      slug: folderPath.split(/[/\\]+/),
    });
  });

  return slugs;
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: GuidePageProps): Promise<Metadata> {
  const guideFilePath = (await params).slug.join("/");

  const guide = getGuide(guideFilePath);

  if (guide) {
    return {
      title: guide.metadata.title ?? guideFilePath,
      description: guide.metadata.summary ?? undefined,
      openGraph: {
        title: guide.metadata.title ?? guideFilePath,
        description: guide.metadata.summary ?? undefined,
        type: "article",
        url: `${siteConfig.url}/guides/${guideFilePath}`,
        images: [
          {
            url: `/og?title=${
              guide.metadata.title ?? guideFilePath
            }&description=${guide.metadata.summary ?? undefined}`,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: guide.metadata.title ?? guideFilePath,
        description: guide.metadata.summary ?? undefined,
        images: [
          {
            url: `/og?title=${
              guide.metadata.title ?? guideFilePath
            }&description=${guide.metadata.summary ?? undefined}`,
          },
        ],
        creator: "@ulmiversitaet",
      },
    };
  }

  return {
    title: `Anleitungen in ${guideFilePath ?? "???"}`,
  };
}

export default async function GuidePage({ params }: GuidePageProps) {
  const guideFilePath = (await params).slug.join("/");

  const guide = getGuide(guideFilePath);

  if (guide) {
    // Compute published date (de-DE) and reading time
    const date = new Date(guide.metadata.publishedAt);
    const published = date.toLocaleDateString("de-DE", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    const words = guide.content.trim().split(/\s+/).length || 0;
    const readingTimeMin = Math.max(1, Math.ceil(words / 220));

    return (
      <GuideLayout>
        <div className="mx-auto w-full max-w-3xl px-4">
          {/* Header bar: back on left, meta on right (wraps on small screens) */}
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <Button variant="outline" size="sm" asChild>
              <Link href="/guides">
                <ArrowLeft className="mr-2 size-4" aria-hidden />
                Zurück zu Anleitungen
              </Link>
            </Button>

            <div className="ml-auto inline-flex flex-wrap items-center gap-x-3 gap-y-1 rounded bg-muted px-2 py-1 font-mono text-xs text-muted-foreground">
              <span>{published}</span>
              <span
                className="hidden h-1 w-1 rounded-full bg-muted-foreground/50 sm:inline"
                aria-hidden
              />
              {guide.metadata.author ? (
                <span className="inline-flex items-center gap-1.5">
                  <CircleUserRound className="size-4" aria-hidden />
                  {guide.metadata.author}
                </span>
              ) : null}
              <span
                className="hidden h-1 w-1 rounded-full bg-muted-foreground/50 sm:inline"
                aria-hidden
              />
              <span className="inline-flex items-center gap-1.5">
                <Clock4 className="size-4" aria-hidden />
                {readingTimeMin} Min
              </span>
            </div>
          </div>

          {/* Content box: shaded, rounded, comfortable padding */}
          <div className="rounded-xl border bg-card shadow-sm">
            <div className="prose prose-sm max-w-none p-4 sm:p-6 md:p-8 dark:prose-invert sm:prose-base">
              <MdxCodeDecorator>
                <CustomMDX source={guide.content} />
              </MdxCodeDecorator>
            </div>
          </div>
        </div>
      </GuideLayout>
    );
  }

  const allFolders = getAllGuideFolders(guideFilePath);
  const allGuides = getAllGuidesInFolder(guideFilePath);

  if (allFolders.length === 0 && allGuides.length === 0) {
    return notFound();
  }

  return (
    <BaseLayout>
      <div className="mx-auto w-full max-w-6xl px-4">
        <div className="mb-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/guides">
              <ArrowLeft className="mr-2 size-4" aria-hidden />
              Zurück zu Anleitungen
            </Link>
          </Button>
        </div>

        <h1 className="text-2xl font-bold">Anleitungen {guideFilePath}</h1>

        <div className="my-8 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {allFolders.map((folder) => {
            const displayName = folder.split("/").pop() ?? folder;
            return (
              <Link
                href={`/guides/${folder}`}
                key={folder}
                className="group block focus:outline-none"
                aria-label={`Ordner öffnen: ${displayName}`}
                title={displayName}
              >
                <div className="flex items-center justify-between gap-3 rounded-xl border bg-card/60 p-4 transition-colors hover:bg-accent/40 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex size-12 items-center justify-center rounded-lg bg-muted text-muted-foreground transition-colors group-hover:bg-muted/80">
                      <FolderOpenIcon className="size-6" aria-hidden />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold leading-5">
                        {displayName}
                      </p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        Ordner öffnen
                      </p>
                    </div>
                  </div>
                  <ChevronRight
                    className="size-5 shrink-0 text-muted-foreground transition-transform duration-200 group-hover:translate-x-0.5"
                    aria-hidden
                  />
                </div>
              </Link>
            );
          })}
        </div>

        <div className="my-8 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {allGuides.map((guide) => (
            <GuideCard key={guide.filePath} guide={guide} />
          ))}
        </div>
      </div>
    </BaseLayout>
  );
}