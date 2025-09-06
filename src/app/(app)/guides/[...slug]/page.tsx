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
import { Metadata } from "next";
import { siteConfig } from "@/config/site";

interface GuidePageProps {
  params: Promise<{ slug: string[] }>;
}

export async function generateStaticParams() {
  const allGuides = getAllGuides();

  const slugs = allGuides.map((guide) => ({
    slug: guide.filePath.split(/[/\\]+/),
  }));

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
            url: `/og?title=${guide.metadata.title ?? guideFilePath}&description=${guide.metadata.summary ?? undefined}`,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: guide.metadata.title ?? guideFilePath,
        description: guide.metadata.summary ?? undefined,
        images: [
          {
            url: `/og?title=${guide.metadata.title ?? guideFilePath}&description=${guide.metadata.summary ?? undefined}`,
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
    return (
      <GuideLayout>
        <CustomMDX source={guide.content} />
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
      <div className="px-4">
        <h1 className="text-2xl font-bold">Anleitungen {guideFilePath}</h1>
      </div>

      <div className="my-8 grid grid-cols-2 gap-4 px-4 sm:grid-cols-3 md:grid-cols-5">
        {allFolders.map((folder) => (
          <Link href={`/guides/${folder}`} key={folder}>
            <div className="bg-secondary text-secondary-foreground hover:bg-secondary/70 flex cursor-pointer items-center gap-2 rounded-lg border p-2">
              <div className="flex h-full flex-1 flex-col items-center justify-center gap-2">
                <FolderOpenIcon className="size-10" />
                <p className="text-center font-semibold capitalize">{folder}</p>
              </div>
              <ChevronRight className="size-6" />
            </div>
          </Link>
        ))}
      </div>

      <div className="my-8 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:px-4 md:grid-cols-3">
        {allGuides.map((guide) => (
          <GuideCard key={guide.filePath} guide={guide} />
        ))}
      </div>
    </BaseLayout>
  );
}
