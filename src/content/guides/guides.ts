import {
  readMdxFile,
  getMdxFilesInDirectory,
  getMdxFolders,
} from "@/lib/mdx-utils";
import path from "path";

export type GuidesMetadata = {
  title: string;
  publishedAt: string;
  summary: string;
  author: string;
  tags?: string[];
  // Optional extended fields used for article header rendering, can be empty (used to get a title for the web page that is different from the title of the guides page)
  titleWeb?: string;
  description?: string;
};

export type Guide = {
  locale?: string;
  filePath: string;
  metadata: GuidesMetadata;
  content: string;
};

const GUIDES_BASE_PATH = path.join(process.cwd(), "src", "content", "guides");

export function getAllGuidesInFolder(basePath?: string): Guide[] {
  const directoryPath = path.join(GUIDES_BASE_PATH, basePath ? basePath : "");
  const filesInDirectory = getMdxFilesInDirectory(directoryPath);

  return filesInDirectory
    .map((file) => readMdxFile<GuidesMetadata>(path.join(directoryPath, file)))
    .filter((fileData) => fileData !== null)
    .map((fileData) => {
      const filePath = fileData.filePath
        .replace(GUIDES_BASE_PATH + "\\", "")
        .replace(GUIDES_BASE_PATH + "/", "")
        .replace(path.extname(fileData.filePath), "");

      const locale =
        filePath.split(".").length === 2 ? filePath.split(".")[1] : undefined;

      return {
        locale: locale,
        filePath: filePath.split(".")[0],
        metadata: fileData.metadata,
        content: fileData.content,
      };
    });
}

export function getAllGuideFolders(basePath?: string) {
  const parentDirectory = path.join(GUIDES_BASE_PATH, basePath ? basePath : "");
  return getMdxFolders(parentDirectory);
}

export function getGuide(
  filePath: string,
  options?: { locale?: string },
): Guide | null {
  const guideFilePath = path.join(
    GUIDES_BASE_PATH,
    filePath +
      (options !== undefined && options.locale !== undefined
        ? `.${options!.locale}`
        : "") +
      ".mdx",
  );
  const fileContent = readMdxFile<GuidesMetadata>(guideFilePath);

  if (!fileContent) return null;

  return {
    filePath: filePath,
    metadata: fileContent.metadata,
    content: fileContent.content,
  };
}

export function getAllGuides(): Guide[] {
  const guides: Guide[] = [];

  function readGuidesRecursively(directory: string) {
    const filesAndFolders = getMdxFilesInDirectory(directory);
    const folders = getMdxFolders(directory);
    filesAndFolders.forEach((file) => {
      if (file.endsWith(".mdx")) {
        const filePath = path.join(directory, file);
        const fileContent = readMdxFile<GuidesMetadata>(filePath);
        if (fileContent) {
          const relativeFilePath = fileContent.filePath
            .replace(GUIDES_BASE_PATH + "\\", "")
            .replace(GUIDES_BASE_PATH + "/", "")
            .replace(path.extname(fileContent.filePath), "");

          const locale =
            filePath.split(".").length === 3
              ? filePath.split(".")[1]
              : undefined;

          guides.push({
            locale: locale,
            filePath: relativeFilePath,
            metadata: fileContent.metadata,
            content: fileContent.content,
          });
        }
      }
    });
    folders.forEach((folder) => {
      const folderPath = path.join(directory, folder);
      readGuidesRecursively(folderPath);
    });
  }
  readGuidesRecursively(GUIDES_BASE_PATH);
  return guides;
}

export const featuredGuidesSlug = [
  path.join("email-einrichten"),
  path.join("eduroam", "ios"),
  path.join("Uni_VPN", "windows"),
];

export async function getFeaturedGuides() {
  const guides = getAllGuides();

  return guides.filter((g) => featuredGuidesSlug.includes(g.filePath));
}
