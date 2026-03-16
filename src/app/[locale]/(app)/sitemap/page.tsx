import SiteLayout from "@/layouts/site-layout";
import { Metadata } from "next";
import { useLocale } from "next-intl";
import LinkCard from "@/components/links/link-card";
import { getAllLinkCategories, type Link as LinkItem } from "@/content/links/links";
import { getAllGuides } from "@/content/guides/guides";

export const metadata: Metadata = {
    title: "Sitemap",
    description: "Overview of all important pages, link categories and guides.",
};

export default function SitemapPage() {
    const locale = useLocale();
    const loc = (locale as "de" | "en") ?? "de";

    const linkCategories = getAllLinkCategories(loc);
    const guides = getAllGuides().filter((g) => (g.locale === "en" ? "en" : "de") === loc);

    const prefix = loc === "en" ? "/en" : "";

    const staticPages: LinkItem[] = [
        { type: "INTERNAL", href: `${prefix}/`, label: loc === "en" ? "Home" : "Startseite" },
        { type: "INTERNAL", href: `${prefix}/guides`, label: loc === "en" ? "Guides" : "Anleitungen" },
        { type: "INTERNAL", href: `${prefix}/links`, label: loc === "en" ? "All links" : "Alle Links" },
        { type: "INTERNAL", href: `${prefix}/campus-map`, label: loc === "en" ? "Campus map" : "Campus-Karte" },
        { type: "INTERNAL", href: `${prefix}/exmatriculation`, label: loc === "en" ? "Exmatriculation" : "Exmatrikulation" },
        { type: "INTERNAL", href: `${prefix}/public-transport`, label: loc === "en" ? "Public transport" : "ÖPNV" },
        { type: "INTERNAL", href: `${prefix}/about`, label: loc === "en" ? "About" : "Über uns" },
        { type: "INTERNAL", href: `${prefix}/privacy`, label: loc === "en" ? "Privacy" : "Datenschutz" },
        { type: "INTERNAL", href: `${prefix}/imprint`, label: loc === "en" ? "Imprint" : "Impressum" },
    ];

    return (
        <SiteLayout>
            <div className="px-4">
                <h1 className="text-2xl font-bold">{loc === "en" ? "Sitemap" : "Sitemap"}</h1>
                <p className="text-muted-foreground text-sm">
                    {loc === "en"
                        ? "Overview of the site's static pages, link categories and guides."
                        : "Übersicht über statische Seiten, Link-Kategorien und Anleitungen."}
                </p>
            </div>

            <div className="my-6 md:px-4">
                <section className="mb-8">
                    <h2 className="px-4 text-xl font-semibold">{loc === "en" ? "Static pages" : "Statische Seiten"}</h2>
                    <div className="my-3 border bg-card shadow px-4 md:rounded-xl">
                        <ul className="divide-y">
                            {staticPages.map((link) => (
                                <LinkCard key={link.href} link={link} />
                            ))}
                        </ul>
                    </div>
                </section>

                <section className="mb-8">
                    <h2 className="px-4 text-xl font-semibold">{loc === "en" ? "Link categories" : "Link-Kategorien"}</h2>
                    <div className="my-3 border bg-card shadow px-4 md:rounded-xl">
                        <ul className="divide-y">
                            {linkCategories.map((category) => (
                                <LinkCard
                                    key={category.slug}
                                    link={{
                                        type: "INTERNAL",
                                        href: `${prefix}/links/${category.slug}`,
                                        label: category.title,
                                        description: category.description,
                                    }}
                                />
                            ))}
                        </ul>
                    </div>
                </section>

                <section>
                    <h2 className="px-4 text-xl font-semibold">{loc === "en" ? "Guides" : "Anleitungen"}</h2>
                    <div className="my-3 border bg-card shadow px-4 md:rounded-xl">
                        <ul className="divide-y">
                            {guides.map((g) => (
                                <LinkCard
                                    key={`${g.locale}-${g.filePath}`}
                                    link={{
                                        type: "GUIDE",
                                        href: `${prefix}/guides/${g.filePath}`,
                                        label: g.metadata.title,
                                    }}
                                />
                            ))}
                        </ul>
                    </div>
                </section>
            </div>
        </SiteLayout>
    );
}


