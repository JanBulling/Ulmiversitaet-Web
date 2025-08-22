import About from "@/content/legal/about.md";
import { BaseLayout } from "@/layouts/base-layout";

export default function AboutPage() {
  return (
    <BaseLayout className="prose prose-neutral dark:prose-invert prose-h2:underline prose-headings:text-primary">
      <About />
    </BaseLayout>
  );
}
