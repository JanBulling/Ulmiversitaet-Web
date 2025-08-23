import { MensaSection } from "@/components/home/mensa/mensa-section";
import MensaSectionLoading from "@/components/home/mensa/mensa-section-loading";
import { PublicTransportSection } from "@/components/home/public-transport/public-transport-section";
import { QuickLinksSection } from "@/components/home/quick-links/quick-links-section";
import BaseLayout from "@/layouts/base-layout";
import { Suspense } from "react";

export default function Home() {
  return (
    <BaseLayout className="space-y-8 md:space-y-8">
      <QuickLinksSection />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-7">
        <Suspense fallback={<MensaSectionLoading className="md:col-span-4" />}>
          <MensaSection className="md:col-span-4" />
        </Suspense>

        <PublicTransportSection className="md:col-span-3" />
      </div>
    </BaseLayout>
  );
}
