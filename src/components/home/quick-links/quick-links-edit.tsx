import { Edit } from "lucide-react";

export function QuickLinksEdit() {
  return (
    <div className="group flex justify-center">
      <div className="group-hover:text-primary/50 group-hover:border-primary/50 border-primary text-primary my-2 flex aspect-square h-12 w-12 cursor-pointer flex-col items-center justify-center gap-y-1 rounded-2xl border-2 border-dashed bg-transparent sm:h-20 sm:w-20">
        <Edit className="size-6 sm:size-8" />
        <p className="mt-1 line-clamp-1 hidden px-1 text-center text-xs font-bold sm:inline">
          Bearbeiten
        </p>
      </div>
    </div>
  );
}
