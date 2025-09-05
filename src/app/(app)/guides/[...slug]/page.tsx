import GuideCard from "@/components/guides/guide-card";
import { siteConfig } from "@/config/site";
import { getAllGuides, getGuide } from "@/content/guides/guides";
import GuideLayout from "@/layouts/guide-layout";
import { CustomMDX } from "@/mdx-components";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface GuidePageProps {
  params: { slug: string[] };
}

export async function generateStaticParams() {
  const allGuides = getAllGuides();

  const guideSlugs = allGuides.map((guide) => ({ slug: guide.slug.split('/') }));
  const directorySlugs = getUniqueDirectoryPaths(allGuides.map(guide => guide.slug)).map(dir => ({ slug: dir.split('/') }));

  return [...guideSlugs, ...directorySlugs];
}

export const dynamicParams = false;

function getUniqueDirectoryPaths(slugs: string[]): string[] {
  const directories = new Set<string>();

  slugs.forEach(slug => {
    let currentPath = '';
    slug.split('/').slice(0, -1).forEach(segment => {
      currentPath = currentPath === '' ? segment : `${currentPath}/${segment}`;
      directories.add(currentPath);
    });
  });

  return Array.from(directories);
}

export async function generateMetadata({
  params,
}: GuidePageProps): Promise<Metadata> {
  const slug = params.slug.join('/');

  const guideData = getGuide(slug);

  let title: string;
  let description: string;
  let url: string;

  if (!guideData) {
    return notFound();
  } else if ("type" in guideData && guideData.type === "directory") {
    title = `Guides in ${slug || "root"}`;
    description = `List of guides and sub-folders in ${slug || "root"}`;
    url = `${siteConfig.url}/guides/${slug}`;
  } else if (guideData && "metadata" in guideData) {
    title = guideData.metadata.title ?? slug;
    description = guideData.metadata.summary ?? "";
    url = `${siteConfig.url}/guides/${slug}`;
  } else {
    return notFound();
  }

  return {
    title: title,
    description: description,
    openGraph: {
      title: title,
      description: description,
      type: "article",
      url: url,
      images: [
        {
          url: `/og?title=${title}&description=${description}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: title,
      description: description,
      images: [
        {
          url: `/og?title=${title}&description=${description}`,
        },
      ],
      creator: "@ulmiversitaet",
    },
  };
}

export default async function GuidePage({ params }: GuidePageProps) {
  const slug = params.slug.join('/');
  const guideData = getGuide(slug);

  console.log(guideData)

  if (!guideData) return notFound();

  if ("type" in guideData && guideData.type === "directory") {
    const { files, directories } = guideData.content;
    const currentPath = guideData.path ? `/guides/${guideData.path}` : "/guides";

    return (
      <GuideLayout>
        <div className="px-4">
          <h1 className="text-2xl font-bold capitalize">
            {slug === "" ? "Guides" : slug.split('/').pop()}
          </h1>
          <p className="text-muted-foreground text-sm">
            {slug === "" ? "Alle Anleitungen" : `Alle Anleitungen in ${slug}`}
          </p>
        </div>

        <div className="my-8 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:px-4 md:grid-cols-3">
          {directories.map((dir) => (
            <Link href={`${currentPath}/${dir}`} key={dir}>
              <div className="h-full bg-card hover:bg-muted flex cursor-pointer items-start border-y p-4 sm:border md:rounded-lg md:p-6">
                <div className="flex-1">
                  <h3 className="text-xl font-bold capitalize">{dir}</h3>
                  <p className="text-muted-foreground font-mono text-xs">
                    Ordner
                  </p>
                  <p className="mt-2 text-sm">Enthält weitere Anleitungen</p>
                </div>
                <ChevronRight className="text-muted-foreground size-6" />
              </div>
            </Link>
          ))}
          {files.map((file) => {
            const slugForGuideCard = file.filePath.replace(/^.*src\/content\/guides\//, '').replace(/\.(mdx|md)$/, '');
            return (
              <GuideCard key={file.filePath} guide={{
                slug: slugForGuideCard,
                metadata: file.metadata
              }} />
            );
          })}
        </div>
      </GuideLayout>
    );
  } else {
    return (
      <GuideLayout>
        <CustomMDX source={guideData.content} />
      </GuideLayout>
    );
  }
}
