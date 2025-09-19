// ui/toast.ts
"use client";

let container: HTMLDivElement | null = null;

function ensureContainer() {
  if (container && document.body.contains(container)) return container;

  container = document.createElement("div");
  container.id = "toast-root";
  container.setAttribute("role", "status");
  container.setAttribute("aria-live", "polite");
  container.className = [
    "pointer-events-none fixed bottom-4 right-4 z-[1000]",
    "flex max-w-full flex-col items-end gap-2",
  ].join(" ");

  document.body.appendChild(container);
  return container;
}

export function showToast(message: string, opts?: { duration?: number }) {
  const dur = opts?.duration ?? 1500;
  const root = ensureContainer();

  const toast = document.createElement("div");
  toast.className = [
    "pointer-events-auto select-none",
    "rounded-md border bg-foreground text-background",
    "px-3 py-1.5 text-sm shadow-lg",
    // initial state (hidden + slightly below)
    "opacity-0 translate-y-3",
    // transition
    "transition-all duration-250 ease-out",
  ].join(" ");
  toast.textContent = message;

  // Optional: cap total toasts
  while (root.children.length >= 4) {
    root.removeChild(root.firstChild as Node);
  }

  root.appendChild(toast);

  // Force a reflow so the browser registers the initial state
  // Then promote to the "enter" state in the next frame
  // This guarantees the slide-in animation runs.
  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  toast.getBoundingClientRect();

  requestAnimationFrame(() => {
    toast.classList.remove("opacity-0", "translate-y-3");
    toast.classList.add("opacity-100", "translate-y-0");
  });

  // Leave after `dur`
  window.setTimeout(() => {
    toast.classList.remove("opacity-100", "translate-y-0");
    toast.classList.add("opacity-0", "translate-y-3");
    window.setTimeout(() => {
      toast.remove();
    }, 260);
  }, dur);
}