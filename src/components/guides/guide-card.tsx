import { Metadata } from "@/lib/mdx-utils";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

interface GuideCardProps {
  guide: {
    slug: string;
    metadata: Metadata;
  };
}

export default function GuideCard({ guide }: GuideCardProps) {
  const date = new Date(guide.metadata.publishedAt);
  const dateFormatOptions: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  return (
    <Link href={`/guides/${guide.slug}`}>
      <div className="bg-card hover:bg-muted flex cursor-pointer items-center border-y p-4 md:rounded-lg md:border md:p-6">
        <div className="flex-1">
          <h3 className="text-xl font-bold">{guide.metadata.title}</h3>
          <p className="text-muted-foreground font-mono text-xs">
            {date.toLocaleDateString("de-DE", dateFormatOptions)}
          </p>
          <p className="mt-2 text-sm">{guide.metadata.summary}</p>
        </div>
        <ChevronRight className="text-muted-foreground size-6" />
      </div>
    </Link>
  );
}
