export const BASE_URL = "https://www.ulmiversitaet.de";

export const siteConfig = {
  name: "Ulmiversität",
  url: BASE_URL,
  ogImage: `${BASE_URL}/og.jpg`,
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
    href: "/links",
    label: "Alle Links",
  },
  {
    href: "/guides",
    label: "Anleitungen",
  },
];
