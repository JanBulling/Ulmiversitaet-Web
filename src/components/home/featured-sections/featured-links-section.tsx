import { featuredLinks } from "@/content/featured-links";
import { ArrowRight, ChevronRight, LinkIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";

export function FeaturedLinksSection() {
  const t = useTranslations("HomePage.Featured");

  return (
    <section className="px-4">
      <h2 className="text-2xl font-bold">{t("links.title")}</h2>
      <p className="text-muted-foreground text-sm">{t("links.description")}</p>
      <ul className="mt-2 space-y-2">
        {featuredLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="group block"
            aria-label={`Link öffnen: ${link.label}`}
            target={link.internalLink ? undefined : "_blank"}
            rel={link.internalLink ? undefined : "noopener noreferrer"}
          >
            <li className="bg-muted hover:bg-background flex items-center gap-4 border px-4 py-2 transition-colors duration-200">
              {typeof link.icon === "string" ? (
                <Image
                  src={link.icon}
                  alt={link.label}
                  width={24}
                  height={24}
                  className="size-6 dark:invert"
                />
              ) : (
                <link.icon className="size-6" />
              )}
              <div className="flex-1">
                <h3 className="font-semibold">{t(link.label)}</h3>
                <p className="text-muted-foreground text-sm">
                  {t(link.description)}
                </p>
              </div>
              <ChevronRight className="text-muted-foreground mt-1 size-5 shrink-0 self-center transition-transform duration-200 group-hover:translate-x-0.5" />
            </li>
          </Link>
        ))}

        <Link href="/links" className="group block rounded-xl">
          <li className="border-primary hover:border-primary/50 hover:text-primary/50 text-primary flex items-center gap-4 rounded-lg border-2 border-dashed px-4 py-4">
            <LinkIcon className="size-6" />
            <h3 className="flex-1 font-semibold">{t("links.more")}</h3>
            <ArrowRight className="size-5 shrink-0 self-center transition-transform duration-200 group-hover:translate-x-0.5" />
          </li>
        </Link>
      </ul>
    </section>
  );
}
