import {
  CookingPot,
  Ham,
  Hamburger,
  IceCream,
  Leaf,
  LucideProps,
  Pizza,
  Salad,
  Utensils,
  Wheat,
} from "lucide-react";

export type MensaMenu = {
  category: MensaCategory;
  meals: MensaMeal[];
};

export type MensaMeal = {
  name: string;
  types: MensaMealTypes[];
  prices: {
    note?: string;
    student: string;
  };
  nutrition: {
    calories?: string;
    protein?: string;
  };
  rating?: number | null;
  numberRatings?: number | null;
};

export type MensaCategory =
  | "SATTMACHER"
  | "TOPF UND PFANNE"
  | "PRIMA KLIMA"
  | "FLEISCH UND FISCH"
  | "PIZZA"
  | "PASTA"
  | "SNACKS"
  | "DESSERT"
  | "SALAT"
  | "SALATBUFFET"
  | "BEILAGE"
  | "UNKNOWN";

export const mensaCategoryColorMap: Partial<Record<MensaCategory, string>> = {
  SATTMACHER: "#f97316",
  "FLEISCH UND FISCH": "#ef4444",
  "PRIMA KLIMA": "#22c55e",
  "TOPF UND PFANNE": "#3b82f6",
  SALAT: "#65a30d",
  SALATBUFFET: "#16a34a",
  BEILAGE: "#525252",
  DESSERT: "#ec4899",
  PIZZA: "#92400e",
  PASTA: "#92400e",
  SNACKS: "#92400e",
  UNKNOWN: "#525252",
};

export const mensaCategoryIconMap: Partial<
  Record<
    MensaCategory,
    React.ForwardRefExoticComponent<
      Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
    >
  >
> = {
  SATTMACHER: Utensils,
  "FLEISCH UND FISCH": Ham,
  "PRIMA KLIMA": Leaf,
  "TOPF UND PFANNE": CookingPot,
  SALAT: Salad,
  SALATBUFFET: Salad,
  DESSERT: IceCream,
  PIZZA: Pizza,
  PASTA: Wheat,
  SNACKS: Hamburger,
};
export const MensaCategoryDefaultIcon = Utensils;

export type MensaMealTypes =
  | "VEGAN"
  | "VEGETARIAN"
  | "GEFLÜGEL"
  | "RIND"
  | "SCHWEIN"
  | "FISCH"
  | "TINTENFISCH"
  | "WILDFLEISCH";
