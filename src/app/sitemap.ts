import { BASE_URL } from "@/config/site";
import { getAllGuides } from "@/content/guides/guides";
import { getAllLinkCategories } from "@/content/links/links";
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const guidesSitemap = getGuideSitemaps();
  const linksSitemap = getLinksSitemaps();

  const locales: { locale: "de" | "en"; prefix: string }[] = [
    { locale: "de", prefix: "" },
    { locale: "en", prefix: "/en" },
  ];

  const staticPages = locales.flatMap(({ prefix }) => [
    {
      url: `${BASE_URL}${prefix || ""}`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1,
    },
    {
      url: `${BASE_URL}${prefix}/guides`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.98,
    },
    {
      url: `${BASE_URL}${prefix}/links`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.97,
    },
    {
      url: `${BASE_URL}${prefix}/campus-map`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.96,
    },
    {
      url: `${BASE_URL}${prefix}/exmatriculation`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: `${BASE_URL}${prefix}/public-transport`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.5,
    },
    {
      url: `${BASE_URL}${prefix}/about`,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.2,
    },
    {
      url: `${BASE_URL}${prefix}/privacy`,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.2,
    },
    {
      url: `${BASE_URL}${prefix}/imprint`,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.2,
    },
  ]) as MetadataRoute.Sitemap;

  return [...staticPages, ...guidesSitemap, ...linksSitemap];
}

function getGuideSitemaps(): MetadataRoute.Sitemap {
  const allGuides = getAllGuides();

  type Data = { url: string; date?: string | Date; locale: "de" | "en" };
  const data: Data[] = allGuides.map((guide) => ({
    url: guide.filePath
      .split(/[/\\]+/)
      .map((s) => encodeURI(s))
      .join("/")
      .split(".")[0],
    date: guide.metadata.publishedAt,
    locale: guide.locale === "en" ? "en" : "de",
  }));

  const folderSlugsByLocale = new Map<"de" | "en", Set<string>>([
    ["de", new Set<string>()],
    ["en", new Set<string>()],
  ]);
  allGuides.forEach((guide) => {
    const pathParts = guide.filePath.split(/[/\\]+/);
    for (let i = 1; i < pathParts.length; i++) {
      const folderPath = pathParts.slice(0, i).join("/");
      const loc = guide.locale === "en" ? "en" : "de";
      folderSlugsByLocale.get(loc)!.add(folderPath);
    }
  });
  folderSlugsByLocale.forEach((folderSlugs, locale) => {
    folderSlugs.forEach((folderPath) => {
      data.push({
        url: folderPath
          .split(/[/\\]+/)
          .map((s) => encodeURI(s))
          .join("/"),
        locale,
      });
    });
  });

  return data.map((data) => {
    const prefix = data.locale === "en" ? "/en" : "";
    return {
      url: `${BASE_URL}${prefix}/guides/${data.url}`,
      lastModified: data.date ?? new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.9,
    };
  });
}

function getLinksSitemaps(): MetadataRoute.Sitemap {
  const deCategories = getAllLinkCategories("de");
  const enCategories = getAllLinkCategories("en");

  return [
    ...deCategories.map((data) => ({
      url: `${BASE_URL}/links/${data.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.85,
    })),
    ...enCategories.map((data) => ({
      url: `${BASE_URL}/en/links/${data.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.84,
    })),
  ] as MetadataRoute.Sitemap;
}
