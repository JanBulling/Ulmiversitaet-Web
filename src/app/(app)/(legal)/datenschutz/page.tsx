import path from "path";
import { notFound } from "next/navigation";

import SiteLayout from "@/layouts/site-layout";
import { readMdxFile } from "@/lib/mdx-utils";
import { CustomMDX } from "@/mdx-components";
import { Metadata } from "next";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Datenschutzerklärung",
  description: "Datenschutzerklärung der Ulmiversität.",
};

export default function DatenschutzPage() {
  const fileContent = readMdxFile(
    path.join(process.cwd(), "src", "content", "legal", "datenschutz") + ".md",
  );

  if (!fileContent) return notFound();

  return (
    <SiteLayout className="px-4">
      <CustomMDX source={fileContent.content} />
    </SiteLayout>
  );
}
