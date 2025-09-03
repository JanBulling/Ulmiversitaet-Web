import { cn } from "@/lib/utils";

export default function BaseLayout({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mx-auto my-8 w-full max-w-screen-xl", className)}>
      {children}
    </div>
  );
}
