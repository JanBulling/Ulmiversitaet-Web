import { MensaMenu } from "./menu.type";

export async function getMensaMenu(): Promise<{
  date: Date;
  mensaPlan: MensaMenu[] | null;
}> {
  try {
    const request = await fetch("https://mensa.ulmiversitaet.de/api/v1/today");
    const data = await request.json();

    const date = new Date();
    const mensaPlan = data as MensaMenu[];

    return { date: date, mensaPlan: mensaPlan };
  } catch (err) {
    console.error("[GET-MENSA-MENU]", err);
    return { date: new Date(), mensaPlan: null };
  }
}
