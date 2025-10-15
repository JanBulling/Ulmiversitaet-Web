import { BookOpenIcon, LinkIcon, LucideProps, MapIcon } from "lucide-react";
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
    label: "links.exmatriculation",
    description: "links.exmatriculationDescription",
    href: "/exmatriculation",
    internalLink: true,
    icon: LinkIcon,
  },

  {
    label: "links.map",
    description: "links.mapDescription",
    href: "/campus-map",
    icon: MapIcon,
    internalLink: true,
  },
  {
    label: "links.library",
    description: "links.libraryDescription",
    href: "https://ulm.ibs-bw.de/aDISWeb/app?service=direct/0/Home/$DirectLink&sp=SOPAC00",
    icon: BookOpenIcon,
  },
];
