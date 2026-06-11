import type { Dict, Locale } from "./types";
import { en } from "./en";
import { hu } from "./hu";

export type { Dict, Locale, Side } from "./types";

const dicts: Record<Locale, Dict> = { en, hu };

export function getDict(locale: Locale): Dict {
  return dicts[locale];
}

export function otherLocale(locale: Locale): Locale {
  return locale === "en" ? "hu" : "en";
}

/** Strip inline HTML to count words honestly. */
function words(html: string): number {
  const text = html.replace(/<[^>]+>/g, " ");
  return text.split(/\s+/).filter(Boolean).length;
}

/**
 * Reading time as track duration. 200 wpm, like a fair DJ.
 * Returns seconds; format with mmss().
 */
export function readingSeconds(htmlChunks: string[]): number {
  const w = htmlChunks.reduce((acc, c) => acc + words(c), 0);
  return Math.max(20, Math.round((w / 200) * 60));
}

export function mmss(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

/** Track number as it appears on the sleeve: "01".."10". */
export function trackNo(index: number): string {
  return String(index + 1).padStart(2, "0");
}
