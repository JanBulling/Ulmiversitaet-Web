import Impressum from "@/content/legal/impressum.md";
import { BaseLayout } from "@/layouts/base-layout";

export default function ImpressumPage() {
  return (
    <BaseLayout className="prose prose-neutral dark:prose-invert prose-h2:underline prose-headings:text-primary">
      <Impressum />
    </BaseLayout>
  );
}
