import { BASE_URL } from "@/config/site";
import { getAllGuides } from "@/content/guides/guides";
import { getAllLinkCategories } from "@/content/links/links";
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const guidesSitemap = getGuideSitemaps();
  const linksSitemap = getLinksSitemaps();

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${BASE_URL}/guides`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.98,
    },
    {
      url: `${BASE_URL}/links`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.97,
    },
    {
      url: `${BASE_URL}/campus-map`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.96,
    },
    {
      url: `${BASE_URL}/exmatriculation`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/public-transport`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.2,
    },
    {
      url: `${BASE_URL}/privacy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.2,
    },
    {
      url: `${BASE_URL}/imprint`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.2,
    },
    ...guidesSitemap,
    ...linksSitemap,
  ];
}

function getGuideSitemaps(): MetadataRoute.Sitemap {
  const allGuides = getAllGuides();

  const data: { url: string; date?: string | Date }[] = allGuides
    .filter((guide) => guide.locale === "de")
    .map((guide) => ({
      url: guide.filePath
        .split(/[/\\]+/)
        .map((s) => encodeURI(s))
        .join("/")
        .split(".")[0],
      date: guide.metadata.publishedAt,
      locale: guide.locale,
    }));

  // Also generate slugs for folder pages
  const folderSlugs = new Set<string>();
  allGuides.forEach((guide) => {
    const pathParts = guide.filePath.split(/[/\\]+/);
    for (let i = 1; i < pathParts.length; i++) {
      const folderPath = pathParts.slice(0, i).join("/");
      folderSlugs.add(folderPath);
    }
  });
  folderSlugs.forEach((folderPath) => {
    data.push({
      url: folderPath
        .split(/[/\\]+/)
        .map((s) => encodeURI(s))
        .join("/"),
    });
  });

  return data.map((data) => ({
    url: `${BASE_URL}/guides/${data.url}`,
    lastModified: data.date ?? new Date(),
    changeFrequency: "monthly",
    priority: 0.9,
  }));
}

function getLinksSitemaps(): MetadataRoute.Sitemap {
  const allLinkCategories = getAllLinkCategories();

  return allLinkCategories.map((data) => ({
    url: `${BASE_URL}/links/${data.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.85,
  }));
}
