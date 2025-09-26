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
    <SiteLayout className="px-4">
      <CustomMDX source={fileContent.content} />
    </SiteLayout>
  );
}
