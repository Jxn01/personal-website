/**
 * Terminal chrome strings, bilingual. The terminal reads the live document
 * language each time, so flipping the record re-localises it immediately.
 */
import type { Locale } from "./fs";

export interface TermStrings {
  banner: string;
  help: { cmd: string; arg?: string; desc: string }[];
  helpMore: string;
  noSuchFile: (name: string) => string;
  notDir: (name: string) => string;
  isDir: (name: string) => string;
  cmdNotFound: (cmd: string) => string;
  permDenied: string;
  emptyDir: string;
  flipping: string;
  usageSide: string;
  sudoLecture: string;
  sudoGranted: string;
  hireDenied: string;
  whoami: string;
  warframe: string;
  play: string;
  vim: string;
  emacs: string;
  rm: string;
  man: string;
  bonsaiDone: string;
  catMeow: string;
  boom: string;
}

const EN: TermStrings = {
  banner:
    'jxn-000 terminal — a small filesystem, real commands. type <span class="t-accent">help</span>, or just start with <span class="t-accent">ls</span>. exploration is respected.',
  help: [
    { cmd: "ls", arg: "[-a] [dir]", desc: "list a directory" },
    { cmd: "cd", arg: "<dir>", desc: "change directory (.. and ~ work)" },
    { cmd: "cat", arg: "<file>", desc: "read a file" },
    { cmd: "tree", arg: "[dir]", desc: "show the tree" },
    { cmd: "pwd", desc: "where am i" },
    { cmd: "find", arg: "<name>", desc: "search by name" },
    { cmd: "fetch", desc: "system info" },
    { cmd: "uptime", desc: "since last master" },
    { cmd: "bonsai", desc: "grow one" },
    { cmd: "pads / tag / mix", desc: "open a toy" },
    { cmd: "status", desc: "the engine room" },
    { cmd: "side", arg: "a|b", desc: "flip the record" },
    { cmd: "clear", desc: "wipe" },
    { cmd: "exit", desc: "close (esc / :q too)" },
  ],
  helpMore: "…there are more. this is a crate; dig.",
  noSuchFile: (n) => `${n}: no such file or directory`,
  notDir: (n) => `${n}: not a directory`,
  isDir: (n) => `${n}: is a directory`,
  cmdNotFound: (c) => `command not found: ${c} — try help`,
  permDenied: "permission denied",
  emptyDir: "(empty)",
  flipping: "flipping the record…",
  usageSide: "usage: side a|b",
  sudoLecture: "we trust you have received the usual lecture. (try: sudo hire-me)",
  sudoGranted: "permission granted. (you seem trustworthy.)",
  hireDenied: "permission denied: try sudo.",
  whoami: "norbert. or jxn, depending on the paperwork.",
  warframe: "~3,000 hours. i understand sunk cost intimately and continue regardless.",
  play: "the beat is structural here — but the pads are real. try: pads",
  vim: "this is not that kind of terminal. (:q works here though, which is more than some can say.)",
  emacs: "no. (respectfully.)",
  rm: "rm: this record is read-only. as records should be.",
  man: "the only manual here is docs/jxn-000-site-asset.md, and you can't have it.",
  bonsaiDone:
    'done growing. the one in <span class="t-accent">status</span> grows with the site — check back next month.',
  catMeow: "the cat. it does not take requests.",
  boom: "BOOM.",
};

const HU: TermStrings = {
  banner:
    'jxn-000 terminál — egy kis fájlrendszer, igazi parancsok. írd be: <span class="t-accent">help</span>, vagy kezdd az <span class="t-accent">ls</span>-sel. a felfedezés tisztelet tárgya.',
  help: [
    { cmd: "ls", arg: "[-a] [mappa]", desc: "mappa listázása" },
    { cmd: "cd", arg: "<mappa>", desc: "mappaváltás (a .. és a ~ is megy)" },
    { cmd: "cat", arg: "<fájl>", desc: "fájl olvasása" },
    { cmd: "tree", arg: "[mappa]", desc: "a fa megjelenítése" },
    { cmd: "pwd", desc: "hol vagyok" },
    { cmd: "find", arg: "<név>", desc: "keresés név alapján" },
    { cmd: "fetch", desc: "rendszerinfó" },
    { cmd: "uptime", desc: "az utolsó master óta" },
    { cmd: "bonsai", desc: "növessz egyet" },
    { cmd: "pads / tag / mix", desc: "nyiss meg egy játékot" },
    { cmd: "status", desc: "a gépház" },
    { cmd: "side", arg: "a|b", desc: "fordítsd meg a lemezt" },
    { cmd: "clear", desc: "törlés" },
    { cmd: "exit", desc: "bezárás (esc / :q is)" },
  ],
  helpMore: "…van még. ez egy crate; áss.",
  noSuchFile: (n) => `${n}: nincs ilyen fájl vagy könyvtár`,
  notDir: (n) => `${n}: nem könyvtár`,
  isDir: (n) => `${n}: ez egy könyvtár`,
  cmdNotFound: (c) => `ismeretlen parancs: ${c} — próbáld: help`,
  permDenied: "hozzáférés megtagadva",
  emptyDir: "(üres)",
  flipping: "fordítom a lemezt…",
  usageSide: "használat: side a|b",
  sudoLecture: "feltételezzük, hogy megkaptad a szokásos kioktatást. (próbáld: sudo hire-me)",
  sudoGranted: "engedélyezve. (megbízhatónak tűnsz.)",
  hireDenied: "hozzáférés megtagadva: próbáld sudóval.",
  whoami: "norbert. vagy jxn, papírmunkától függően.",
  warframe: "~3000 óra. bensőségesen ismerem a sunk costot, és ettől függetlenül folytatom.",
  play: "a beat itt strukturális — de a padek igaziak. próbáld: pads",
  vim: "ez nem az a fajta terminál. (a :q viszont működik, ami már több a semminél.)",
  emacs: "nem. (tisztelettel.)",
  rm: "rm: ez a lemez csak olvasható. ahogy a lemezeknek illik.",
  man: "az egyetlen kézikönyv itt a docs/jxn-000-site-asset.md, és azt nem kapod meg.",
  bonsaiDone:
    'kész a növés. a <span class="t-accent">status</span>-ban lévő az oldallal együtt nő — nézz vissza jövő hónapban.',
  catMeow: "a macska. nem fogad kéréseket.",
  boom: "BUMM.",
};

export function strings(locale: Locale): TermStrings {
  return locale === "hu" ? HU : EN;
}
