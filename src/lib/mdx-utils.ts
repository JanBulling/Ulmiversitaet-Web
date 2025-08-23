import path from "path";
import fs from "fs";

export function getMdxDataFromDir<T extends Metadata>(directory: string) {
  const files = getMdxFiles(directory);

  const data = files
    .map((file) => readMdxFile<T>(path.join(directory, file)))
    .filter((fileData) => fileData !== null)
    .map((fileData) => {
      const slug = path.basename(
        fileData.filePath,
        path.extname(fileData.filePath),
      );

      return {
        metadata: fileData.metadata,
        slug,
        content: fileData.content,
      };
    });

  return data;
}

export function readMdxFile<T extends Metadata>(filePath: string) {
  try {
    const rawContent = fs.readFileSync(filePath, "utf-8");
    const { metadata, content } = parseMdx<T>(rawContent);

    return { metadata, content, filePath };
  } catch (err) {
    console.error(err);
    return null;
  }
}

export function getMdxFiles(directory: string) {
  return fs
    .readdirSync(directory)
    .filter(
      (file) => path.extname(file) === ".mdx" || path.extname(file) === ".md",
    );
}

export type Metadata = {
  title: string;
  publishedAt: string;
  summary: string;
};

function parseMdx<T extends Metadata>(rawContent: string) {
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
