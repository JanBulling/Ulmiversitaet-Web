import Image from "next/image";

import GuideCard from "@/components/guides/guide-card";
import { getAllGuidesInFolder } from "@/content/guides/guides";
import BaseLayout from "@/layouts/base-layout";
import { Metadata } from "next";
import { useLocale, useTranslations } from "next-intl";

// Wrong since already statically generated using internationalization
// export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "eduroam®",
  description: "Anleitungen für die Einrichtung von eduroam®.",
};

export default function GuidePage() {
  const locale = useLocale();
  const t = useTranslations("GuidesPage");

  const guides = getAllGuidesInFolder("eduroam");

  const guidesLocale = guides.filter((g) =>
    !g.locale ? true : g.locale === locale,
  );

  return (
    <BaseLayout>
      <div className="px-4">
        <h1 className="text-2xl font-bold">eduroam® {t("title")}</h1>
        <p className="text-muted-foreground text-sm">
          {t("eduroamDescription")}
        </p>

        <div className="flex gap-2">
          <Image
            src="/img/eduroam-meme-1.jpg"
            alt="Eduroam Meme 1"
            width={200}
            height={200}
            className="my-4"
          />
          <Image
            src="/img/eduroam-meme-2.jpeg"
            alt="Eduroam Meme 2"
            width={200}
            height={200}
            className="my-4"
          />
        </div>
      </div>

      <div className="my-8 grid grid-cols-1 gap-4 sm:grid-cols-2 md:px-4 lg:grid-cols-3">
        {guidesLocale.map((guide) => (
          <GuideCard key={guide.filePath} guide={guide} />
        ))}
      </div>
    </BaseLayout>
  );
}
