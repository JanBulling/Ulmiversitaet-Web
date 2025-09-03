import BaseLayout from "./base-layout";

export default function SiteLayout({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <BaseLayout className="px-4">{children}</BaseLayout>;
}
