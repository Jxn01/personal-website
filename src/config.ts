/**
 * JXN-000 · owner-editable config.
 *
 * Spec rule 3: placeholder items stay visible placeholders or get stubbed
 * behind config — never fabricated. Fill these in; the site renders honest
 * placeholders while they're null.
 */
export const config = {
  /** Contact email. null → visible placeholder on the site. */
  email: "jxn.personal@gmail.com" as string | null,
  /** 09 — NOW: the game currently killing you. */
  currentGame: "Hollow Knight: Silksong" as string | null,
  /** Footer easter egg: `now spinning:` line. null → line hidden. */
  currentAlbum: "To Pimp a Butterfly" as string | null,
  /** 09 — NOW: last-updated date, e.g. "2026-06". null → visible placeholder. */
  nowUpdated: "2026-06" as string | null,

  /** The site went live (first commit). The bonsai grows from this date. */
  launchDate: "2026-06-11",

  links: {
    github: "https://github.com/Jxn01",
    linkedin: "https://www.linkedin.com/in/jxn01",
  },
} as const;
