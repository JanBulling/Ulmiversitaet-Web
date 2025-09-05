import path from "path";
import { notFound } from "next/navigation";

import SiteLayout from "@/layouts/site-layout";
import { readMdxFile } from "@/lib/mdx-utils";
import { CustomMDX } from "@/mdx-components";
import { Metadata } from "next";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Impressum",
  description: "Impressum der Ulmiversität.",
};

export default function ImpressumPage() {
  const fileContent = readMdxFile(
    path.join(process.cwd(), "src", "content", "legal", "impressum") + ".md",
  );

  if (!fileContent) return notFound();

  return (
    <SiteLayout className="prose prose-neutral dark:prose-invert prose-h2:underline prose-headings:text-primary">
      <CustomMDX source={fileContent.content} />
    </SiteLayout>
  );
}
