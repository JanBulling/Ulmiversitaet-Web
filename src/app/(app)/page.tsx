import { MensaSection } from "@/components/home/mensa/mensa-section";
import MensaSectionLoading from "@/components/home/mensa/mensa-section-loading";
import PublicTransportLoading from "@/components/home/public-transport/pub-tra-loading";
import { PublicTransportSection } from "@/components/home/public-transport/pub-tra-section";
import { QuickLinksSection } from "@/components/home/quick-links/quick-links-section";
import BaseLayout from "@/layouts/base-layout";
import { CalendarClock } from "lucide-react";
import { Suspense } from "react";

// mensa won't load
// export const dynamic = "force-static";

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

      <div className="bg-card w-full border-y px-4 py-4 md:border">
        <div className="flex items-center gap-4">
          <CalendarClock className="text-primary size-8" />
          <h2 className="flex-1 text-2xl font-bold">Events</h2>
        </div>
      </div>
    </BaseLayout>
  );
}
