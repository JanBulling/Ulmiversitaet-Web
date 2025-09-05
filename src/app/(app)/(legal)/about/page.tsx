import path from "path";
import { notFound } from "next/navigation";

import SiteLayout from "@/layouts/site-layout";
import { readMdxFile } from "@/lib/mdx-utils";
import { CustomMDX } from "@/mdx-components";
import { Metadata } from "next";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Über",
  description: "Informationen über die Ulmiversität",
};

export default function AboutPage() {
  const fileContent = readMdxFile(
    path.join(process.cwd(), "src", "content", "legal", "about") + ".md",
  );

  if (!fileContent) return notFound();

  return (
    <SiteLayout className="prose prose-neutral dark:prose-invert prose-h2:underline prose-headings:text-primary">
      <CustomMDX source={fileContent.content} />
    </SiteLayout>
  );
}
