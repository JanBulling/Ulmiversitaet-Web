import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace("ö", "oe")
    .replace("ä", "ae")
    .replace("ü", "ue")
    .replace("ß", "ss")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 50); // Limit to 50 characters
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function capitalize(val: string): string {
  return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}
