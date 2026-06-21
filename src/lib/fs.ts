/**
 * JXN-FS — a small, fun, navigable filesystem for the terminal.
 *
 * Real `cd` / `ls` / `tree` / `cat` semantics over a hand-authored tree. File
 * contents follow the selected language (read live, so the terminal re-localises
 * the moment you flip the record). Command NAMES stay English — every dev on
 * earth types `ls`, including Hungarian ones.
 */

export type Locale = "en" | "hu";

export interface FsFile {
  type: "file";
  /** static string, or a function for dynamic/localised/DOM-backed content */
  content: string | ((locale: Locale) => string);
  /** render verbatim (ASCII art) instead of wrapping */
  art?: boolean;
  /** hidden unless `ls -a` */
  hidden?: boolean;
}

export interface FsDir {
  type: "dir";
  children: Record<string, FsNode>;
  hidden?: boolean;
}

export type FsNode = FsFile | FsDir;

export const HOME = "/home/jxn";

/* — helpers shared with the terminal ———————————————————————————————————————— */

function fmtUptime(): string {
  const ms = Date.now() - new Date(__BUILD_TIME__).getTime();
  const d = Math.floor(ms / 86400000);
  const h = Math.floor((ms % 86400000) / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  const p = (n: number): string => String(n).padStart(2, "0");
  return `${d}d ${p(h)}:${p(m)}:${p(s)}`;
}

/** Read a track section straight off the live (already-localised) page. */
function siteSection(no: string): (locale: Locale) => string {
  return (locale) => {
    const el = document.querySelector<HTMLElement>(`[data-track][data-no="${no}"]`);
    if (!el) {
      return locale === "hu"
        ? "ez a sáv csak a lemezen él — nyisd meg a /hu oldalt."
        : "this track only plays on the record — open the page itself.";
    }
    return (el.innerText ?? "").replace(/\n{3,}/g, "\n\n").trim();
  };
}

const bi = (en: string, hu: string) => (locale: Locale): string => (locale === "hu" ? hu : en);

/* — the tree ————————————————————————————————————————————————————————————————— */

export const FS: FsDir = {
  type: "dir",
  children: {
    home: {
      type: "dir",
      children: {
        jxn: {
          type: "dir",
          children: {
            "readme.txt": {
              type: "file",
              content: bi(
                [
                  "you're in. yes, this is a real little filesystem.",
                  "",
                  "  ls [-a] [dir]   look around",
                  "  cd <dir>        go somewhere (.. and ~ work)",
                  "  cat <file>      read a file",
                  "  tree            see the whole thing",
                  "",
                  "nothing here bites. rm is disabled — records are read-only.",
                  "impatient? run `tree`. curious? `ls projects`. lost? `cd ~`.",
                ].join("\n"),
                [
                  "bent vagy. igen, ez egy igazi kis fájlrendszer.",
                  "",
                  "  ls [-a] [mappa]  nézz körül",
                  "  cd <mappa>       menj valahova (a .. és a ~ is megy)",
                  "  cat <fájl>       olvass el egy fájlt",
                  "  tree             lásd az egészet",
                  "",
                  "semmi nem harap. az rm ki van kapcsolva — a lemez csak olvasható.",
                  "türelmetlen? `tree`. kíváncsi? `ls projects`. eltévedtél? `cd ~`.",
                ].join("\n"),
              ),
            },
            "about.me": {
              type: "file",
              content: bi(
                [
                  "norbert oláh — full-stack developer, budapest.",
                  "builds production systems people physically walk through.",
                  "fixes the outage, then polishes the animation nobody asked for.",
                  "the next stack is never the problem.",
                ].join("\n"),
                [
                  "oláh norbert — full-stack fejlesztő, budapest.",
                  "olyan éles rendszereket épít, amiken emberek tényleg átsétálnak.",
                  "megjavítja a hibát, aztán csiszolja az animációt, amit senki nem kért.",
                  "a következő stack sosem akadály.",
                ].join("\n"),
              ),
            },
            "now.txt": {
              type: "file",
              content: bi(
                [
                  "currently:",
                  "  - building this site, getting it properly hosted",
                  "  - plotting the calculator",
                  "  - dying repeatedly in something with a boss rush",
                ].join("\n"),
                [
                  "éppen:",
                  "  - építem ezt az oldalt, rendes hosztot keresek neki",
                  "  - tervezem a számológépet",
                  "  - sorozatban halok meg valamiben, amiben van boss rush",
                ].join("\n"),
              ),
            },
            "contact.vcf": {
              type: "file",
              content: bi(
                [
                  "BEGIN:VCARD",
                  "FN:Norbert Oláh",
                  "URL:github.com/Jxn01",
                  "URL:linkedin.com/in/jxn01",
                  "EMAIL:[the owner still hasn't wired this up. genuinely.]",
                  "NOTE:not actively looking — interesting problems get answered first.",
                  "END:VCARD",
                ].join("\n"),
                [
                  "BEGIN:VCARD",
                  "FN:Oláh Norbert",
                  "URL:github.com/Jxn01",
                  "URL:linkedin.com/in/jxn01",
                  "EMAIL:[a tulaj még mindig nem kötötte be. tényleg.]",
                  "NOTE:nem keres aktívan — az érdekes problémák kapják az első választ.",
                  "END:VCARD",
                ].join("\n"),
              ),
            },
            ".bashrc": {
              type: "file",
              hidden: true,
              content: bi(
                [
                  "# you went looking. respect.",
                  "alias please='sudo'",
                  "alias yeet='rm -rf'   # (disabled, obviously)",
                  "alias work='git commit && deploy && pray'",
                  "alias coffee='echo \"⊂((・▽・))⊃ refilling\"'",
                  "export MOOD=focused",
                  "export TElEPHONE=do-not-call",
                ].join("\n"),
                [
                  "# utánanéztél. tisztelet.",
                  "alias please='sudo'",
                  "alias yeet='rm -rf'   # (ki van kapcsolva, naná)",
                  "alias work='git commit && deploy && imádkozz'",
                  "alias kave='echo \"⊂((・▽・))⊃ töltök\"'",
                  "export MOOD=fokuszban",
                  "export TELEFON=ne-hivj",
                ].join("\n"),
              ),
            },
            projects: {
              type: "dir",
              children: {
                "matterlights": {
                  type: "dir",
                  children: {
                    "readme.md": {
                      type: "file",
                      content: bi(
                        "matterlights — screen-to-light sync for Matter bulbs via Home Assistant.\nthe SignalRGB treatment, extended to the ceiling. painfully specific. works.",
                        "matterlights — képernyő–fény szinkron Matter-izzókra, Home Assistanten át.\na SignalRGB-élmény, kiterjesztve a plafonra. fájdalmasan specifikus. működik.",
                      ),
                    },
                    ".disclaimer": {
                      type: "file",
                      hidden: true,
                      content: bi(
                        "built almost entirely through agentic development, in a language i don't\nwrite fluently. i architected it and made every call. i just didn't type\nthe python. see track 06 for what i think that means.",
                        "szinte teljesen agentic fejlesztéssel készült, olyan nyelven, amit nem írok\nfolyékonyan. én terveztem és minden döntést én hoztam. csak nem én gépeltem\na pythont. hogy ez mit jelent, arról a 06-os track szól.",
                      ),
                    },
                  },
                },
                "section-cms": {
                  type: "dir",
                  children: {
                    "readme.md": {
                      type: "file",
                      content: bi(
                        "section-cms — a lightweight, modular, SEO-first CMS in plain PHP.\nno framework, no build step. proof i know what the frameworks do under the hood.",
                        "section-cms — könnyűsúlyú, moduláris, SEO-first CMS sima PHP-ban.\nse framework, se build step. bizonyíték, hogy értem, mit csinálnak a frameworkök.",
                      ),
                    },
                  },
                },
                "algoritmizator": {
                  type: "dir",
                  children: {
                    "readme.md": {
                      type: "file",
                      content: bi(
                        "algoritmizator — gamified platform for learning algorithms & data structures.\nmy BSc thesis, and where i learned full-stack in real time. left honest on purpose.",
                        "algoritmizator — gamifikált platform algoritmusok és adatszerkezetek tanulásához.\na BSc-szakdolgozatom, és ahol élőben tanultam full-stacket. szándékosan őszinte.",
                      ),
                    },
                  },
                },
                "the-calculator": {
                  type: "dir",
                  children: {
                    "roadmap.txt": {
                      type: "file",
                      content: bi(
                        [
                          "THE CALCULATOR — everyone's first project. mine is the last one.",
                          "",
                          "  [x] add",
                          "  [x] subtract",
                          "  [~] multiply        (philosophical objections)",
                          "  [ ] divide          (refuses to discuss zero)",
                          "  [ ] prove Euler's identity",
                          "  [ ] achieve sentience",
                          "  [ ] stop",
                          "",
                          "eta: when it's unhinged enough.",
                        ].join("\n"),
                        [
                          "A SZÁMOLÓGÉP — mindenki első projektje. az enyém az utolsó.",
                          "",
                          "  [x] összeadás",
                          "  [x] kivonás",
                          "  [~] szorzás         (filozófiai kifogások)",
                          "  [ ] osztás          (nem hajlandó a nulláról beszélni)",
                          "  [ ] az Euler-azonosság bizonyítása",
                          "  [ ] öntudatra ébredés",
                          "  [ ] leállás",
                          "",
                          "határidő: amikor már elég elborult.",
                        ].join("\n"),
                      ),
                    },
                    "progress.log": {
                      type: "file",
                      content: bi("(slowly.)", "(lassan.)"),
                    },
                  },
                },
              },
            },
            "off-the-clock": {
              type: "dir",
              children: {
                "souls.txt": {
                  type: "file",
                  content: bi(
                    [
                      "DARK SOULS · ELDEN RING · HOLLOW KNIGHT",
                      "",
                      "  deaths ......... yes",
                      "  last words ..... \"i can do this\"",
                      "  verdict ........ software that respects you enough to kill you.",
                      "",
                      "        Y O U   D I E D",
                    ].join("\n"),
                    [
                      "DARK SOULS · ELDEN RING · HOLLOW KNIGHT",
                      "",
                      "  halálok ........ igen",
                      "  utolsó szavak .. „ezt megcsinálom”",
                      "  ítélet ......... olyan szoftver, ami annyira tisztel, hogy megöl.",
                      "",
                      "        Y O U   D I E D",
                    ].join("\n"),
                  ),
                },
                "warframe.log": {
                  type: "file",
                  content: bi(
                    "playtime: ~3,000h\nstatus: i understand sunk cost intimately and continue regardless.",
                    "játékidő: ~3000 óra\nstátusz: bensőségesen ismerem a sunk costot, és ettől függetlenül folytatom.",
                  ),
                },
                "crt": {
                  type: "dir",
                  children: {
                    "ps2.cfg": {
                      type: "file",
                      content: bi(
                        "output = composite\ndisplay = CRT (the way the developers intended)\nresolution = native, or nothing.",
                        "kimenet = kompozit\nkijelző = CRT (ahogy a fejlesztők megálmodták)\nfelbontás = natív, vagy semmi.",
                      ),
                    },
                  },
                },
                "dnd": {
                  type: "dir",
                  children: {
                    "character.sheet": {
                      type: "file",
                      content: bi(
                        [
                          "class ...... artificer",
                          "alignment .. chaotic neutral",
                          "race ....... gnome",
                          "weapon ..... a cannon named Gloria",
                          "note ....... after years of DMing, being a player is a vacation.",
                        ].join("\n"),
                        [
                          "kaszt ...... artificer",
                          "beállítottság chaotic neutral",
                          "faj ........ gnóm",
                          "fegyver .... egy Gloria nevű ágyú",
                          "jegyzet .... éveknyi DM-elés után játékosnak lenni maga a nyaralás.",
                        ].join("\n"),
                      ),
                    },
                    "gloria.cannon": {
                      type: "file",
                      art: true,
                      content: bi(
                        "        ______\n   ____/__||__\\_____\n  |    GLORIA       \\\\\n  |__________________\\\\\n   (__)         (__)      run me to fire. (or: gloria)",
                        "        ______\n   ____/__||__\\_____\n  |    GLORIA       \\\\\n  |__________________\\\\\n   (__)         (__)      futtass le a tűzhöz. (vagy: gloria)",
                      ),
                    },
                  },
                },
                "hip-hop": {
                  type: "dir",
                  children: {
                    "rotation.m3u": {
                      type: "file",
                      content: bi(
                        "# both coasts. the old testament.\n# the rotation extends to the shoe rack.\n# (no track names here — that joke lives in one spot only.)",
                        "# mindkét part. az ótestamentum.\n# a rotáció a cipőspolcra is kiterjed.\n# (itt nincs számcím — az a poén egyetlen helyen él.)",
                      ),
                    },
                  },
                },
                "local-ai": {
                  type: "dir",
                  children: {
                    "rtx5090.thermal": {
                      type: "file",
                      content: bi(
                        "role: self-hosted LLMs, image + video gen pipelines.\nclassification: partly a lab, partly a hobby, fully a space heater.",
                        "szerep: saját hosztolt LLM-ek, kép- és videógeneráló pipeline-ok.\nbesorolás: félig labor, félig hobbi, teljes egészében hősugárzó.",
                      ),
                    },
                  },
                },
              },
            },
            site: {
              type: "dir",
              children: {
                "01-intro.md": { type: "file", content: siteSection("01") },
                "02-about.md": { type: "file", content: siteSection("02") },
                "03-experience.md": { type: "file", content: siteSection("03") },
                "04-featured.md": { type: "file", content: siteSection("04") },
                "05-more.md": { type: "file", content: siteSection("05") },
                "06-ai.md": { type: "file", content: siteSection("06") },
                "07-stack.md": { type: "file", content: siteSection("07") },
                "08-off-the-clock.md": { type: "file", content: siteSection("08") },
                "09-now.md": { type: "file", content: siteSection("09") },
                "10-contact.md": { type: "file", content: siteSection("10") },
              },
            },
            ".secrets": {
              type: "dir",
              hidden: true,
              children: {
                "the-truth.txt": {
                  type: "file",
                  content: bi(
                    "the calculator will never be finished. we both know this.",
                    "a számológép sosem lesz kész. ezt mindketten tudjuk.",
                  ),
                },
                "how-its-made.txt": {
                  type: "file",
                  content: bi(
                    "this whole site is JXN-000. recursion as a feature.\nthe noise field, the bonsai, this terminal, the flip — all hand-rolled.\nyou are currently standing inside the portfolio piece.",
                    "ez az egész oldal a JXN-000. rekurzió mint feature.\na zajmező, a bonsai, ez a terminál, a flip — minden kézzel írva.\néppen a portfólió-darab belsejében állsz.",
                  ),
                },
                "press-tilde.txt": {
                  type: "file",
                  content: bi(
                    "you found the secrets folder. there is no prize. that IS the prize.\n(try the konami code on the page. ↑↑↓↓←→←→ b a)",
                    "megtaláltad a titkos mappát. nincs nyeremény. ÉPP ez a nyeremény.\n(próbáld a konami kódot az oldalon. ↑↑↓↓←→←→ b a)",
                  ),
                },
              },
            },
          },
        },
      },
    },
    etc: {
      type: "dir",
      children: {
        motd: {
          type: "file",
          content: bi(
            "── JXN-000 ──────────────────────────────\n welcome to the engine room. mind the grooves.\n no cookies · no trackers · no skill bars\n─────────────────────────────────────────",
            "── JXN-000 ──────────────────────────────\n üdv a gépházban. vigyázz a barázdákra.\n se cookie · se tracker · se skill bar\n─────────────────────────────────────────",
          ),
        },
        hostname: { type: "file", content: "jxn-000" },
        passwd: {
          type: "file",
          content: bi(
            "jxn:x:1000:1000:the developer:/home/jxn:/bin/bash\ncat:x:1001:1001:the cat:/home/cat:/usr/bin/nap\nroot:x:0:0:nobody you've met:/root:/bin/bash",
            "jxn:x:1000:1000:a fejlesztő:/home/jxn:/bin/bash\ncat:x:1001:1001:a macska:/home/cat:/usr/bin/alvas\nroot:x:0:0:nem ismered:/root:/bin/bash",
          ),
        },
      },
    },
    dev: {
      type: "dir",
      children: {
        null: {
          type: "file",
          content: bi("", ""),
        },
        urandom: {
          type: "file",
          content: () =>
            Array.from({ length: 8 }, () =>
              Array.from({ length: 8 }, () =>
                Math.floor(Math.random() * 256).toString(16).padStart(2, "0"),
              ).join(" "),
            ).join("\n"),
        },
      },
    },
    proc: {
      type: "dir",
      children: {
        uptime: { type: "file", content: () => `${fmtUptime()} (since last master)` },
        cpuinfo: {
          type: "file",
          content: bi(
            "processor : 0\nmodel name : 1 developer\ncores : however many coffees\nbogomips : variable",
            "processor : 0\nmodel name : 1 fejlesztő\nmagok : ahány kávé\nbogomips : változó",
          ),
        },
      },
    },
    var: {
      type: "dir",
      children: {
        log: {
          type: "dir",
          children: {
            "deploy.log": {
              type: "file",
              content: bi(
                [
                  "[on-site] new installation. mid-deploy.",
                  "[ERROR  ] the system decided to comprehensively fail.",
                  "[ERROR  ] in front of the client. on a laptop that struggles with a browser.",
                  "[ ...    ] diagnosed and fixed production live, on location.",
                  "[ ...    ] the deployment continued around me.",
                  "[ OK     ] we left with a working system.",
                  "[note    ] nothing teaches you a stack faster than an audience.",
                ].join("\n"),
                [
                  "[helyszín] új telepítés. deploy közben.",
                  "[ERROR   ] a rendszer úgy döntött, hogy átfogóan meghal.",
                  "[ERROR   ] az ügyfél előtt. egy laptopon, ami egy böngészőtől is megizzad.",
                  "[ ...     ] élesben, a helyszínen diagnosztizáltam és javítottam.",
                  "[ ...     ] a telepítés körülöttem zajlott tovább.",
                  "[ OK      ] működő rendszerrel jöttünk el.",
                  "[megj.    ] semmi nem tanít meg gyorsabban egy stacket, mint a közönség.",
                ].join("\n"),
              ),
            },
          },
        },
      },
    },
  },
};

/* — path resolution ————————————————————————————————————————————————————————— */

/** Split an absolute path into clean segments. */
function segs(path: string): string[] {
  return path.split("/").filter((s) => s && s !== ".");
}

/** Resolve `arg` (absolute, relative, ~, .., .) against `cwd` → absolute path. */
export function resolvePath(cwd: string, arg: string | undefined): string {
  if (!arg || arg === "~") return HOME;
  let base: string[];
  if (arg.startsWith("/")) base = [];
  else if (arg.startsWith("~/")) {
    base = segs(HOME);
    arg = arg.slice(2);
  } else if (arg === "~") return HOME;
  else base = segs(cwd);

  const parts = arg.replace(/^~\/?/, "").split("/");
  for (const p of parts) {
    if (p === "" || p === ".") continue;
    if (p === "..") base.pop();
    else base.push(p);
  }
  return "/" + base.join("/");
}

/** Get the node at an absolute path, or null. */
export function nodeAt(path: string): FsNode | null {
  if (path === "/" || path === "") return FS;
  let node: FsNode = FS;
  for (const s of segs(path)) {
    if (node.type !== "dir" || !node.children[s]) return null;
    node = node.children[s];
  }
  return node;
}

/** Format an absolute path for the prompt: ~ for home, else absolute. */
export function promptPath(path: string): string {
  if (path === HOME) return "~";
  if (path.startsWith(HOME + "/")) return "~" + path.slice(HOME.length);
  return path || "/";
}

export function isDir(node: FsNode | null): node is FsDir {
  return !!node && node.type === "dir";
}

/** Resolve a file's content for the current locale. */
export function readFile(file: FsFile, locale: Locale): string {
  return typeof file.content === "function" ? file.content(locale) : file.content;
}
