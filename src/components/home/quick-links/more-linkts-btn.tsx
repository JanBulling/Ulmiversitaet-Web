import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function MoreLinksBtn() {
  return (
    <Link href="/links">
      <div className="group hover:text-primary/50 text-primary flex flex-col items-center justify-center md:flex-row md:items-start">
        <div className="group-hover:border-primary/50 border-primary my-2 flex aspect-square h-12 w-12 cursor-pointer flex-col items-center justify-center gap-y-1 rounded-2xl border-2 border-dashed bg-transparent sm:h-20 sm:w-20">
          <ArrowRight className="size-6 sm:size-8" />
          <p className="line-clamp-2 hidden px-1 text-center text-xs font-bold md:inline">
            Weitere Links
          </p>
        </div>
        <p className="mt-1 line-clamp-1 px-1 text-center text-xs font-bold md:hidden">
          Mehr Links
        </p>
      </div>
    </Link>
  );
}
