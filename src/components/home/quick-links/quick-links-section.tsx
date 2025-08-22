import { QuickLinkIcon } from "./quick-link-icon";
import { defaultQuickLinks, moreLinksQuickLink } from "@/content/quick-links";
import { QuickLinksEdit } from "./quick-links-edit";

export function QuickLinksSection() {
  return (
    <section className="grid w-full grid-cols-4 gap-4 px-4 md:grid-cols-6 md:px-12 lg:grid-cols-8">
      {defaultQuickLinks().map((q) => (
        <QuickLinkIcon key={q.href} quickLink={q} />
      ))}
      <QuickLinkIcon quickLink={moreLinksQuickLink} />
      <QuickLinksEdit />
    </section>
  );
}
