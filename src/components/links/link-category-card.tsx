import { ChevronRight } from "lucide-react";
import Link from "next/link";

interface LinkCategoryCardProps {
  linkCategory: {
    title: string;
    slug: string;
    description: string;
  };
}

export default function LinkCategoryCard({
  linkCategory,
}: LinkCategoryCardProps) {
  return (
    <Link href={`/links/${linkCategory.slug}`}>
      <div className="bg-card hover:bg-muted flex cursor-pointer items-center border-y p-4 md:rounded-lg md:border md:p-6">
        <div className="flex-1">
          <h3 className="mb-2 text-xl font-bold">{linkCategory.title}</h3>
          <p className="text-sm">{linkCategory.description}</p>
        </div>
        <ChevronRight className="text-muted-foreground size-6" />
      </div>
    </Link>
  );
}
