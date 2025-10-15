"use client";

import { Button } from "@/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/ui/sheet";
import { Menu } from "lucide-react";
import Link from "next/link";
import { ModeSwitcher } from "./mode-switcher";
import * as React from "react";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

export default function MobileNav({
  className,
  items,
  ...props
}: React.ComponentProps<"nav"> & {
  items: { href: string; label: string }[];
}) {
  const t = useTranslations("Nav");

  const [open, setOpen] = React.useState<boolean>(false);

  return (
    <div className={cn("block md:hidden", className)}>
      <Sheet onOpenChange={setOpen} open={open}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon">
            <Menu className="size-6" />
          </Button>
        </SheetTrigger>
        <SheetHeader className="sr-only">
          <SheetTitle>Mobile navigation bar</SheetTitle>
        </SheetHeader>
        <SheetContent side="top" className="z-50 h-full">
          <nav
            className="my-auto flex flex-col items-center gap-2"
            onClick={() => setOpen(false)}
            {...props}
          >
            {items.map((item) => (
              <Link key={item.label} href={item.href}>
                {t(item.label)}
              </Link>
            ))}
            <ModeSwitcher />
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
}
