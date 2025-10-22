import SiteLayout from "@/layouts/site-layout";
import AboutUs from "@/components/general/about-us";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Über uns",
  description: "Informationen über die Entwickler der Website Ulmiversität",
};

export default function AboutPage() {
  return (
    <SiteLayout className="px-4 py-8">
      <AboutUs />
    </SiteLayout>
  );
}
