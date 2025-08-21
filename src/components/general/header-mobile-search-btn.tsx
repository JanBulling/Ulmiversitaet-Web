import { Button } from "@/ui/button";
import { Search } from "lucide-react";
import Link from "next/link";

export default function HeaderMobileSearchBtn() {
  return (
    <Link id="header-search" href="/search">
      <Button variant="outline" size="icon">
        <Search />
      </Button>
    </Link>
  );
}
