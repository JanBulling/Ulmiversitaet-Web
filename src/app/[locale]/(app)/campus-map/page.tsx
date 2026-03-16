import CampusMap from "@/components/campus-map/campus-map";
import SiteLayout from "@/layouts/site-layout";
import * as fs from "fs";
import path from "path";
import { getTranslations } from "next-intl/server";

// Wrong since already statically generated using internationalization
// export const dynamic = "force-static";

const files = ["lecture-halls.json", "buildings.json"];

export default async function CampusMapPage() {
  const filePath = files.map((f) =>
    path.join(process.cwd(), "src", "content", "campus-map", f),
  );
  const data = filePath.map((fp) => JSON.parse(fs.readFileSync(fp, "utf8")));
  const t = await getTranslations("CampusMapPage");

  return (
    <SiteLayout>
      <div className="px-4">
        <h1 className="text-2xl font-bold">{t("title")}</h1>
        <p className="text-muted-foreground text-sm">{t("subtitle")}</p>
      </div>
      <CampusMap lectureHalls={data[0]} buildings={data[1]} />
    </SiteLayout>
  );
}
