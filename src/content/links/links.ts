import path from "path";
import fs from "fs";

export type LinkCategory = {
  title: string;
  description: string;
  content: Link[];
};

export type LinkType = "LINK" | "GUIDE" | "INTERNAL";

export type Link = {
  type?: LinkType;
  label: string;
  href: string;
  description?: string;
  related?: (Omit<Link, "description" | "related"> | string)[];
};

export function getAllLinkCategories(locale: "de" | "en" = "de") {
  const folder = path.join(process.cwd(), "src", "content", "links");
  const files = fs
    .readdirSync(folder)
    .filter((file) => path.extname(file) === ".json");

  const baseSlugs = Array.from(
    new Set(
      files.map((file) => {
        const filename = path.basename(file, ".json");
        if (filename.endsWith(".de")) return filename.slice(0, -3);
        if (filename.endsWith(".en")) return filename.slice(0, -3);
        return filename;
      })
    )
  );

  const categories = baseSlugs
    .map((baseSlug) => {
      const localizedPath = resolveLocalizedFilePath(folder, baseSlug, locale);
      const fallbackPath = path.join(folder, `${baseSlug}.json`);
      const filePath = fs.existsSync(localizedPath) ? localizedPath : fallbackPath;
      const rawContent = fs.readFileSync(filePath, "utf-8");
      const data = JSON.parse(rawContent) as LinkCategory;

      return {
        slug: baseSlug,
        title: data.title,
        description: data.description,
      };
    })
    .sort((a, b) => a.title.localeCompare(b.title));

  return categories;
}

export function getLinkCategory(slug: string, locale: "de" | "en" = "de") {
  const folder = path.join(process.cwd(), "src", "content", "links");
  const localizedPath = resolveLocalizedFilePath(folder, slug, locale);
  const fallbackPath = path.join(folder, `${slug}.json`);
  const filePath = fs.existsSync(localizedPath) ? localizedPath : fallbackPath;

  const rawContent = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(rawContent) as LinkCategory;
}

function resolveLocalizedFilePath(
  folder: string,
  baseSlug: string,
  locale: "de" | "en"
) {
  const candidate = path.join(folder, `${baseSlug}.${locale}.json`);
  return candidate;
}
