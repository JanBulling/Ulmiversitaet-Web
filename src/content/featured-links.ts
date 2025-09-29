import { BookOpenIcon, LinkIcon, LucideProps } from "lucide-react";
import { ForwardRefExoticComponent, RefAttributes } from "react";

export type FeaturedLink = {
  label: string;
  description: string;
  href: string;
  icon:
    | string
    | ForwardRefExoticComponent<
        Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
      >;
  internalLink?: boolean;
};

export const featuredLinks: FeaturedLink[] = [
  {
    label: "Exmatrikulation",
    description: "Soll ich mich exmatrikulieren?",
    href: "/exmatrikulation",
    internalLink: true,
    icon: LinkIcon,
  },
  {
    label: "Bibliothekskatalog",
    description: "Bücher ausleihen",
    href: "https://ulm.ibs-bw.de/aDISWeb/app?service=direct/0/Home/$DirectLink&sp=SOPAC00",
    icon: BookOpenIcon,
  },
];
