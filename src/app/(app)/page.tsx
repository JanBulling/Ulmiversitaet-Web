import { MensaSection } from "@/components/home/mensa/mensa-section";
import { PublicTransportSection } from "@/components/home/public-transport/public-transport-section";
import { QuickLinksSection } from "@/components/home/quick-links/quick-links-section";
import { BaseLayout } from "@/layouts/base-layout";

export default function Home() {
  return (
    <BaseLayout className="space-y-8 md:space-y-8">
      <QuickLinksSection />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-7">
        <MensaSection className="md:col-span-4" />

        <PublicTransportSection className="md:col-span-3" />
      </div>
    </BaseLayout>
  );
}
