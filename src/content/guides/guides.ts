import { getMdxDataFromDir, readMdxFile } from "@/lib/mdx-utils";
import path from "path";

export function getAllGuides() {
  return getMdxDataFromDir(
    path.join(process.cwd(), "src", "content", "guides"),
  );
}

export function getGuide(slug: string) {
  const filePath = path.join(process.cwd(), "src", "content", "guides", slug);

  return readMdxFile(filePath + ".mdx") ?? { content: null, metadata: null };
}
