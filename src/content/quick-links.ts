export type QuickLink = {
  label: string;

  href: string;
  internalLink?: boolean;

  color?: string;
  icon?: string;
};

const defaultQuickLinksLabel: QuickLinkLabelType[] = [
  "Moodle",
  "Campus Online",
  "Campus4",
  "Sogo",
  "Print@Uni",
  "CloudStore",
  "Campus Map",
];

export const quickLinks = [
  {
    label: "Bib Kathalog",
    href: "",
  },
  {
    label: "Campus4",
    href: "https://campus4.uni-ulm.de",
    icon: "/icons/quick-links/campus4.png",
  },
  {
    label: "Campus Map",
    href: "/campus-map",
    icon: "/icons/quick-links/map.png",
    internalLink: true,
  },
  {
    label: "Campus Online",
    href: "https://campusonline.uni-ulm.de",
    icon: "/icons/quick-links/campusonline.png",
  },
  {
    label: "CloudStore",
    href: "https://cloudstore.uni-ulm.de",
    icon: "/icons/quick-links/nextcloud.png",
  },
  {
    label: "CoronaNG",
    href: "",
  },
  {
    label: "Guides",
    href: "/guides",
    internalLink: true,
  },
  {
    label: "Mensa-West Bestellung",
    href: "",
  },
  {
    label: "Mobility Online",
    href: "",
  },
  {
    label: "Moodle",
    href: "https://moodle.uni-ulm.de",
    icon: "/icons/quick-links/moodle.png",
  },
  {
    label: "Print@Uni",
    href: "https://print.uni-ulm.de",
    icon: "/icons/quick-links/print.png",
  },
  {
    label: "Sogo",
    href: "https://sogo.uni-ulm.de",
    icon: "/icons/quick-links/mail.png",
  },
  {
    label: "Sona",
    href: "",
  },
  {
    label: "Stuve-Pad",
    href: "",
  },
  {
    label: "Stuve-Wiki",
    href: "",
  },
  {
    label: "Stuve-IT",
    href: "",
  },
] as const satisfies readonly QuickLink[];

type QuickLinkLabelType = (typeof quickLinks)[number]["label"];

export const defaultQuickLinks = (): QuickLink[] =>
  quickLinks
    .filter((q) => defaultQuickLinksLabel.includes(q.label))
    .sort(
      (a, b) =>
        defaultQuickLinksLabel.indexOf(a.label) -
        defaultQuickLinksLabel.indexOf(b.label),
    )
    .slice(0, 7);

// TypeSafe option (enforce a subset relationship)
// export const defaultQuickLinks: QuickLink[] = quickLinks.filter(
//   (q): q is Extract<typeof quickLinks[number], { label: typeof defaultQuickLinksLabel[number] }> =>
//     (defaultQuickLinksLabel as readonly string[]).includes(q.label)
// );
