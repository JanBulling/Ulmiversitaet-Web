"use client";

import * as React from "react";
import { CheckIcon, ClipboardIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "./button";

export function CopyButton({
  value,
  className,
  variant = "outline",
  ...props
}: React.ComponentProps<typeof Button> & {
  value: string;
}) {
  const [hasCopied, setHasCopied] = React.useState(false);

  React.useEffect(() => {
    setTimeout(() => {
      setHasCopied(false);
    }, 2000);
  }, []);

  return (
    <Button
      data-slot="copy-button"
      size="icon"
      variant={variant}
      className={cn("absolute top-0.5 right-1", className)}
      onClick={() => {
        navigator.clipboard.writeText(value);
        setHasCopied(true);
      }}
      {...props}
    >
      <span className="sr-only">Copy</span>
      {hasCopied ? <CheckIcon /> : <ClipboardIcon />}
    </Button>
  );
}
