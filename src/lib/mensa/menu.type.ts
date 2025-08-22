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
  | "OTHER";

export type MensaMealTypes =
  | "VEGAN"
  | "VEGETARIAN"
  | "GEFLÜGEL"
  | "RIND"
  | "SCHWEIN"
  | "FISCH"
  | "TINTENFISCH"
  | "WILDFLEISCH";
