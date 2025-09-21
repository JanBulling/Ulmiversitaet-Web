import Link from "next/link";
import BaseLayout from "./base-layout";
import { Button } from "@/ui/button";
import { ArrowLeft, CircleUserRound, Clock4 } from "lucide-react";

interface GuideLayoutProps {
  children: React.ReactNode;
  readingTimeMin?: number;
  published?: string;
  author?: string;
}

export default function GuideLayout({
  children,
  readingTimeMin,
  published,
  author,
}: GuideLayoutProps) {
  return (
    <BaseLayout className="max-w-screen-lg">
      <div className="px-4">
        <Link href="/guides">
          <Button variant="outline" size="sm">
            <ArrowLeft />
            Zurück zu allen Anleitungen
          </Button>
        </Link>
      </div>

      <div className="my-2 flex items-center justify-start px-4">
        <div className="bg-muted text-muted-foreground flex flex-wrap items-center gap-x-3 gap-y-1 rounded px-2 py-1 font-mono text-xs">
          <span>{published}</span>
          <span
            className="bg-muted-foreground/50 hidden h-1 w-1 rounded-full sm:inline"
            aria-hidden
          />
          {author ? (
            <span className="inline-flex items-center gap-1.5">
              <CircleUserRound className="size-4" aria-hidden />
              {author}
            </span>
          ) : null}
          <span
            className="bg-muted-foreground/50 hidden h-1 w-1 rounded-full sm:inline"
            aria-hidden
          />
          <span className="inline-flex items-center gap-1.5">
            <Clock4 className="size-4" aria-hidden />
            {readingTimeMin} Min
          </span>
        </div>
      </div>

      <div className="bg-card border p-4 shadow sm:p-6 md:mx-4 md:rounded-xl md:p-8">
        {children}
      </div>
    </BaseLayout>
  );
}
