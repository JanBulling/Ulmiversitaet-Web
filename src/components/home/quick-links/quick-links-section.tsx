import { QuickLinkIcon } from "./quick-link-icon";
import { defaultQuickLinks } from "@/content/quick-links";
import { QuickLinksEdit } from "./quick-links-edit";
import MoreLinksBtn from "./more-linkts-btn";

export function QuickLinksSection() {
  return (
    <section className="grid w-full grid-cols-4 gap-4 px-4 md:grid-cols-6 md:px-12 lg:grid-cols-8">
      {defaultQuickLinks().map((q) => (
        <QuickLinkIcon key={q.href} quickLink={q} />
      ))}
      <MoreLinksBtn />
      <QuickLinksEdit />
    </section>
  );
}
