import Link from "next/link";
import { ChevronRight, Clock4, CircleUserRound } from "lucide-react";

import { Guide } from "@/content/guides/guides";

interface GuideCardProps {
  guide: Guide;
}

export default function GuideCard({ guide }: GuideCardProps) {
  const date = new Date(guide.metadata.publishedAt);
  const published = date.toLocaleDateString("de-DE", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const wordCount = guide.content.trim().split(/\s+/).length || 0;
  const readingTime = Math.max(1, Math.ceil(wordCount / 220));

  return (
    <Link
      href={`/guides/${guide.filePath}`}
      className="group block focus:outline-none"
      aria-label={`Open guide: ${guide.metadata.title}`}
      title={guide.metadata.title}
    >
      <article className="bg-card/60 hover:bg-accent/40 hover:border-muted-foreground/20 focus-visible:ring-primary focus-visible:ring-offset-background relative flex h-full items-start gap-4 rounded-xl border p-5 transition hover:shadow-md focus-visible:ring-2 focus-visible:ring-offset-2 md:p-6">
        <div className="flex-1">
          <h3 className="line-clamp-2 text-lg leading-snug font-semibold tracking-tight md:text-xl">
            {guide.metadata.title}
          </h3>

          {guide.metadata.summary ? (
            <p className="text-muted-foreground mt-2 line-clamp-3 text-sm">
              {guide.metadata.summary}
            </p>
          ) : null}

          <div className="text-muted-foreground mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
            <span className="inline-flex items-center gap-1.5">
              {published}
            </span>

            <span
              className="bg-muted-foreground/50 hidden h-1 w-1 rounded-full sm:inline"
              aria-hidden
            />

            <span className="inline-flex items-center gap-1.5">
              <CircleUserRound
                className="text-muted-foreground size-4"
                aria-hidden
              />
              {guide.metadata.author}
            </span>

            <span
              className="bg-muted-foreground/50 hidden h-1 w-1 rounded-full sm:inline"
              aria-hidden
            />

            <span className="inline-flex items-center gap-1.5">
              <Clock4 className="text-muted-foreground size-4" aria-hidden />
              {readingTime} Min
            </span>
          </div>
        </div>

        <ChevronRight
          className="text-muted-foreground mt-1 size-5 shrink-0 self-center transition-transform duration-200 group-hover:translate-x-0.5"
          aria-hidden
        />
      </article>
    </Link>
  );
}
