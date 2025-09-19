import { Guide } from "@/content/guides/guides";
import { ChevronRight, Clock4, CircleUserRound } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";

interface GuideCardProps {
  guide: Guide;
}

export default function GuideCard({ guide }: GuideCardProps) {
  const date = new Date(guide.metadata.publishedAt);

  const published = useMemo(() => {
    const opts: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return date.toLocaleDateString("de-DE", opts);
  }, [date]);

  const readingTime = useMemo(() => {
    const words = guide.content.trim().split(/\s+/).length || 0;
    return Math.max(1, Math.ceil(words / 220));
  }, [guide.content]);

  return (
    <Link
      href={`/guides/${guide.filePath}`}
      className="group block focus:outline-none"
      aria-label={`Open guide: ${guide.metadata.title}`}
      title={guide.metadata.title}
    >
      <article
        className="
          relative flex h-full items-start gap-4 rounded-xl border
          bg-card/60 p-5 transition
          hover:bg-accent/40 hover:shadow-md hover:border-muted-foreground/20
          md:p-6
          focus-visible:ring-2 focus-visible:ring-primary
          focus-visible:ring-offset-2 focus-visible:ring-offset-background
        "
      >
        <div className="flex-1">
          <h3
            className="
              text-lg font-semibold leading-snug tracking-tight
              md:text-xl
              line-clamp-2
            "
          >
            {guide.metadata.title}
          </h3>

          {guide.metadata.summary ? (
            <p className="mt-2 text-sm text-muted-foreground line-clamp-3">
              {guide.metadata.summary}
            </p>
          ) : null}

          <div
            className="
              mt-3 flex flex-wrap items-center gap-x-3 gap-y-1
              text-xs text-muted-foreground
            "
          >
            <span className="inline-flex items-center gap-1.5">
              {published}
            </span>

            <span
              className="hidden h-1 w-1 rounded-full bg-muted-foreground/50 sm:inline"
              aria-hidden
            />

            <span className="inline-flex items-center gap-1.5">
              <CircleUserRound
                className="size-4 text-muted-foreground"
                aria-hidden
              />
              {guide.metadata.author}
            </span>

            <span
              className="hidden h-1 w-1 rounded-full bg-muted-foreground/50 sm:inline"
              aria-hidden
            />

            <span className="inline-flex items-center gap-1.5">
              <Clock4 className="size-4 text-muted-foreground" aria-hidden />
              {readingTime} Min
            </span>
          </div>
        </div>

        <ChevronRight
          className="
            mt-1 size-5 shrink-0 self-center text-muted-foreground
            transition-transform duration-200
            group-hover:translate-x-0.5
          "
          aria-hidden
        />
      </article>
    </Link>
  );
}