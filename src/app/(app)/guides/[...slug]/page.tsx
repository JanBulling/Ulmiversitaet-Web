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
import { ChevronRight, FolderOpenIcon } from "lucide-react";
import BaseLayout from "@/layouts/base-layout";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

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
    for (let i = 1; i < pathParts.length; i++) {
      const folderPath = pathParts.slice(0, i).join("/");
      folderSlugs.add(folderPath);
    }
  });

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
    const date = new Date(guide.metadata.publishedAt);
    const published = date.toLocaleDateString("de-DE", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const words = guide.content.trim().split(/\s+/).length || 0;
    const readingTimeMin = Math.max(1, Math.ceil(words / 220));

    return (
      <GuideLayout
        readingTimeMin={readingTimeMin}
        published={published}
        author={guide.metadata.author}
      >
        <div className="bg-card rounded-xl border shadow-sm">
          <div className="prose prose-sm dark:prose-invert sm:prose-base max-w-none p-4 sm:p-6 md:p-8">
            <CustomMDX source={guide.content} />
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
      <h1 className="text-2xl font-bold">Anleitungen {guideFilePath}</h1>

      <div className="my-4 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
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
              <div className="bg-card/60 hover:bg-accent/40 focus-visible:ring-primary focus-visible:ring-offset-background flex items-center justify-between gap-3 rounded-xl border p-4 transition-colors focus-visible:ring-2 focus-visible:ring-offset-2">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="bg-muted text-muted-foreground group-hover:bg-muted/80 flex size-12 items-center justify-center rounded-lg transition-colors">
                    <FolderOpenIcon className="size-6" aria-hidden />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm leading-5 font-semibold">
                      {displayName}
                    </p>
                    <p className="text-muted-foreground mt-0.5 text-xs">
                      Ordner öffnen
                    </p>
                  </div>
                </div>
                <ChevronRight
                  className="text-muted-foreground size-5 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5"
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
    </BaseLayout>
  );
}
