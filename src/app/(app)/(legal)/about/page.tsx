import path from "path";
import { notFound } from "next/navigation";

import BaseLayout from "@/layouts/base-layout";
import { readMdxFile } from "@/lib/mdx-utils";
import { CustomMDX } from "@/mdx-components";

export default function AboutPage() {
  const fileContent = readMdxFile(
    path.join(process.cwd(), "src", "content", "legal", "about") + ".md",
  );

  if (!fileContent) return notFound();

  return (
    <BaseLayout className="prose prose-neutral dark:prose-invert prose-h2:underline prose-headings:text-primary">
      <CustomMDX source={fileContent.content} />
    </BaseLayout>
  );
}
