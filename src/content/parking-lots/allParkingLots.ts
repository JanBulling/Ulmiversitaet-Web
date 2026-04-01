export type ParkingLot = {
  name?: string;
  nameShort?: string;
  code: string;
  id: number;
  total: number;
  location: "WEST" | "OST" | "HELMHOLTZ" | "KLINIKEN" | "MICHELSBERG";
  address: string;
  lat: number;
  lng: number;
};

const mainLotsCode = ["P10", "P24", "P41", "P09", "P20"];
export const mainLotsMobile = ["P10", "P24", "P41"];

export const parkingLots: ParkingLot[] = [
  {
    name: "Manfred-Börner",
    nameShort: "MBS",
    code: "P09",
    id: 10025,
    total: 64,
    location: "WEST",
    address: "Manfred-Börner-Straße, 89081 Ulm",
    lat: 48.41912,
    lng: 9.942359,
  },
  {
    name: "Uni West",
    nameShort: "West",
    code: "P10",
    id: 10003,
    total: 301,
    location: "WEST",
    address: "Albert-Einstein-Allee 47, 89081 Ulm",
    lat: 48.42005,
    lng: 9.943917,
  },
  {
    code: "P11",
    id: 10004,
    total: 101,
    location: "WEST",
    address: "Albert-Einstein-Allee 45-47, 89081 Ulm",
    lat: 48.42046,
    lng: 9.94491,
  },
  {
    code: "P12",
    id: 10005,
    total: 66,
    location: "WEST",
    address: "Albert-Einstein-Allee 43-45, 89081 Ulm",
    lat: 48.42076,
    lng: 9.945848,
  },
  {
    code: "P13",
    id: 10006,
    total: 20,
    location: "WEST",
    address: "Albert-Einstein-Allee 37, 89081 Ulm",
    lat: 48.42076,
    lng: 9.945848,
  },
  {
    code: "P16",
    id: 10008,
    total: 174,
    location: "KLINIKEN",
    address: "Albert-Einstein-Allee 29, 89081 Ulm",
    lat: 48.42263,
    lng: 9.947908,
  },
  {
    name: "Parkhaus Mitte",
    nameShort: "Mitte",
    code: "P20",
    id: 10020,
    total: 339,
    location: "KLINIKEN",
    address: "Albert-Einstein-Allee 16, 89081 Ulm",
    lat: 48.42396,
    lng: 9.951033,
  },
  {
    code: "P26",
    id: 10018,
    total: 107,
    location: "KLINIKEN",
    address: "Albert-Einstein-Allee 23, 89081 Ulm",
    lat: 48.42389,
    lng: 9.951642,
  },
  {
    name: "Externer Parkplatz",
    code: "P23",
    id: 10011,
    total: 413,
    location: "OST",
    address: "Albert-Einstein-Allee 8/2, 89081 Ulm",
    lat: 48.42543,
    lng: 9.95496,
  },
  {
    name: "Uni Nord",
    nameShort: "Nord",
    code: "P24",
    id: 10012,
    total: 221,
    location: "OST",
    address: "Albert-Einstein-Allee, 89081 Ulm",
    lat: 48.42481,
    lng: 9.953938,
  },
  {
    name: "Helmholtz",
    nameShort: "Helmh.",
    code: "P41",
    id: 10016,
    total: 481,
    location: "HELMHOLTZ",
    address: "Helmholtzstraße, 89081 Ulm",
    lat: 48.42599,
    lng: 9.958382,
  },
  {
    code: "P44",
    id: 10017,
    total: 78,
    location: "HELMHOLTZ",
    address: "Helmholtzsstraße 14-22, 89081 Ulm",
    lat: 48.42602,
    lng: 9.96258,
  },
  {
    name: "HNO Klinik",
    code: "M1",
    id: 10021,
    total: 545,
    location: "MICHELSBERG",
    address: "Innenhof, Zufahrt über Eythstraße, 89081 Ulm",
    lat: 48.40938,
    lng: 9.991174,
  },
  {
    name: "Klinik Michelsberg",
    code: "M2",
    id: 10021,
    total: 545,
    location: "MICHELSBERG",
    address: "Schwabstraße 15, 89081 Ulm",
    lat: 48.40819,
    lng: 9.992269,
  },
  {
    name: "Frauenklinik",
    code: "M3",
    id: -1,
    total: 83,
    location: "MICHELSBERG",
    address: "Pritwitzstrasse 43, 89081 Ulm",
    lat: 48.41076,
    lng: 9.99374,
  },
  {
    name: "Urologische Klinik",
    code: "M4",
    id: -1,
    total: 20,
    location: "MICHELSBERG",
    address: "Pritwitzstrasse 43, 89081 Ulm",
    lat: 48.40974,
    lng: 9.994923,
  },
] as const;

export const MAIN_LOTS = parkingLots.filter((p) =>
  mainLotsCode.includes(p.code),
);
