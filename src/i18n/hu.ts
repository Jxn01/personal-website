import type { Dict } from "./types";

/**
 * SIDE B — Hungarian.
 * Copy is verbatim from docs/jxn-000-site-asset.md, PART 3 (faithful
 * localization, informal register). Do not re-translate.
 */
export const hu: Dict = {
  meta: {
    htmlLang: "hu",
    side: "B",
    title: "Oláh Norbert — Kódolok. · JXN-000",
    description:
      "Full-stack fejlesztő Budapesten. Olyan éles rendszereket építek és tartok életben, amiken emberek nap mint nap fizikailag átsétálnak — a React frontendtől a Linux szerverekig.",
  },
  ui: {
    skipToContent: "ugrás a tartalomra",
    sideTooltip: "EN / HU",
    statusLink: "status",
    portraitLabel: "fig.01 · oláh norbert · budapest · duotone",
    trackLabel: "track",
  },
  hero: {
    name: "Oláh Norbert",
    headline: "Kódolok.",
    body: "Ez az őszinte verzió. A hosszabb: full-stack fejlesztő vagyok, olyan éles rendszereket építek és tartok életben, amiken emberek nap mint nap fizikailag átsétálnak — a React frontendtől egészen a Linux szerverekig, amiken az egész fut. Rendszerekben gondolkodom, működésre bírom a dolgokat akkor is, amikor minden ég, és gond nélkül elmegy egy órám azzal, hogy egy gombot jó érzés legyen megnyomni.",
    ctas: { work: "munkáim ↓", github: "github →", contact: "kapcsolat →" },
    micro: "jelenleg beléptetőrendszereket tartok életben országszerte.",
  },
  about: {
    title: "RÓLAM",
    paras: [
      "Norbert vagyok, full-stack fejlesztő Budapesten. Napközben az <strong>EverLinken</strong> dolgozom, ami egy beléptető- és parkolórendszer-platform: több száz telepített rendszer országszerte, a legnagyobb néhány ezer kártyás felhasználót szolgál ki. Hárman vagyunk fejlesztők, az én terepem a kliens és minden, ami a klienshez ér — a React/TypeScript frontend, a mögötte ülő Laravel backend, a realtime réteg, és egy egészséges adag szerveroldali tűzoltás, amikor a production úgy dönt, hogy véleménye van.",
      "2024-ben végeztem az ELTE programtervező informatikus BSc szakán — vagyis két éve fizetnek azért, hogy kódot írjak, és jóval régebb óta írom. Az egyetem észszerűtlen mennyiségű nyelvet adott a kezembe — C-től Haskellen át Agdáig —, és a tanulság nem egy konkrét nyelv volt. Hanem az, hogy minden rendszer, és a rendszerek megérthetők.",
      "Ami tényleg hajt: hogy a dolgok <em>működjenek</em>, aztán hogy <em>jók</em> legyenek. Én vagyok az, aki megjavítja az éles rendszert, aztán este azt a frontend animációt csiszolgatja, amit senki nem kért. Mindkét fél számít: az egyik életben tartja a rendszert, a másik miatt öröm bekapcsolni.",
      "Amikor nem a billentyűzetnél ülök, akkor— jó, általában akkor is a billentyűzetnél ülök, csak egy másiknál. Részletek lejjebb.",
    ],
  },
  experience: {
    title: "TAPASZTALAT",
    role: "Fejlesztő",
    org: "EverLink",
    dates: "2024 → jelenleg · Budapest",
    intro:
      "Az EverLink beléptető- és parkolórendszereket épít — fizikai infrastruktúrát, szoftveraggyal. Kártyaolvasók, sorompók, kioszkok, és a platform, ami az egészet vezényli. Kis cég, ~10 ember, három fejlesztő. Nincs védőháló, nincs „majd valaki más”. Ami a tiéd, az a <em>tiéd</em>.",
    domainsLead: "Az én területem a kliensoldal és minden, ami hozzá kapcsolódik:",
    domains: [
      {
        label: "Frontend",
        body: "a React + TypeScript alkalmazás, amit az operátorok ténylegesen használnak — felépítve és szigorúan tartva (a <code>tsconfig</code> ipari szabvány szintre húzva, mert az <code>any</code> nem típus, hanem beismerő vallomás).",
      },
      {
        label: "Backend",
        body: "a frontend mögötti Laravel/PHP szolgáltatások — queue-k Horizonnal, realtime Reverb websocketekkel, Redis, MariaDB.",
      },
      {
        label: "A hálátlan középső réteg",
        body: "build tooling, statikus analízis, CI, és az a szerverszintű debugolás, ami nem tiszteli a munkaköri leírásokat.",
      },
    ],
    fieldNotesTitle: "Terepjegyzetek",
    fieldNotes: [
      {
        id: "FN-01",
        title: "Az élesben mentés.",
        body: "Helyszíni telepítés egy új ügyfélnél, a deploy kellős közepén a rendszer úgy döntött, hogy átfogóan meghal — az ügyfél szeme láttára, egy olyan munkalaptopon, ami egy böngészőtől is megizzad. Élesben diagnosztizáltam és javítottam a productiont, a helyszínen, miközben körülöttem zajlott tovább a telepítés. Semmi nem tanít meg gyorsabban egy stacket, mint közönség előtt debugolni. Működő rendszerrel jöttünk el.",
      },
      {
        id: "FN-02",
        title: "A 970 fájlos refaktor.",
        body: "Egy nagy Laravel kódbázis kinőtte a struktúráját, és ~970 PHP fájlt kézzel mozgatni a legbiztosabb módja annak, hogy ezer apró bugot gyárts. Ehelyett programozottan vezényeltem le a refaktort az IDE szkriptelő API-ján keresztül, így minden mozgatás atomikusan frissített minden hivatkozást. Nagy, ijesztő, unalmas — pont az a fajta változtatás, amit vagy automatizálsz, vagy bele se kezdesz.",
      },
      {
        id: "FN-03",
        title: "A statikus analízis darálás.",
        body: "A kódbázist a „PHPStan level 2, kétszáz-plusz hiba” állapotból felvittem level 5-re, tisztán. Nem látványos. Minden szint száz apró vita a múltbeli önmagaddal. A kódbázis azóta kevesebbet vitatkozik vissza.",
      },
      {
        id: "FN-04",
        title: "Infrastruktúra-tűzoltás.",
        body: "Apache MPM félrekonfiguráció, adatbázis, ami reboot után nem volt hajlandó elindulni, mert egy futásidejű könyvtár nem élte túl az újraindítást, custom systemd unitok, amiknek tényleg service-ként kellett viselkedniük. Az a fajta probléma, ami azért nem szerepel portfóliókban, mert nincs miről screenshotot lőni — csak egy rendszer, ami azóta talpon marad.",
      },
    ],
  },
  featured: {
    title: "KIEMELT PROJEKTEK",
    projects: [
      {
        catalog: "JXN-001",
        name: "matterlights",
        stack: "Python · Home Assistant · Matter",
        github: "https://github.com/Jxn01/matterlights",
        paras: [
          "Valós idejű képernyő–fény szinkron Matter izzókra, Home Assistanten keresztül — a SignalRGB-élmény kiterjesztve oda, ahová a SignalRGB nem ér el. Valós időben mintavételezi a képernyőt, egy lokális dashboardon és zónatervezőn keresztül rendeli a zónákat az izzókhoz, és a helyi hálózaton tolja ki a színeket.",
          "Valódi viszketésből született: a setupom többi része szinkronban volt a képernyővel, a plafon nem, és ez elfogadhatatlan volt. Fájdalmasan specifikus, enyhén abszurd, és működik.",
          "Teljes őszinteség, mert inkább kimondom, mint hogy találgass: ez a projekt szinte teljes egészében AI-asszisztált fejlesztéssel készült. Nem vagyok Python-fejlesztő — de én terveztem az architektúrát, tudom, mit csinál minden komponens és miért, és minden döntést én hoztam. Hogy szerintem ez mit jelent, arról a 06-os trackben.",
        ],
      },
      {
        catalog: "JXN-002",
        name: "section-cms",
        stack: "PHP, nulláról",
        github: "https://github.com/Jxn01/section-cms",
        paras: [
          "Könnyűsúlyú, moduláris, SEO-first CMS, sima PHP-ban megírva. Se framework, se build lépés, se olyan függőségi fa, amit külön monitorozni kéne.",
          "Az origin story jobb, mint az elevator pitch: egy (nem fejlesztő) kollégának kellett egy weboldal, amit <em>nélkülem</em> is karban tud tartani, és pontosan egy darab hostingja volt — egy meglévő WordPress-szerver, amit nem akart fizetős VPS-re cserélni. Szóval az egész úgy lett megtervezve, hogy egy WordPress-host korlátai között éljen: sima PHP, bedobható deploy, nulla speciális szerverigény. Aztán kiszedtem belőle mindent, ami rá volt szabva, általánosítottam, és megszületett a section-cms.",
          "Egyben a csendes bizonyítékom is arra, hogy tudom, mit csinálnak a frameworkök a motorháztető alatt. A Laravel fizeti a számláimat; ez mutatja meg, hogy értem is, <em>miért</em>.",
        ],
        status: "[STÁTUSZ: élő demó hamarosan — saját hosztolás]",
      },
      {
        catalog: "JXN-003",
        name: "algoritmizator",
        stack: "Laravel · PHP",
        github: "https://github.com/Jxn01/algoritmizator",
        paras: [
          "Gamifikált webes platform algoritmusok és adatszerkezetek tanulásához. A BSc szakdolgozatom — és az a projekt, amin megtanultam a full-stack webfejlesztést, mert amikor belekezdtem, még nem tudtam. Témát választottam, stacket választottam, a tananyagot pedig a szükség írta. A kódbázison látszik, ahogy egy fejlesztő valós időben összeáll — és ezt szándékosan hagytam így.",
        ],
        status: "[STÁTUSZ: élő demó hamarosan — saját hosztolás]",
      },
    ],
  },
  more: {
    title: "TOVÁBBI PROJEKTEK",
    projects: [
      {
        catalog: "JXN-004",
        name: "minecraft-server-utilities",
        stack: "Python (korábban zsh)",
        github: "https://github.com/Jxn01/minecraft-server-utilities",
        body: "Egyetlen z-shell scriptként kezdte, ami <code>screen</code> és <code>say</code> parancsokkal pesztrált egy Minecraft szervert. Aztán felnőtt: teljes Python-alapú szerverkezelő csomag lett belőle — crash utáni auto-restart, ütemezett újraindítások, backupok. A legőszintébb ops-tréning, ami létezik: a játékosok a legkíméletlenebb uptime SLA.",
      },
      {
        catalog: "JXN-005",
        name: "citybuilder",
        stack: "Java · egyetemi csapatprojekt",
        github: "https://github.com/Jxn01/citybuilder",
        body: "Egy kis SimCity-szerű játék, csapatban, szoftvertechnológia kurzusra. A teljesség kedvéért van itt, meg bizonyítéknak, hogy túléltem a csapatmunkát.",
      },
      {
        catalog: "JXN-006",
        name: "elte-ik-proginf-bsc",
        stack: "Minden, egyszerre",
        github: "https://github.com/Jxn01/elte-ik-proginf-bsc",
        body: "Hat félév ELTE-s munkái egy archívumban: C, C++, Java, Haskell, Erlang, Agda, Python, R, SQL, és még sok más. A 07-es track „láttam már” listájának a bizonylatai.",
      },
    ],
    labTitle: "A laborban",
    lab: [
      {
        name: "Ez az oldal.",
        body: "A portfólió, amit nézel, maga is projekt: saját tervezés, saját build, saját hoszt. Rekurzió mint feature.",
      },
      {
        name: "A Számológép.",
        body: "Mindenki első projektje egy számológép. Az enyém lesz az utolsó. Egy szándékosan, patologikusan túltervezett számológép — a terv az, hogy addig nem állok le, amíg be nem tudja bizonyítani az Euler-tételt. Határidő nincs. Akkor van kész, amikor már elég elborult.",
      },
    ],
  },
  ai: {
    title: "AI: AHOGY TÉNYLEG HASZNÁLOM",
    paras: [
      "Naponta fejlesztek AI agentekkel, és inkább beszélek róla nyíltan, mint hogy úgy tegyek, mintha nem így lenne.",
      "Az álláspontom: <strong>az AI-asszisztált fejlesztés egy skill, és ez a skill nem a prompt-írás — hanem az architektúra.</strong> Kontextuskezelés, annak ismerete, hogy mit lehet és mit nem lehet rábízni egy modellre, a problémák ellenőrizhető darabokra bontása, az output kritikus olvasása, és a rendszer olyan mély értése, hogy észrevedd, amikor a modell magabiztosan téved. Kódot kérni bárki tud. Azt tudni, hogy <em>mit kérj, milyen sorrendben, milyen megkötésekkel, és hogyan ellenőrizd</em> — az a tényleges mesterség.",
      "A saját stackemben — Laravel, React, TypeScript — minden sort elolvasok és értek, ami kikerül. Az agent gyorsít; én tervezek és ellenőrzök. A stackemen kívül kimondom egyenesen: a matterlights szinte teljes egészében agentic fejlesztéssel készült, egy olyan nyelven, amit nem írok folyékonyan. A rendszert akkor is én terveztem, tudom, mit csinál minden komponens, és minden architekturális döntést én hoztam. Amit nem csináltam: kézzel megírni a Pythont — az eredmény pedig egy működő termék, amire enélkül nem tudtam volna időt igazolni.",
      "Amiben <em>nem</em> hiszek: beírni a promptba, hogy „ne hibázz”, és bugmentes kódot várni tőle. A modell az ítélőképesség erősítője. Szorozz meg nulla ítélőképességet, és nagyon gyors nullát kapsz.",
      "A toolchain a kíváncsiaknak: Claude Code és Cursor napi szinten, több modellszolgáltató, feladat szerint routolva. Otthon saját vason futtatok lokális modelleket — Open WebUI chat-workflow-khoz, ComfyUI kép- és videógeneráláshoz —, mert egy eszköz korlátait úgy lehet a legjobban megérteni, ha magad hosztolod.",
    ],
  },
  stack: {
    title: "STACK",
    tiers: [
      {
        name: "Napi szinten",
        intro: "A production stack. Ezekkel szállítok minden nap, és én felelek értük, ha eltörnek.",
        items: [
          "PHP",
          "Laravel",
          "React",
          "TypeScript",
          "MariaDB",
          "Redis",
          "Laravel Horizon",
          "Reverb (websockets)",
          "Apache",
          "Linux (Debian szerverek, Arch munkaállomás)",
          "Vite",
          "PHPStan/Larastan",
          "Git + GitLab CI",
        ],
      },
      {
        name: "Magabiztosan",
        intro: "Valódi projektekben használva, csak nem minden nap.",
        items: [
          "Python",
          "Java",
          "Bash/zsh",
          "systemd és általános szerveradminisztráció",
          "Home Assistant",
          "SQL az ORM-en túl",
        ],
      },
      {
        name: "Láttam már",
        intro:
          'Hat félév ELTE IK mindezt átadta a kezemen — bizonylatok <a href="https://github.com/Jxn01/elte-ik-proginf-bsc">az archívumban</a>.',
        items: [
          "C",
          "C++",
          "Haskell",
          "Erlang",
          "Agda (típuselmélet)",
          "R",
          "SageMath (kriptográfia)",
          "Hadoop MapReduce",
          "Spark",
          "PowerShell",
          "socket programozás",
          "neurális hálók",
          "konkurens programozás Javában",
        ],
      },
    ],
    closing:
      "A „láttam már” pontosan azt jelenti — nem állítom, hogy folyékonyan beszélek Agdául, azt állítom, hogy egyszer tételeket bizonyítottam egy fordítónak, és túléltem. A lista lényege nem a nyelvek. Hanem az, hogy a következő stack sosem akadály.",
  },
  offclock: {
    title: "MUNKAIDŐN KÍVÜL",
    items: [
      {
        label: "Souls játékok",
        body: "Dark Souls, Elden Ring, Hollow Knight. Szeretem az olyan szoftvert, ami annyira tisztel, hogy megöl.",
      },
      {
        label: "Warframe",
        body: "~3000 óra. Bensőségesen ismerem a sunk cost fogalmát, és ettől függetlenül folytatom.",
      },
      {
        label: "CRT-sarok",
        body: "Egy PS2, CRT tévére kötve, ahogy a fejlesztők megálmodták. Vannak jelek, amik megérdemlik a natív felbontásukat.",
      },
      {
        label: "D&D",
        body: "Jelenleg egy kaotikus-semleges gnóm artificert játszom, akinek Gloria nevű ágyúja van. Évekig tartó DM-kedés után játékosnak lenni olyan, mint a nyaralás, csak robbanásokkal.",
      },
      {
        label: "Okosotthon",
        body: "Home Assistant OS viszi a házat. Lásd JXN-001 arra az esetre, amikor a lámpák nem tartják a tempót.",
      },
      {
        label: "Hip-hop és sneakerek",
        body: "Mindkét part, az ótestamentum. Mindig megy valami — és a rotáció kiterjed a cipőspolcra is. A frontend-mánia nem áll meg a képernyőknél.",
      },
      {
        label: "Lokális AI",
        body: "Egy RTX 5090, ami megdolgozik a helyéért — saját hosztolt LLM-ek, kép- és videógeneráló pipeline-ok, chat frontendek. Részben labor, részben hobbi, teljes egészében hősugárzó.",
      },
    ],
  },
  now: {
    title: "MOST",
    lead: "Éppen:",
    items: [
      "Építem ezt az oldalt, és rendes hosztot szerzek neki",
      "Az EverLink frontend toolingját keményítem és statikus analízis szinteket darálok",
      "Tervezem a számológépet",
      "Ismételten meghalok ebben: %GAME%",
    ],
    spinningLabel: "most pörög:",
    lastUpdatedLabel: "Utolsó frissítés:",
  },
  contact: {
    title: "KAPCSOLAT",
    lead: "Írj rám.",
    body: "Találtál itt valami érdekeset? Nem értesz egyet a stack-tierjeimmel? Tudni akarod, hogy halad a számológép? (Lassan.)",
    emailLabel: "Email",
    emailPlaceholder: "[PLACEHOLDER — email]",
    closing: "Nem keresek aktívan — de az érdekes problémák kapnak választ először.",
  },
  footer: {
    lines: [
      "készítette és hangmérnökölte: Oláh Norbert",
      "felvétel: Budapest · keverés: gépekkel · master: kézzel",
      "se cookie · se tracker · se skill bar",
    ],
  },
  tracks: {
    titles: [
      "INTRO",
      "RÓLAM",
      "TAPASZTALAT",
      "KIEMELT PROJEKTEK",
      "TOVÁBBI PROJEKTEK",
      "AI: AHOGY TÉNYLEG HASZNÁLOM",
      "STACK",
      "MUNKAIDŐN KÍVÜL",
      "MOST",
      "KAPCSOLAT",
    ],
  },
};
