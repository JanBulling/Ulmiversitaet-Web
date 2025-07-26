import { siteConfig } from "@/config/site";
import { Button } from "@/ui/button";
import { Icons } from "@/ui/icons";
import Logo from "@/ui/logo";
import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="bg-card border-t">
      <div className="mx-auto flex max-w-screen-xl flex-col gap-2 px-12 pt-4 pb-1">
        <div className="flex items-center gap-2">
          <Logo size="sm" />

          <div className="flex flex-1 items-center justify-center text-sm">
            <Button variant="link">
              <Link href="/impressum">Impressum</Link>
            </Button>
            <Button variant="link">
              <Link href="/impressum">About</Link>
            </Button>
          </div>

          <div>
            <Button variant="ghost" size="icon">
              <Link
                href={siteConfig.links.github}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Icons.gitHub className="text-foreground size-8" />
              </Link>
            </Button>
            <Button variant="ghost" size="icon">
              <Link
                href={siteConfig.links.instagram}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Icons.instagram className="text-foreground size-8" />
              </Link>
            </Button>
          </div>
        </div>
        <div className="text-muted-foreground ml-auto flex items-center gap-2 text-xs">
          <p>© {new Date().getFullYear()}</p>
          <Button variant="ghost" className="p-1 text-xs">
            <Link
              href="https://jan-bulling.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Jan Bulling
            </Link>
          </Button>
          <Button variant="ghost" className="p-1 text-xs">
            <Link
              href="https://www.instagram.com/rau__stefan/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Stefan Rau
            </Link>
          </Button>
        </div>
      </div>
    </footer>
  );
}
