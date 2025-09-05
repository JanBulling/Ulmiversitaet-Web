import path from "path";
import fs from "fs";

export type MdxFile = {
  metadata: Metadata;
  content: string;
  filePath: string;
};

export function getMdxDataFromDir<T extends Metadata>(directory: string) {
  const files = recursiveGetMdxFiles(directory);

  const data = files
    .map((file) => readMdxFile<T>(path.join(directory, file)))
    .filter((fileData) => fileData !== null)
    .map((fileData) => {
      const slug = fileData.filePath
        .replace(directory + "/", "")
        .replace(path.extname(fileData.filePath), "");

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

export function getMdxFilesInDirectory(directory: string) {
  return fs
    .readdirSync(directory)
    .map(file => path.join(directory, file))
    .filter(
      (file) => fs.statSync(file).isFile() && (path.extname(file) === ".mdx" || path.extname(file) === ".md"),
    );
}

export function getDirectoriesInDirectory(directory: string) {
  return fs
    .readdirSync(directory)
    .map(file => path.join(directory, file))
    .filter(
      (file) => fs.statSync(file).isDirectory(),
    )
    .map(dir => path.basename(dir));
}

function recursiveGetMdxFiles(directory: string, fileList: string[] = [], baseDir: string = directory) {
  const files = fs.readdirSync(directory);

  files.forEach((file) => {
    const filePath = path.join(directory, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      recursiveGetMdxFiles(filePath, fileList, baseDir);
    } else if (path.extname(file) === ".mdx" || path.extname(file) === ".md") {
      fileList.push(path.relative(baseDir, filePath));
    }
  });

  return fileList;
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
