export const siteConfig = {
  name: "Ulmiversität",
  url: "https://ulmiversitaet.de",
  ogImage: "https://ulmiversitaet.de/og.jpg",
  description: "Link management Platform für die Universität Ulm",
  links: {
    github: "https://github.com/janbulling/ulmiversitaet-web",
    instagram: "https://www.instagram.com/ulmiversitaet/",
  },
};

export type SiteConfig = typeof siteConfig;

export const META_THEME_COLORS = {
  light: "#ffffff",
  dark: "#09090b",
};

export const navItems = [
  {
    href: "/",
    label: "Home",
  },
  {
    href: "/guides",
    label: "Anleitungen",
  },
];
