import { siteConfig } from "@/config/site";
import { getAllGuides, getGuide } from "@/content/guides/guides";
import GuideLayout from "@/layouts/guide-layout";
import { CustomMDX } from "@/mdx-components";
import { Metadata } from "next";
import { notFound } from "next/navigation";

interface GuidePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const allGuides = getAllGuides();

  return allGuides.map((guide) => ({ slug: guide.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: GuidePageProps): Promise<Metadata> {
  const { slug } = await params;

  const { metadata } = getGuide(slug);

  const url = `${siteConfig.url}/guides/${slug}`;

  return {
    title: metadata?.title ?? slug,
    description: metadata?.summary,
    openGraph: {
      title: metadata?.title ?? slug,
      description: metadata?.summary,
      type: "article",
      url: url,
      images: [
        {
          url: `/og?title=${encodeURIComponent(
            metadata?.title ?? slug,
          )}&description=${encodeURIComponent(metadata?.summary ?? "")}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: metadata?.title ?? slug,
      description: metadata?.summary,
      images: [
        {
          url: `/og?title=${encodeURIComponent(
            metadata?.title ?? slug,
          )}&description=${encodeURIComponent(metadata?.summary ?? "")}`,
        },
      ],
      creator: "@ulmiversitaet",
    },
  };
}

export default async function GuidePage({ params }: GuidePageProps) {
  const { slug } = await params;
  const { content, metadata } = getGuide(slug);

  if (!content) return notFound();

  console.log(metadata);

  return (
    <GuideLayout>
      <CustomMDX source={content} />
    </GuideLayout>
  );
}
