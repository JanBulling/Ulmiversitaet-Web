import GuideCard from "@/components/guides/guide-card";
import { getAllGuides, getGuide } from "@/content/guides/guides";
import BaseLayout from "@/layouts/base-layout";
import { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Anleitungen",
  description:
    "Sammlung von Anleitungen für den studentischen Alltag an der Universität Ulm.",
};

export default function GuidesPage() {
  const guideData = getGuide("");

  let files: any[] = [];
  let directories: string[] = [];

  if (guideData && "type" in guideData && guideData.type === "directory") {
    files = guideData.content.files.map((file) => {
      const relativePath = file.filePath.replace(/^.*src\/content\/guides\//, '').replace(/\.(mdx|md)$/, '');
      return {
        slug: relativePath,
        metadata: file.metadata
      };
    });
    directories = guideData.content.directories;
  } else if (guideData && !("type" in guideData)) {
    // If it's a single guide file at the root, treat it as a file
    const relativePath = guideData.filePath.replace(/^.*src\/content\/guides\//, '').replace(/\.(mdx|md)$/, '');
    files = [{
      slug: relativePath,
      metadata: guideData.metadata
    }];
  }

  return (
    <BaseLayout>
      <div className="px-4">
        <h1 className="text-2xl font-bold">Anleitungen der Ulmiversität</h1>
        <p className="text-muted-foreground text-sm">
          Die Ulmiversität hat eine Sammlung von Anleitungen, die den Uni-Alltag
          erleichtern sollen. Eine Anleitung fehlt oder Du hast weitere Ideen?{" "}
          <a href="mailto:info@ulmiversitaet.de" className="underline">
            <span>Schreibe uns!</span>
          </a>
        </p>
      </div>

      <div className="my-8 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:px-4 md:grid-cols-3">
        {directories.map((dir) => (
          <Link href={`/guides/${dir}`} key={dir}>
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
        {files.map((guide) => (
          <GuideCard key={guide.slug} guide={guide} />
        ))}
      </div>
    </BaseLayout>
  );
}
