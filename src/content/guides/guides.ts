import { getMdxDataFromDir, readMdxFile, getMdxFilesInDirectory, getDirectoriesInDirectory, MdxFile } from "@/lib/mdx-utils";
import path from "path";
import fs from "fs";

const GUIDES_BASE_PATH = path.join(process.cwd(), "src", "content", "guides");

export function getAllGuides() {
  return getMdxDataFromDir(
    GUIDES_BASE_PATH,
  );
}

export function getGuide(slug: string): MdxFile | {
  type: "directory";
  path: string;
  content: { files: MdxFile[]; directories: string[] };
} | null {
  const fullPath = path.join(GUIDES_BASE_PATH, slug);

  if (fs.existsSync(fullPath) && fs.statSync(fullPath).isDirectory()) {
    const files = getMdxFilesInDirectory(fullPath).map(file => readMdxFile(file)).filter(Boolean) as MdxFile[];
    const directories = getDirectoriesInDirectory(fullPath);
    return { type: "directory", path: slug, content: { files, directories } };
  }

  // Check if the slug itself is an MDX file (e.g., /guides/my-guide.mdx)
  if (fs.existsSync(fullPath + ".mdx") && fs.statSync(fullPath + ".mdx").isFile()) {
    const fileContent = readMdxFile(fullPath + ".mdx");
    if (fileContent) {
      return fileContent;
    }
  }

  return null;
}

interface Guide {
  slug: string;
  metadata: {
    title: string;
    publishedAt: string;
    summary: string;
  };
}
