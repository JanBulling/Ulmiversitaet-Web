import { navItems } from "@/config/site";
import { ModeSwitcher } from "./mode-switcher";

import { MainNav } from "./main-nav";
import Logo from "@/ui/logo";
import MobileNav from "./mobile-nav";
import HeaderSearchField from "./search-field";
import NetworkChecker from "./network-checker";

export function SiteHeader() {
  return (
    <>
      <header
        id="header"
        className="bg-card sticky top-0 z-50 w-full border-b shadow transition-all duration-300 ease-in-out"
      >
        <div className="mx-auto flex h-16 max-w-screen-xl items-center justify-between gap-2 px-4 md:px-12">
          <Logo size="md" />

          <MainNav
            items={navItems}
            className="hidden md:flex md:flex-1 md:justify-center"
          />

          <div className="ml-auto flex items-center justify-end gap-4">
            <div className="hidden lg:inline-block">
              <NetworkChecker />
            </div>
            <HeaderSearchField />
            <ModeSwitcher className="hidden md:flex" />

            <MobileNav items={navItems} />
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
