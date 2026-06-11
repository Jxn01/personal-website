export type Locale = "en" | "hu";

/** A vinyl-side. EN is canonical (SIDE A). */
export type Side = "A" | "B";

export interface FeaturedProject {
  catalog: string; // e.g. "JXN-001"
  name: string;
  stack: string;
  github: string;
  /** Paragraphs; may contain minimal inline HTML (<strong>, <code>, <a>). */
  paras: string[];
  /** Verbatim status line, e.g. "[STATUS: live demo pending — will be self-hosted]" */
  status?: string;
}

export interface SmallProject {
  catalog: string;
  name: string;
  stack: string;
  github: string;
  body: string;
}

export interface LabItem {
  name: string;
  body: string;
}

export interface FieldNote {
  id: string; // "FN-01"
  title: string;
  body: string;
}

export interface StackTier {
  name: string;
  intro: string;
  items: string[];
}

export interface OffClockItem {
  label: string;
  body: string;
}

export interface Dict {
  meta: {
    htmlLang: string;
    side: Side;
    title: string;
    description: string;
  };
  ui: {
    skipToContent: string;
    sideTooltip: string; // clarity tooltip on the SIDE A/B toggle
    statusLink: string;
    portraitLabel: string; // machine label on the portrait placeholder
    trackLabel: string; // "track" — used by the playhead
    rollD20: string; // the chip on the D&D card
  };
  hero: {
    name: string;
    headline: string;
    body: string;
    ctas: { work: string; github: string; contact: string };
    micro: string;
  };
  about: {
    title: string;
    paras: string[];
  };
  experience: {
    title: string;
    role: string;
    org: string;
    dates: string;
    intro: string;
    domainsLead: string;
    domains: { label: string; body: string }[];
    fieldNotesTitle: string;
    fieldNotes: FieldNote[];
  };
  featured: {
    title: string;
    projects: FeaturedProject[];
  };
  more: {
    title: string;
    projects: SmallProject[];
    labTitle: string;
    lab: LabItem[];
  };
  ai: {
    title: string;
    paras: string[];
  };
  stack: {
    title: string;
    tiers: StackTier[];
    closing: string;
  };
  offclock: {
    title: string;
    items: OffClockItem[];
  };
  now: {
    title: string;
    lead: string;
    /** "%GAME%" is replaced from config (or rendered as a visible placeholder). */
    items: string[];
    spinningLabel: string; // "now spinning:"
    lastUpdatedLabel: string;
  };
  contact: {
    title: string;
    lead: string;
    body: string;
    emailLabel: string;
    emailPlaceholder: string;
    closing: string;
  };
  footer: {
    /** Liner notes — exactly three lines, per spec ("pick 2–3"). */
    lines: string[];
  };
  tracks: {
    /** Section titles in tracklist order, 01..10. */
    titles: string[];
  };
}
