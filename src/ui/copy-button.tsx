// ui/copy-button.tsx
"use client";

import { useState } from "react";
import { Button } from "@/ui/button";
import { Check, Copy } from "lucide-react";
import { showToast } from "@/ui/toast";

export function CopyButton({ getText }: { getText: () => string }) {
  const [copied, setCopied] = useState(false);

  async function onCopy() {
    await navigator.clipboard.writeText(getText());
    setCopied(true);
    showToast("Kopiert!");
    setTimeout(() => setCopied(false), 900);
  }

  return (
    <Button
      onClick={onCopy}
      variant="ghost"
      size="icon"
      className="
        h-7 w-7 p-0 rounded-full
        text-muted-foreground hover:text-foreground
        focus-visible:ring-1 bg-transparent
      "
      aria-label="Code kopieren"
      title="Code kopieren"
    >
      {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
    </Button>
  );
}