import { navItems } from "@/config/site";
import { ModeSwitcher } from "./mode-switcher";

import { Separator } from "@/ui/separator";
import { MainNav } from "./main-nav";
import Logo from "@/ui/logo";

export function SiteHeader() {
  return (
    <>
      <header
        id="header"
        className="bg-card sticky top-0 z-50 w-full border-b transition-all duration-300 ease-in-out"
      >
        <div className="mx-auto flex h-16 max-w-screen-xl items-center gap-2 px-12">
          {/* <MobileNav className="flex lg:hidden" /> */}
          <Logo size="md" />

          <MainNav
            items={navItems}
            className="hidden md:flex md:flex-1 md:justify-center"
          />

          <div className="ml-auto flex items-center gap-2 md:justify-end">
            {/* <Search /> */}
            <Separator
              orientation="vertical"
              className="ml-2 hidden lg:block"
            />
            <ModeSwitcher />
          </div>
        </div>
      </header>
      <script
        dangerouslySetInnerHTML={{
          __html: `function onScroll() {const header = document.getElementById("header");if (window.scrollY > 0) {header.classList.add("scrolled");} else {header.classList.remove("scrolled");}}document.addEventListener("scroll", onScroll);`,
        }}
      />
    </>
  );
}
