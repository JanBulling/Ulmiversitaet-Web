import GuideCard from "@/components/guides/guide-card";
import {
  getAllGuidesInFolder,
  getAllGuideFolders,
} from "@/content/guides/guides";
import BaseLayout from "@/layouts/base-layout";
import { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, FolderOpenIcon } from "lucide-react";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Anleitungen",
  description:
    "Sammlung von Anleitungen für den studentischen Alltag an der Universität Ulm.",
};

export default function GuidesPage() {
  const allGuides = getAllGuidesInFolder();
  const allFolders = getAllGuideFolders();

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

      <div className="my-8 grid grid-cols-1 gap-4 px-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {allFolders.map((folder) => {
          const displayName = folder.split("/").pop() ?? folder;

          return (
            <Link
              href={`/guides/${folder}`}
              key={folder}
              className="group block focus:outline-none"
              aria-label={`Ordner öffnen: ${displayName}`}
              title={displayName}
            >
              <div
                className="
                  flex items-center justify-between gap-3 rounded-xl border bg-card/60
                  p-4 transition-colors hover:bg-accent/40
                  focus-visible:ring-2 focus-visible:ring-primary
                  focus-visible:ring-offset-2 focus-visible:ring-offset-background
                "
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div
                    className="
                      flex size-12 items-center justify-center rounded-lg
                      bg-muted text-muted-foreground transition-colors
                      group-hover:bg-muted/80
                    "
                  >
                    <FolderOpenIcon className="size-6" aria-hidden />
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-xl font-semibold leading-5">
                      {displayName}
                    </p>
                  </div>
                </div>

                <ChevronRight
                  className="
                    size-5 shrink-0 text-muted-foreground
                    transition-transform duration-200 group-hover:translate-x-0.5
                  "
                  aria-hidden
                />
              </div>
            </Link>
          );
        })}
      </div>

      <div className="my-8 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:px-4 md:grid-cols-3">
        {allGuides.map((guide) => (
          <GuideCard key={guide.filePath} guide={guide} />
        ))}
      </div>
    </BaseLayout>
  );
}
