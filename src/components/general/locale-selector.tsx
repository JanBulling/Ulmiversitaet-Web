"use client";

import * as React from "react";

import { useParams } from "next/navigation";

import { usePathname, useRouter } from "@/i18n/navigation";
import { Select, SelectContent, SelectTrigger, SelectValue } from "@/ui/select";

interface Props {
  children: React.ReactNode;
  defaultValue: string;
}

export default function LocaleSelector({ children, defaultValue }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = React.useTransition();
  const pathname = usePathname();
  const params = useParams();

  function switchLocale(value: string) {
    const newLocale = value;

    startTransition(() => {
      router.replace(
        // @ts-expect-error -- TypeScript will validate that only known `params`
        // are used in combination with a given `pathname`. Since the two will
        // always match for the current route, we can skip runtime checks.
        { pathname, params },
        { locale: newLocale },
      );
      router.refresh();
    });
  }

  return (
    <Select
      disabled={isPending}
      onValueChange={switchLocale}
      defaultValue={defaultValue}
    >
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>{children}</SelectContent>
    </Select>
  );
}
