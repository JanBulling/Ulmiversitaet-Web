import GuideCard from "@/components/guides/guide-card";
import {
  getAllGuideFolders,
  getAllGuides,
  getAllGuidesInFolder,
  getGuide,
} from "@/content/guides/guides";
import GuideLayout from "@/layouts/guide-layout";
import { ArticleHeader } from "@/components/guides/article-header";
import { CustomMDX } from "@/mdx-components";
import BaseLayout from "@/layouts/base-layout";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import FolderCard from "@/components/guides/folder-card";
import { getTranslations } from "next-intl/server";

interface GuidePageProps {
  params: Promise<{ locale: string; slug: string[] }>;
}

export async function generateStaticParams() {
  const allGuides = getAllGuides();

  const slugs = allGuides.map((guide) => ({
    slug: guide.filePath.split(/[/\\]+/).map((s) => encodeURI(s)),
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
      slug: folderPath.split(/[/\\]+/).map((s) => encodeURI(s)),
    });
  });

  return slugs;
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: GuidePageProps): Promise<Metadata> {
  const { slug, locale } = await params;
  const guideFilePath = slug.map((s) => decodeURI(s)).join("/");

  const guide = getGuide(guideFilePath, { locale: locale });

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
  const { slug, locale } = await params;
  const t = await getTranslations("GuidesPage");
  const guideFilePath = slug.map((s) => decodeURI(s)).join("/");

  const guide = getGuide(guideFilePath, { locale: locale });

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
        <ArticleHeader
          title={guide.metadata.titleWeb ?? guide.metadata.title}
          description={guide.metadata.description ?? guide.metadata.summary}
          author={guide.metadata.author}
          published={published}
          readingTimeMin={readingTimeMin}
        />

        <CustomMDX source={guide.content} />
      </GuideLayout>
    );
  }

  const allFolders = getAllGuideFolders(guideFilePath);
  const allGuides = getAllGuidesInFolder(guideFilePath);

  const allGuidesLocale = allGuides.filter((g) =>
    !g.locale ? true : g.locale === locale,
  );

  if (allFolders.length === 0 && allGuides.length === 0) {
    return notFound();
  }

  const folderName = guideFilePath.split("_").join(" ");

  return (
    <BaseLayout>
      <div className="px-4">
        <h1 className="text-2xl font-bold">
          {t("title")} <span className="text-primary">{folderName}</span>
        </h1>
      </div>

      <div className="my-4 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {allFolders.map((folder) => (
          <FolderCard folder={folder} key={folder} />
        ))}
      </div>

      <div className="my-8 grid grid-cols-1 gap-4 sm:grid-cols-2 md:px-4 lg:grid-cols-3">
        {allGuidesLocale.map((guide) => (
          <GuideCard key={guide.filePath} guide={guide} />
        ))}
      </div>
    </BaseLayout>
  );
}
