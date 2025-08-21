import { Edit } from "lucide-react";

export default function EditQuickLink() {
  return (
    <div>
      <div className="hover:bg-muted flex aspect-square items-center justify-center rounded-lg border-2 border-dashed px-2 py-2 sm:aspect-auto sm:h-28 md:px-4">
        <Edit className="text-muted-foreground size-6 md:size-8" />
      </div>
      <p className="text-muted-foreground mx-auto mt-1 line-clamp-1 px-1 text-center text-xs font-bold">
        Bearbeiten
      </p>
    </div>
  );
}
