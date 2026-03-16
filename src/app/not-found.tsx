import Link from "next/link";
import Logo from "@/ui/logo";
import { Cat } from "lucide-react";
import { getTranslations, getLocale } from "next-intl/server";

export default async function NotFound() {
  const t = await getTranslations("NotFound");
  const locale = await getLocale();

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4 text-center px-6">
      <Logo size="lg" />
      <div className="flex items-center gap-2">
        <Cat className="h-10 w-10 text-muted-foreground animate-bounce" />
        <h1 className="text-5xl font-extrabold tracking-tight">404</h1>
      </div>
      <h2 className="text-2xl font-bold">{t("title")}</h2>
      <p className="text-muted-foreground max-w-md">{t("description")}</p>
      <Link
        href={`/${locale}`}
        className="mt-4 inline-flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-medium transition hover:bg-accent hover:text-accent-foreground"
      >
        {t("backHome")}
      </Link>
    </div>
  );
}