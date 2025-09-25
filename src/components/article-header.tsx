"use client";

import * as React from "react";
import { CircleUserRound, Clock4, CalendarDays } from "lucide-react";
import { cn } from "@/lib/utils";

interface ArticleHeaderProps {
  title: string;
  description?: string;
  author?: string;
  published?: string;
  readingTimeMin?: number;
  className?: string;
}

export function ArticleHeader({
  title,
  description,
  author,
  published,
  readingTimeMin,
  className,
}: ArticleHeaderProps) {
  return (
    <div className={cn("mb-6 space-y-3", className)}>
      <div className="bg-card border p-4 shadow sm:p-6 md:rounded-xl">
        <h1 className="text-3xl font-semibold tracking-tight xl:text-4xl">
          {title}
        </h1>
        {description ? (
          <p className="text-muted-foreground mt-3 text-base leading-relaxed">
            {description}
          </p>
        ) : null}
        <div className="text-muted-foreground mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
          {published ? (
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="size-4" aria-hidden />
              {published}
            </span>
          ) : null}
          {author ? (
            <span className="inline-flex items-center gap-1.5">
              <CircleUserRound className="size-4" aria-hidden />
              {author}
            </span>
          ) : null}
          {typeof readingTimeMin === "number" ? (
            <span className="inline-flex items-center gap-1.5">
              <Clock4 className="size-4" aria-hidden />
              {readingTimeMin} Min
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
}


