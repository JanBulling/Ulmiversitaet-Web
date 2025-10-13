import Link from "next/link";
import BaseLayout from "./base-layout";
import { Button } from "@/ui/button";
import { ArrowLeft } from "lucide-react";
import { useTranslations } from "next-intl";

interface GuideLayoutProps {
  children: React.ReactNode;
  readingTimeMin?: number;
  published?: string;
  author?: string;
}

export default function GuideLayout({ children }: GuideLayoutProps) {
  const t = useTranslations("GuidesPage");
  return (
    <BaseLayout className="max-w-screen-lg lg:mx-auto">
      <div className="mb-4 px-4">
        <Link href="/guides">
          <Button variant="outline" size="sm">
            <ArrowLeft />
            {t("backToAll")}
          </Button>
        </Link>
      </div>

      <div className="bg-card border p-4 shadow sm:p-6 md:mx-4 md:rounded-xl md:p-8">
        {children}
      </div>
    </BaseLayout>
  );
}
