# JXN-000 — SITE ASSET
## Portfolio of Norbert Oláh · content + design spec · EN/HU

> **TO THE MODEL BUILDING THIS SITE — READ FIRST.**
> This document is the single source of truth for the site's content and design direction.
> Rules of engagement:
> 1. **Do not invent facts.** Every biographical, project, and work claim you need is in this document. If it's not here, it doesn't go on the site.
> 2. **English is canonical.** The Hungarian copy (PART 3) is a faithful localization, not a translation exercise — use it verbatim for the HU locale. Keep EN/HU content parity in structure.
> 3. **`[PLACEHOLDER]` items** stay as visible placeholders or get stubbed behind config — never fabricate emails, links, or dates.
> 4. **Voice:** dry, a little sardonic, confident, zero corporate filler. If a sentence could appear on any developer's portfolio, it's wrong. Lowercase allowed in micro-copy and labels, not in body text.
> 5. **Design spec is PART 1.** Follow it. The "NO" list is non-negotiable.

---

# PART 1 — DESIGN DIRECTION

## 1.1 Core aesthetic: dark techwear × OG hip-hop

Two layers. **Techwear is the garment; hip-hop is the lining.** The hip-hop influence must be *felt, not seen* — structural and typographic, never literal. No boomboxes, no graffiti fonts, no lyrics, no quotes from anyone. If a visitor consciously notices "this is a hip-hop themed site," it's overdone. If a head nods without knowing why — correct.

### Base (techwear layer)
- **Palette:** near-black backgrounds (#0a0a0c – #101014 range, never pure #000). One cold primary accent — pick ONE of: acid green, signal orange, cold cyan. Plus one *secondary* warm metallic gold/champagne used extremely sparingly (link hovers, the catalog numbers, one or two hairline details). That gold is the jewelry on the techwear — a chain glint, not a colorway.
- **Typography:** sharp grotesque for headings (Space Grotesk, Archivo, or similar), monospace for labels/metadata/micro-copy (JetBrains Mono, IBM Plex Mono). The hero line wants to be enormous.
- **Texture:** subtle grid lines, faint dot/scanline texture, fine 1px borders, technical-garment-tag and NATO-stock-label energy in the micro-labels.
- **Motion:** restrained, precise micro-interactions. Optional terminal-style type-in on the hero.

### Lining (hip-hop layer — all of these are SUBTLE)
- **Tracklist structure.** Sections are numbered like a tracklist in monospace: `01 — INTRO`, `02 — ABOUT`, `03 — EXPERIENCE`... Reading time displayed as a track duration: `03:12` instead of "3 min read." No explanation given anywhere; it just is.
- **Catalog numbers.** Every project card carries a vinyl-style catalog number in mono + gold: `JXN-001`, `JXN-002`... (assignments in PART 2). Crate-digger energy.
- **A-side / B-side language toggle.** The EN/HU switch in the header is labeled `SIDE A` / `SIDE B` (EN = A). Tooltip can say EN/HU for clarity. This is the single best joke on the site — do not ruin it by explaining it.
- **Liner-notes footer.** The footer is styled as record credits: small mono type, "produced & engineered by…", recording-location line. Exact copy in PART 2 / PART 3.
- **Waveform dividers.** Section dividers as thin, static waveform-like rules instead of plain `<hr>`. Subtle — a 1px line with slight amplitude, not an audio player.
- **Rhythm in motion.** Stagger animation timings around ~666ms intervals (90 BPM, the boom-bap pocket). Nobody will measure it. You'll know.
- **Sleeve cards.** Project cards get a faint paper-grain texture and 1px border — record sleeve, not glassmorphism.
- **Optional easter egg:** a tiny `now spinning:` line in the footer or /now section (content in PART 2). Coast-agnostic by design — he's east AND west, OG era. Keep any specific artist mention to this one spot.

### NO (non-negotiable)
- No skill bars, percentage circles, or radar charts
- No "passionate about" anywhere, in any language
- No lyric quotes, artist photos, album art, parental-advisory badges, graffiti or stencil fonts, turntable/boombox/microphone iconography
- No purple-gradient AI-startup look, no glassmorphism soup, no stock illustrations, no testimonial section
- No template smell. If it looks like a theme, kill it.

## 1.2 Practical build notes
- **i18n from day one.** EN/HU locales, structure-identical. EN canonical.
- **The photo:** use the provided warm portrait. Slight duotone/desaturation so it sits in the palette without losing the smirk. Warm human on cold site = intended tension.
- **War stories UI:** expandable cards or "field notes" log — mono timestamps, incident-report styling.
- **Performance:** this site is itself a portfolio piece; it should be fast, accessible, and clean under view-source.
- **Hosting note:** lives at `jxn.ddns.net` for now; build nothing that assumes a specific domain.

---

# PART 2 — CONTENT (ENGLISH · SIDE A)

## 01 — INTRO (hero)

**Norbert Oláh**

# I code.

That's the honest version. The longer version: full-stack developer building and maintaining production systems people physically walk through every day — from React frontends down to the Linux boxes they run on. I think in systems, I get things working when everything's on fire, and I will absolutely lose an hour making a button feel right.

`[ view work ↓ ]` `[ github → ]` `[ contact → ]`

*Micro-copy under the fold:* currently keeping access control systems alive across Hungary.

## 02 — ABOUT

I'm Norbert — a full-stack developer in Budapest. By day I work on **EverLink**, an access control and parking platform: hundreds of installed systems across Hungary, the largest serving a few thousand cardholders. I'm one of three developers, and my territory is the client and everything the client touches — the React/TypeScript frontend, the Laravel backend behind it, the realtime layer, and a healthy share of the server firefighting when production decides to have opinions.

I graduated from ELTE's Computer Science BSc in 2024, which means I've been paid to write code for two years and writing it for considerably longer. University put an unreasonable number of languages through my hands — C to Haskell to Agda — and the takeaway wasn't any single language. It was that everything is a system, and systems can be understood.

What actually drives me: making things *work*, and then making them *good*. I'm the person who fixes the production outage and then spends the evening polishing the frontend animation nobody asked for. Both halves matter. One keeps the lights on, the other is why anyone enjoys flipping the switch.

When I'm not at a keyboard I'm— okay, I'm usually still at a keyboard, but a different one. More below.

## 03 — EXPERIENCE

### Developer — EverLink
**2024 → present · Budapest**

EverLink builds access control and parking systems — physical infrastructure with software brains. Card readers, barriers, kiosks, and the platform that orchestrates all of it. Small company, ~10 people, three developers. No safety net, no "someone else's problem." When it's yours, it's *yours*.

My domain is the client side and everything adjacent to it:

- **Frontend:** the React + TypeScript application operators actually use — built up and kept strict (`tsconfig` tightened to industry-standard strictness, because `any` is a confession, not a type).
- **Backend:** the Laravel/PHP services behind that frontend — queues via Horizon, realtime via Reverb websockets, Redis, MariaDB.
- **The unglamorous middle:** build tooling, static analysis, CI, and the server-level debugging that doesn't respect job descriptions.

### Field notes *(expandable cards)*

**FN-01 · The live deploy rescue.**
On-site at a new installation, mid-deployment, the system decided to comprehensively fail — in front of the client, on a work laptop that struggles to run a browser. Diagnosed and fixed production live, on location, while the deployment continued around me. Nothing teaches you a stack faster than debugging it while people watch. We left with a working system.

**FN-02 · The 970-file refactor.**
A large Laravel codebase had outgrown its structure, and moving ~970 PHP files by hand is how you create a thousand subtle bugs. Instead I drove the refactor programmatically through the IDE's scripting API, so every move updated every reference atomically. Big, scary, boring — exactly the kind of change you automate or don't attempt.

**FN-03 · The static analysis grind.**
Took the codebase from "PHPStan level 2, two hundred-plus errors" up through level 5, clean. Not glamorous. Every level is a hundred small arguments with your past self. The codebase argues back less now.

**FN-04 · Infrastructure firefighting.**
Apache MPM misconfigurations, a database that refused to start after reboot because a runtime directory didn't survive it, custom systemd units that needed to actually behave like services. The kind of problems that don't show up in portfolios because there's nothing to screenshot — just a system that stays up now.

## 04 — FEATURED PROJECTS

### JXN-001 · matterlights
**Python · Home Assistant · Matter** — [GitHub →](https://github.com/Jxn01/matterlights)

Screen-to-light sync for Matter bulbs through Home Assistant — the SignalRGB treatment, extended to lights SignalRGB can't reach. Samples the screen in real time, maps zones to bulbs through a local dashboard with a zone designer, and pushes colors out over the local network.

Born of a real itch: the rest of my setup synced to my screen, the ceiling didn't, and that was unacceptable. It's painfully specific, slightly absurd, and works.

Full disclosure, because I'd rather say it than have you guess: this one was built almost entirely through AI-assisted development. I'm not a Python developer — but I architected it, I understand what every component does and why, and I directed every decision. More on what I think that means in track 06.

### JXN-002 · section-cms
**PHP, from scratch** — [GitHub →](https://github.com/Jxn01/section-cms)

A lightweight, modular, SEO-first CMS written in plain PHP. No framework, no build step, no dependency tree that needs its own monitoring.

The origin story is better than the elevator pitch: a colleague (not a developer) needed a website he could maintain *without me*, and he had exactly one piece of hosting available — an existing WordPress server he didn't want to replace with a paid VPS. So the whole thing is engineered to live inside a WordPress host's constraints: plain PHP, drop-in deployable, no special server requirements. Then I ripped out everything specific to him, generalized it, and section-cms was born.

It's also my quiet proof that I know what the frameworks are doing under the hood. Laravel pays my bills; this shows I understand *why*.

`[STATUS: live demo pending — will be self-hosted]`

### JXN-003 · algoritmizator
**Laravel · PHP** — [GitHub →](https://github.com/Jxn01/algoritmizator)

A gamified web platform for learning algorithms and data structures. My BSc thesis — and the project where I learned full-stack web development, because I didn't know it yet when I started. Picked the topic, picked the stack, and let necessity be the curriculum. The codebase shows a developer being assembled in real time, and I've left it that way on purpose.

`[STATUS: live demo pending — will be self-hosted]`

## 05 — MORE PROJECTS

### JXN-004 · minecraft-server-utilities
**Python (formerly zsh)** — [GitHub →](https://github.com/Jxn01/minecraft-server-utilities)
Started life as a single z-shell script babysitting a Minecraft server through `screen` and `say` commands. Grew up into a full Python-based server management suite: crash auto-restarts, scheduled restarts, backups. The most honest ops training there is — players are a ruthless uptime SLA.

### JXN-005 · citybuilder
**Java · university group project** — [GitHub →](https://github.com/Jxn01/citybuilder)
A small SimCity-like built with a team for a software engineering course. Included for completeness and as proof I survived group work.

### JXN-006 · elte-ik-proginf-bsc
**Everything, simultaneously** — [GitHub →](https://github.com/Jxn01/elte-ik-proginf-bsc)
Six semesters of ELTE coursework in one archive: C, C++, Java, Haskell, Erlang, Agda, Python, R, SQL, and more. The receipts for the "seen before" list in track 07.

### In the lab *(currently building strip)*
- **This site.** The portfolio you're looking at is itself a project: designed, built, and self-hosted. Recursion as a feature.
- **The Calculator.** Everyone's first project is a calculator. Mine will be the last one. An intentionally, pathologically over-engineered calculator — the plan is to keep going until it can prove Euler's theorem. No timeline. It's done when it's unhinged enough.

## 06 — AI: HOW I ACTUALLY USE IT

I develop with AI agents daily, and I'd rather talk about it plainly than pretend otherwise.

Here's the position: **AI-assisted development is a skill, and the skill is not prompt-writing — it's architecture.** Context management, knowing what a model can and can't be trusted with, decomposing problems into verifiable pieces, reading the output critically, and understanding the system you're building deeply enough to catch the model being confidently wrong. Anyone can ask for code. Knowing *what to ask for, in what order, with what constraints, and how to verify it* is the actual craft.

In my own stack — Laravel, React, TypeScript — I read and understand every line that ships. The agent accelerates; I architect and verify. Outside my stack, I'll say it straight: matterlights is built almost entirely through agentic development, in a language I don't write fluently. I still designed the system, I know what every component does, and I made every architectural call. What I didn't do is hand-write the Python — and the result is a working product I couldn't have justified the time to build otherwise.

What I *don't* believe in: typing "make no mistakes" into a prompt and expecting bug-free code. The model is a force multiplier on judgment. Multiply zero judgment and you get very fast zero.

The toolchain, for the curious: Claude Code and Cursor as daily drivers, multiple model providers routed by task. At home I run local models on my own hardware — Open WebUI for chat workflows, ComfyUI for image and video generation — because the best way to understand a tool's limits is to host it yourself.

## 07 — STACK

*(Three honest tiers. Intro line below each tier title.)*

### Daily drivers
*The production stack. I ship with these every day and answer for them when they break.*

PHP · Laravel · React · TypeScript · MariaDB · Redis · Laravel Horizon · Reverb (websockets) · Apache · Linux (Debian servers, Arch workstation) · Vite · PHPStan/Larastan · Git + GitLab CI

### Comfortable
*Used in real projects, just not every day.*

Python · Java · Bash/zsh · systemd & general server administration · Home Assistant · SQL beyond the ORM

### Seen before
*Six semesters of ELTE IK put all of this through my hands — receipts in [the archive](https://github.com/Jxn01/elte-ik-proginf-bsc).*

C · C++ · Haskell · Erlang · Agda (type theory) · R · SageMath (cryptography) · Hadoop MapReduce · Spark · PowerShell · socket programming · neural networks · concurrent programming in Java

*Closing line:* "Seen before" means exactly that — I'm not claiming fluency in Agda, I'm claiming I once proved things to a compiler and lived. The point of the list isn't the languages. It's that the next stack is never the problem.

## 08 — OFF THE CLOCK

**Souls games.** Dark Souls, Elden Ring, Hollow Knight. I like software that respects me enough to kill me.

**Warframe.** ~3,000 hours. I understand sunk cost intimately and continue regardless.

**CRT corner.** A PS2 hooked up to a CRT TV, the way the developers intended. Some signals deserve their native resolution.

**D&D.** Currently playing a chaotic-neutral gnome artificer with a cannon named Gloria. After years of DMing, being a player is a vacation where things explode.

**Home automation.** Home Assistant OS runs the house. See JXN-001 for what happens when the lights don't keep up.

**Hip-hop & sneakers.** Both coasts, the old testament. Always on rotation — and the rotation extends to the shoe rack. The frontend obsession does not stop at screens.

**Local AI.** An RTX 5090 earning its keep — self-hosted LLMs, image and video gen pipelines, chat frontends. Partly a lab, partly a hobby, fully a space heater.

## 09 — NOW

*(/now page or homepage strip. Stale "now" pages are worse than none — update monthly.)*

**Currently:**
- Building this site and getting it properly hosted
- Hardening EverLink's frontend tooling and grinding static analysis levels
- Plotting the calculator
- Dying repeatedly in `[CURRENT GAME]`

`now spinning: [CURRENT ALBUM — optional easter egg line]`

*Last updated: [DATE]*

## 10 — CONTACT

**Say hi.**

Found something interesting here? Disagree with my stack tiers? Want to know how the calculator is going? (Slowly.)

- **Email:** `[PLACEHOLDER — email]`
- **GitHub:** [github.com/Jxn01](https://github.com/Jxn01)
- **LinkedIn:** [linkedin.com/in/jxn01](https://www.linkedin.com/in/jxn01)

I'm not actively looking — but interesting problems get answered first.

## FOOTER (liner notes)

```
produced & engineered by Norbert Oláh
recorded in Budapest · mixed with machines · mastered by hand
no cookies · no trackers · no skill bars
JXN-000 · running on jxn.ddns.net until further notice
```

*(Pick 2–3 lines, don't use all four. The catalog number self-reference — the site itself is JXN-000 — is the kind of detail that rewards attention.)*

---

# PART 3 — CONTENT (HUNGARIAN · SIDE B)

> Faithful localization, same structure, same voice. Technical terms stay in English where Hungarian developers naturally use them (full-stack, frontend, deploy, production stb.). Informal register (tegeződés) throughout — it's a personal site, not a bank.

## 01 — INTRO (hero)

**Oláh Norbert**

# Kódolok.

Ez az őszinte verzió. A hosszabb: full-stack fejlesztő vagyok, olyan éles rendszereket építek és tartok életben, amiken emberek nap mint nap fizikailag átsétálnak — a React frontendtől egészen a Linux szerverekig, amiken az egész fut. Rendszerekben gondolkodom, működésre bírom a dolgokat akkor is, amikor minden ég, és gond nélkül elmegy egy órám azzal, hogy egy gombot jó érzés legyen megnyomni.

`[ munkáim ↓ ]` `[ github → ]` `[ kapcsolat → ]`

*Micro-copy:* jelenleg beléptetőrendszereket tartok életben országszerte.

## 02 — RÓLAM

Norbert vagyok, full-stack fejlesztő Budapesten. Napközben az **EverLinken** dolgozom, ami egy beléptető- és parkolórendszer-platform: több száz telepített rendszer országszerte, a legnagyobb néhány ezer kártyás felhasználót szolgál ki. Hárman vagyunk fejlesztők, az én terepem a kliens és minden, ami a klienshez ér — a React/TypeScript frontend, a mögötte ülő Laravel backend, a realtime réteg, és egy egészséges adag szerveroldali tűzoltás, amikor a production úgy dönt, hogy véleménye van.

2024-ben végeztem az ELTE programtervező informatikus BSc szakán — vagyis két éve fizetnek azért, hogy kódot írjak, és jóval régebb óta írom. Az egyetem észszerűtlen mennyiségű nyelvet adott a kezembe — C-től Haskellen át Agdáig —, és a tanulság nem egy konkrét nyelv volt. Hanem az, hogy minden rendszer, és a rendszerek megérthetők.

Ami tényleg hajt: hogy a dolgok *működjenek*, aztán hogy *jók* legyenek. Én vagyok az, aki megjavítja az éles rendszert, aztán este azt a frontend animációt csiszolgatja, amit senki nem kért. Mindkét fél számít: az egyik életben tartja a rendszert, a másik miatt öröm bekapcsolni.

Amikor nem a billentyűzetnél ülök, akkor— jó, általában akkor is a billentyűzetnél ülök, csak egy másiknál. Részletek lejjebb.

## 03 — TAPASZTALAT

### Fejlesztő — EverLink
**2024 → jelenleg · Budapest**

Az EverLink beléptető- és parkolórendszereket épít — fizikai infrastruktúrát, szoftveraggyal. Kártyaolvasók, sorompók, kioszkok, és a platform, ami az egészet vezényli. Kis cég, ~10 ember, három fejlesztő. Nincs védőháló, nincs „majd valaki más". Ami a tiéd, az a *tiéd*.

Az én területem a kliensoldal és minden, ami hozzá kapcsolódik:

- **Frontend:** a React + TypeScript alkalmazás, amit az operátorok ténylegesen használnak — felépítve és szigorúan tartva (a `tsconfig` ipari szabvány szintre húzva, mert az `any` nem típus, hanem beismerő vallomás).
- **Backend:** a frontend mögötti Laravel/PHP szolgáltatások — queue-k Horizonnal, realtime Reverb websocketekkel, Redis, MariaDB.
- **A hálátlan középső réteg:** build tooling, statikus analízis, CI, és az a szerverszintű debugolás, ami nem tiszteli a munkaköri leírásokat.

### Terepjegyzetek *(lenyitható kártyák)*

**FN-01 · Az élesben mentés.**
Helyszíni telepítés egy új ügyfélnél, a deploy kellős közepén a rendszer úgy döntött, hogy átfogóan meghal — az ügyfél szeme láttára, egy olyan munkalaptopon, ami egy böngészőtől is megizzad. Élesben diagnosztizáltam és javítottam a productiont, a helyszínen, miközben körülöttem zajlott tovább a telepítés. Semmi nem tanít meg gyorsabban egy stacket, mint közönség előtt debugolni. Működő rendszerrel jöttünk el.

**FN-02 · A 970 fájlos refaktor.**
Egy nagy Laravel kódbázis kinőtte a struktúráját, és ~970 PHP fájlt kézzel mozgatni a legbiztosabb módja annak, hogy ezer apró bugot gyárts. Ehelyett programozottan vezényeltem le a refaktort az IDE szkriptelő API-ján keresztül, így minden mozgatás atomikusan frissített minden hivatkozást. Nagy, ijesztő, unalmas — pont az a fajta változtatás, amit vagy automatizálsz, vagy bele se kezdesz.

**FN-03 · A statikus analízis darálás.**
A kódbázist a „PHPStan level 2, kétszáz-plusz hiba" állapotból felvittem level 5-re, tisztán. Nem látványos. Minden szint száz apró vita a múltbeli önmagaddal. A kódbázis azóta kevesebbet vitatkozik vissza.

**FN-04 · Infrastruktúra-tűzoltás.**
Apache MPM félrekonfiguráció, adatbázis, ami reboot után nem volt hajlandó elindulni, mert egy futásidejű könyvtár nem élte túl az újraindítást, custom systemd unitok, amiknek tényleg service-ként kellett viselkedniük. Az a fajta probléma, ami azért nem szerepel portfóliókban, mert nincs miről screenshotot lőni — csak egy rendszer, ami azóta talpon marad.

## 04 — KIEMELT PROJEKTEK

### JXN-001 · matterlights
**Python · Home Assistant · Matter** — [GitHub →](https://github.com/Jxn01/matterlights)

Valós idejű képernyő–fény szinkron Matter izzókra, Home Assistanten keresztül — a SignalRGB-élmény kiterjesztve oda, ahová a SignalRGB nem ér el. Valós időben mintavételezi a képernyőt, egy lokális dashboardon és zónatervezőn keresztül rendeli a zónákat az izzókhoz, és a helyi hálózaton tolja ki a színeket.

Valódi viszketésből született: a setupom többi része szinkronban volt a képernyővel, a plafon nem, és ez elfogadhatatlan volt. Fájdalmasan specifikus, enyhén abszurd, és működik.

Teljes őszinteség, mert inkább kimondom, mint hogy találgass: ez a projekt szinte teljes egészében AI-asszisztált fejlesztéssel készült. Nem vagyok Python-fejlesztő — de én terveztem az architektúrát, tudom, mit csinál minden komponens és miért, és minden döntést én hoztam. Hogy szerintem ez mit jelent, arról a 06-os trackben.

### JXN-002 · section-cms
**PHP, nulláról** — [GitHub →](https://github.com/Jxn01/section-cms)

Könnyűsúlyú, moduláris, SEO-first CMS, sima PHP-ban megírva. Se framework, se build lépés, se olyan függőségi fa, amit külön monitorozni kéne.

Az origin story jobb, mint az elevator pitch: egy (nem fejlesztő) kollégának kellett egy weboldal, amit *nélkülem* is karban tud tartani, és pontosan egy darab hostingja volt — egy meglévő WordPress-szerver, amit nem akart fizetős VPS-re cserélni. Szóval az egész úgy lett megtervezve, hogy egy WordPress-host korlátai között éljen: sima PHP, bedobható deploy, nulla speciális szerverigény. Aztán kiszedtem belőle mindent, ami rá volt szabva, általánosítottam, és megszületett a section-cms.

Egyben a csendes bizonyítékom is arra, hogy tudom, mit csinálnak a frameworkök a motorháztető alatt. A Laravel fizeti a számláimat; ez mutatja meg, hogy értem is, *miért*.

`[STÁTUSZ: élő demó hamarosan — saját hosztolás]`

### JXN-003 · algoritmizator
**Laravel · PHP** — [GitHub →](https://github.com/Jxn01/algoritmizator)

Gamifikált webes platform algoritmusok és adatszerkezetek tanulásához. A BSc szakdolgozatom — és az a projekt, amin megtanultam a full-stack webfejlesztést, mert amikor belekezdtem, még nem tudtam. Témát választottam, stacket választottam, a tananyagot pedig a szükség írta. A kódbázison látszik, ahogy egy fejlesztő valós időben összeáll — és ezt szándékosan hagytam így.

`[STÁTUSZ: élő demó hamarosan — saját hosztolás]`

## 05 — TOVÁBBI PROJEKTEK

### JXN-004 · minecraft-server-utilities
**Python (korábban zsh)** — [GitHub →](https://github.com/Jxn01/minecraft-server-utilities)
Egyetlen z-shell scriptként kezdte, ami `screen` és `say` parancsokkal pesztrált egy Minecraft szervert. Aztán felnőtt: teljes Python-alapú szerverkezelő csomag lett belőle — crash utáni auto-restart, ütemezett újraindítások, backupok. A legőszintébb ops-tréning, ami létezik: a játékosok a legkíméletlenebb uptime SLA.

### JXN-005 · citybuilder
**Java · egyetemi csapatprojekt** — [GitHub →](https://github.com/Jxn01/citybuilder)
Egy kis SimCity-szerű játék, csapatban, szoftvertechnológia kurzusra. A teljesség kedvéért van itt, meg bizonyítéknak, hogy túléltem a csapatmunkát.

### JXN-006 · elte-ik-proginf-bsc
**Minden, egyszerre** — [GitHub →](https://github.com/Jxn01/elte-ik-proginf-bsc)
Hat félév ELTE-s munkái egy archívumban: C, C++, Java, Haskell, Erlang, Agda, Python, R, SQL, és még sok más. A 07-es track „láttam már" listájának a bizonylatai.

### A laborban *(éppen készül)*
- **Ez az oldal.** A portfólió, amit nézel, maga is projekt: saját tervezés, saját build, saját hoszt. Rekurzió mint feature.
- **A Számológép.** Mindenki első projektje egy számológép. Az enyém lesz az utolsó. Egy szándékosan, patologikusan túltervezett számológép — a terv az, hogy addig nem állok le, amíg be nem tudja bizonyítani az Euler-tételt. Határidő nincs. Akkor van kész, amikor már elég elborult.

## 06 — AI: AHOGY TÉNYLEG HASZNÁLOM

Naponta fejlesztek AI agentekkel, és inkább beszélek róla nyíltan, mint hogy úgy tegyek, mintha nem így lenne.

Az álláspontom: **az AI-asszisztált fejlesztés egy skill, és ez a skill nem a prompt-írás — hanem az architektúra.** Kontextuskezelés, annak ismerete, hogy mit lehet és mit nem lehet rábízni egy modellre, a problémák ellenőrizhető darabokra bontása, az output kritikus olvasása, és a rendszer olyan mély értése, hogy észrevedd, amikor a modell magabiztosan téved. Kódot kérni bárki tud. Azt tudni, hogy *mit kérj, milyen sorrendben, milyen megkötésekkel, és hogyan ellenőrizd* — az a tényleges mesterség.

A saját stackemben — Laravel, React, TypeScript — minden sort elolvasok és értek, ami kikerül. Az agent gyorsít; én tervezek és ellenőrzök. A stackемen kívül kimondom egyenesen: a matterlights szinte teljes egészében agentic fejlesztéssel készült, egy olyan nyelven, amit nem írok folyékonyan. A rendszert akkor is én terveztem, tudom, mit csinál minden komponens, és minden architekturális döntést én hoztam. Amit nem csináltam: kézzel megírni a Pythont — az eredmény pedig egy működő termék, amire enélkül nem tudtam volna időt igazolni.

Amiben *nem* hiszek: beírni a promptba, hogy „ne hibázz", és bugmentes kódot várni tőle. A modell a ítélőképesség erősítője. Szorozz meg nulla ítélőképességet, és nagyon gyors nullát kapsz.

A toolchain a kíváncsiaknak: Claude Code és Cursor napi szinten, több modellszolgáltató, feladat szerint routolva. Otthon saját vason futtatok lokális modelleket — Open WebUI chat-workflow-khoz, ComfyUI kép- és videógeneráláshoz —, mert egy eszköz korlátait úgy lehet a legjobban megérteni, ha magad hosztolod.

## 07 — STACK

### Napi szinten
*A production stack. Ezekkel szállítok minden nap, és én felelek értük, ha eltörnek.*

PHP · Laravel · React · TypeScript · MariaDB · Redis · Laravel Horizon · Reverb (websockets) · Apache · Linux (Debian szerverek, Arch munkaállomás) · Vite · PHPStan/Larastan · Git + GitLab CI

### Magabiztosan
*Valódi projektekben használva, csak nem minden nap.*

Python · Java · Bash/zsh · systemd és általános szerveradminisztráció · Home Assistant · SQL az ORM-en túl

### Láttam már
*Hat félév ELTE IK mindezt átadta a kezemen — bizonylatok [az archívumban](https://github.com/Jxn01/elte-ik-proginf-bsc).*

C · C++ · Haskell · Erlang · Agda (típuselmélet) · R · SageMath (kriptográfia) · Hadoop MapReduce · Spark · PowerShell · socket programozás · neurális hálók · konkurens programozás Javában

*Záró sor:* A „láttam már" pontosan azt jelenti — nem állítom, hogy folyékonyan beszélek Agdául, azt állítom, hogy egyszer tételeket bizonyítottam egy fordítónak, és túléltem. A lista lényege nem a nyelvek. Hanem az, hogy a következő stack sosem akadály.

## 08 — MUNKAIDŐN KÍVÜL

**Souls játékok.** Dark Souls, Elden Ring, Hollow Knight. Szeretem az olyan szoftvert, ami annyira tisztel, hogy megöl.

**Warframe.** ~3000 óra. Bensőségesen ismerem a sunk cost fogalmát, és ettől függetlenül folytatom.

**CRT-sarok.** Egy PS2, CRT tévére kötve, ahogy a fejlesztők megálmodták. Vannak jelek, amik megérdemlik a natív felbontásukat.

**D&D.** Jelenleg egy kaotikus-semleges gnóm artificert játszom, akinek Gloria nevű ágyúja van. Évekig tartó DM-kedés után játékosnak lenni olyan, mint a nyaralás, csak robbanásokkal.

**Okosotthon.** Home Assistant OS viszi a házat. Lásd JXN-001 arra az esetre, amikor a lámpák nem tartják a tempót.

**Hip-hop és sneakerek.** Mindkét part, az ótestamentum. Mindig megy valami — és a rotáció kiterjed a cipőspolcra is. A frontend-mánia nem áll meg a képernyőknél.

**Lokális AI.** Egy RTX 5090, ami megdolgozik a helyéért — saját hosztolt LLM-ek, kép- és videógeneráló pipeline-ok, chat frontendek. Részben labor, részben hobbi, teljes egészében hősugárzó.

## 09 — MOST

**Éppen:**
- Építem ezt az oldalt, és rendes hosztot szerzek neki
- Az EverLink frontend toolingját keményítem és statikus analízis szinteket darálok
- Tervezem a számológépet
- Ismételten meghalok ebben: `[AKTUÁLIS JÁTÉK]`

`most pörög: [AKTUÁLIS ALBUM — opcionális easter egg]`

*Utolsó frissítés: [DÁTUM]*

## 10 — KAPCSOLAT

**Írj rám.**

Találtál itt valami érdekeset? Nem értesz egyet a stack-tierjeimmel? Tudni akarod, hogy halad a számológép? (Lassan.)

- **Email:** `[PLACEHOLDER — email]`
- **GitHub:** [github.com/Jxn01](https://github.com/Jxn01)
- **LinkedIn:** [linkedin.com/in/jxn01](https://www.linkedin.com/in/jxn01)

Nem keresek aktívan — de az érdekes problémák kapnak választ először.

## LÁBLÉC (liner notes)

```
készítette és hangmérnökölte: Oláh Norbert
felvétel: Budapest · keverés: gépekkel · master: kézzel
se cookie · se tracker · se skill bar
JXN-000 · jelenleg a jxn.ddns.net címen fut
```

---

# PART 4 — OPEN ITEMS (for Norbert, not the model)

1. Fill `[PLACEHOLDER]` contacts, `[CURRENT GAME]`, `[CURRENT ALBUM]`, `[DATE]`.
2. One-time check with EverLink that naming the company + problem-level war stories is fine.
3. Decide hosting for the section-cms and algoritmizator live demos; update STATUS lines in both languages.
4. Pick which liner-notes lines survive (2–3 max).
5. Fix the GitHub bio. Suggested: "Full-stack developer · Laravel / React / TS · keeping access control systems alive across Hungary".
6. Pick the ONE cold accent color before letting the model build — don't let it choose purple.
