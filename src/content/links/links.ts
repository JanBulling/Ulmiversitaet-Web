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

export function getAllLinkCategories() {
  const folder = path.join(process.cwd(), "src", "content", "links");
  const files = fs.readdirSync(folder).filter((file) => {
    return path.extname(file) === ".json";
  });

  const categories = files
    .map((file) => {
      const filePath = path.join(folder, file);
      const rawContent = fs.readFileSync(filePath, "utf-8");
      const data = JSON.parse(rawContent) as LinkCategory;

      return {
        slug: path.basename(file, ".json"),
        title: data.title,
        description: data.description,
      };
    })
    .sort((a, b) => a.title.localeCompare(b.title));

  return categories;
}

export function getLinkCategory(slug: string) {
  const filePath = path.join(process.cwd(), "src", "content", "links", slug);

  const rawContent = fs.readFileSync(filePath + ".json", "utf-8");

  return JSON.parse(rawContent) as LinkCategory;
}
