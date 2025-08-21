import { Search } from "lucide-react";
import Link from "next/link";

export default function SearchBar() {
  return (
    <div>
      <Link href="/search">
        <div className="bg-card text-muted-foreground flex h-16 w-full items-center gap-4 border-b px-4 shadow md:hidden">
          <Search />
          <p>Suchen...</p>
        </div>
      </Link>
    </div>
  );
}
