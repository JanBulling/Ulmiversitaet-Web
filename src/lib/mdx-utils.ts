import path from "path";
import fs from "fs";
import matter from "gray-matter";
import { serialize } from "next-mdx-remote/serialize";

export type MdxFile<T extends DefaultMetadata> = {
  metadata: T;
  content: string; // raw MDX content (no frontmatter)
  filePath: string;
};

export type DefaultMetadata = {
  title: string;
  publishedAt?: string;
  summary?: string;
};

export type MdxCompiled<T extends DefaultMetadata> = MdxFile<T> & {
  code: Awaited<ReturnType<typeof serialize>>;
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

export function readMdxFile<T extends DefaultMetadata>(
  filePath: string,
): MdxFile<T> | null {
  try {
    const rawContent = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(rawContent);

    return {
      metadata: data as T,
      content: content.trim(),
      filePath,
    };
  } catch {
    return null;
  }
}

export function getMdxFilesInDirectory(directory: string) {
  try {
    return fs
      .readdirSync(directory)
      .map((file) => path.join(directory, file))
      .filter((file) => {
        const ext = path.extname(file).toLowerCase();
        return fs.statSync(file).isFile() && (ext === ".mdx" || ext === ".md");
      })
      .map((file) => path.basename(file));
  } catch {
    return [];
  }
}
