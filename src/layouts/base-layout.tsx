import { cn } from "@/lib/utils";

export function BaseLayout({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn("mx-auto my-8 w-full max-w-screen-xl md:my-8", className)}
    >
      {children}
    </div>
  );
}
