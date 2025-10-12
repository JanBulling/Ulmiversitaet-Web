import EventSection from "@/components/home/events/events-section";
import { MensaSection } from "@/components/home/mensa/mensa-section";
import MensaSectionLoading from "@/components/home/mensa/mensa-section-loading";
import PublicTransportLoading from "@/components/home/public-transport/pub-tra-loading";
import { PublicTransportSection } from "@/components/home/public-transport/pub-tra-section";
import { QuickLinksSection } from "@/components/home/quick-links/quick-links-section";
import { FeaturedLinksSection } from "@/components/home/featured-sections/featured-links-section";
import { FeaturedGuidesSection } from "@/components/home/featured-sections/featured-guides-section";
import BaseLayout from "@/layouts/base-layout";
import { Suspense } from "react";

// mensa won't load
export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <BaseLayout className="space-y-8 md:space-y-8">
      <QuickLinksSection />

      <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-7">
        <Suspense fallback={<MensaSectionLoading className="md:col-span-4" />}>
          <MensaSection className="md:col-span-4" />
        </Suspense>

        <Suspense
          fallback={<PublicTransportLoading className="md:col-span-3" />}
        >
          <PublicTransportSection className="md:col-span-3" />
        </Suspense>
      </div>

      <EventSection />

      <div className="grid grid-cols-1 gap-x-4 gap-y-8 md:grid-cols-2">
        <FeaturedLinksSection />
        <FeaturedGuidesSection />
      </div>
    </BaseLayout>
  );
}
