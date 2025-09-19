// mdx-utils.ts
import path from "path";
import fs from "fs";
import matter from "gray-matter";
import { serialize } from "next-mdx-remote/serialize";
import rehypePrettyCode from "rehype-pretty-code";
import remarkGfm from "remark-gfm";

export type MdxFile<T extends DefaultMetadata> = {
  metadata: T;
  content: string; // raw MDX content (no frontmatter)
  filePath: string;
};

export type DefaultMetadata = {
  title: string;
  publishedAt?: string;
  summary?: string;
  // you can extend in callers with author, tags, etc.
};

export type MdxCompiled<T extends DefaultMetadata> = MdxFile<T> & {
  // MDXRemoteSerializeResult type is generic; keep it loose to avoid coupling
  code: any;
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

// Compile MDX with pretty code highlighting and GitHub-flavored markdown.
export async function compileMdx(source: string) {
  const prettyCodeOptions = {
    theme: {
      light: "github-light",
      dark: "github-dark",
    },
    keepBackground: false,
  };

  return serialize(source, {
    mdxOptions: {
      remarkPlugins: [remarkGfm],
      rehypePlugins: [[rehypePrettyCode, prettyCodeOptions]],
    },
  });
}

// Convenience helper: read + compile in one step
export async function readMdxFileCompiled<T extends DefaultMetadata>(
  filePath: string,
): Promise<MdxCompiled<T> | null> {
  const file = readMdxFile<T>(filePath);
  if (!file) return null;
  const code = await compileMdx(file.content);
  return { ...file, code };
}