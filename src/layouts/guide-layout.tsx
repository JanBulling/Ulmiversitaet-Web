import Link from "next/link";
import BaseLayout from "./base-layout";
import { Button } from "@/ui/button";
import { ArrowLeft} from "lucide-react";

interface GuideLayoutProps {
  children: React.ReactNode;
  readingTimeMin?: number;
  published?: string;
  author?: string;
}

export default function GuideLayout({
  children,

}: GuideLayoutProps) {
  return (
    <BaseLayout className="max-w-screen-lg lg:mx-auto">
      <div className="px-4 mb-4">
        <Link href="/guides">
          <Button variant="outline" size="sm">
            <ArrowLeft />
            Zurück zu allen Anleitungen
          </Button>
        </Link>
      </div>


      <div className="bg-card border p-4 shadow sm:p-6 md:mx-4 md:rounded-xl md:p-8">
        {children}
      </div>
    </BaseLayout>
  );
}
