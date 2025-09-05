import { cn } from "@/lib/utils";
import BaseLayout from "./base-layout";

export default function SiteLayout({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <BaseLayout className={cn("px-0 md:px-4", className)}>
      {children}
    </BaseLayout>
  );
}
