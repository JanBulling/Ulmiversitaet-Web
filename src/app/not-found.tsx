import Link from "next/link";
import Logo from "@/ui/logo";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 text-center px-4">
      <Logo size="lg" />
      <h1 className="text-5xl font-extrabold tracking-tight">404</h1>
      <h2 className="text-2xl font-bold">Seite nicht gefunden</h2>
      <p className="text-muted-foreground">Die angeforderte Seite existiert nicht.</p>
      <Link href="/" className="mt-4 underline">
        Zur Startseite
      </Link>
    </div>
  );
}


