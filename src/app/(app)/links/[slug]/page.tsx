import LinkCard from "@/components/links/link-card";
import { getAllLinkCategories, getLinkCategory } from "@/content/links/links";
import SiteLayout from "@/layouts/site-layout";
import { Metadata } from "next";
import { notFound } from "next/navigation";

interface LinkPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const allLinkCategories = getAllLinkCategories();

  return allLinkCategories.map((category) => ({ slug: category.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: LinkPageProps): Promise<Metadata> {
  const { slug } = await params;

  const linkCategory = getLinkCategory(slug);

  return {
    title: linkCategory?.description ?? slug,
    description: linkCategory?.description,
  };
}

export default async function LinkPage({ params }: LinkPageProps) {
  const { slug } = await params;
  const linkCategory = getLinkCategory(slug);

  if (!linkCategory) notFound();

  return (
    <SiteLayout>
      <h1 className="text-2xl font-bold">{linkCategory.title}</h1>
      <p className="text-muted-foreground text-sm">
        {linkCategory.description}
      </p>

      <div className="my-8 grid items-start gap-4 md:grid-cols-2">
        {linkCategory.content.map((link) => (
          <LinkCard key={link.href} link={link} />
        ))}
      </div>
    </SiteLayout>
  );
}
