// components/mdx-code-decorator.tsx
"use client";

import { useEffect } from "react";
import { CopyButton } from "@/ui/copy-button";

export function MdxCodeDecorator({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const blocks = document.querySelectorAll<HTMLElement>("pre > code");
    blocks.forEach((code) => {
      const pre = code.parentElement as HTMLElement;
      if (!pre || pre.dataset.hasCopy === "1") return;
      pre.dataset.hasCopy = "1";
      pre.classList.add("relative");

      const wrapper = document.createElement("div");
      wrapper.className =
        "absolute right-2 top-1/2 -translate-y-1/2 z-10 flex items-center gap-1 rounded-md border bg-background/200 px-1.5 backdrop-blur";

      const mount = document.createElement("span");
      wrapper.appendChild(mount);
      pre.appendChild(wrapper);

      import("react-dom/client").then(({ createRoot }) => {
        const getText = () => code.innerText;
        const root = createRoot(mount);
        root.render(<CopyButton getText={getText} />);
      });
    });
  }, []);

  return <>{children}</>;
}