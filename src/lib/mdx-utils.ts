import path from "path";
import fs from "fs";

export type MdxFile<T extends DefaultMetadata> = {
  metadata: T;
  content: string;
  filePath: string;
};

type DefaultMetadata = {
  title: string;
  publishedAt?: string;
  summary?: string;
};

export function getMdxFolders(basePath: string) {
  try {
    return fs
      .readdirSync(basePath)
      .map((file) => path.join(basePath, file))
      .filter((file) => fs.statSync(file).isDirectory())
      .map((dir) => path.basename(dir));
  } catch {
    return [];
  }
}

export function readMdxFile<T extends DefaultMetadata>(filePath: string) {
  try {
    const rawContent = fs.readFileSync(filePath, "utf-8");
    const { metadata, content } = parseMdx<T>(rawContent);

    return { metadata, content, filePath };
  } catch {
    return null;
  }
}

export function getMdxFilesInDirectory(directory: string) {
  try {
    return fs
      .readdirSync(directory)
      .map((file) => path.join(directory, file))
      .filter(
        (file) =>
          fs.statSync(file).isFile() &&
          (path.extname(file) === ".mdx" || path.extname(file) === ".md"),
      )
      .map((file) => path.basename(file));
  } catch {
    return [];
  }
}

function parseMdx<T extends DefaultMetadata>(rawContent: string) {
  const frontmatterReges = /---\s*([\s\S]*?)\s*---/;

  const frontmatter = frontmatterReges.exec(rawContent);
  const frontmatterString =
    (frontmatter?.length ?? 0) >= 1
      ? frontmatterReges.exec(rawContent)![1]
      : "";
  const content = rawContent.replace(frontmatterReges, "").trim();

  const metadata: Partial<T> = {};

  frontmatterString
    .trim()
    .split("\n")
    .forEach((line) => {
      const [key, ...values] = line.split(": ");
      const value = values
        .join(": ")
        .trim()
        .replace(/^['"](.*)['"]$/, "$1"); // Remove quotes

      metadata[key.trim() as keyof T] = value as T[keyof T];
    });

  return { metadata: metadata as T, content };
}
