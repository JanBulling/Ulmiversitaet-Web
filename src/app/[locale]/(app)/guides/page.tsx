import GuideCard from "@/components/guides/guide-card";
import {
  getAllGuidesInFolder,
  getAllGuideFolders,
} from "@/content/guides/guides";
import BaseLayout from "@/layouts/base-layout";
import { Metadata } from "next";
import FolderCard from "@/components/guides/folder-card";

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

      <div className="my-8 grid grid-cols-1 gap-4 px-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
        {allFolders.map((folder) => (
          <FolderCard folder={folder} key={folder} />
        ))}
      </div>

      <div className="my-8 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:px-4 md:grid-cols-3">
        {allGuides.map((guide) => (
          <GuideCard key={guide.filePath} guide={guide} />
        ))}
      </div>
    </BaseLayout>
  );
}
