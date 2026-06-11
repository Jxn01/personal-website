import type { Dict } from "./types";

/**
 * SIDE B — Hungarian.
 * Not a mirror translation: a re-localization. Same facts, same structure,
 * same dry register — written the way a Budapest developer actually talks.
 * Field jargon stays English (lightweight, deploy, production, stb.).
 */
export const hu: Dict = {
  meta: {
    htmlLang: "hu",
    side: "B",
    title: "Oláh Norbert — Kódolok. · JXN-000",
    description:
      "Full-stack fejlesztő Budapesten. Éles rendszerek a React frontendtől a Linux szerverekig — olyanok, amiken emberek nap mint nap átsétálnak.",
  },
  ui: {
    skipToContent: "ugrás a tartalomra",
    sideTooltip: "EN / HU",
    statusLink: "status",
    portraitLabel: "fig.01 · oláh norbert · budapest · duotone",
    trackLabel: "track",
    rollD20: "d20 dobás",
  },
  hero: {
    name: "Oláh Norbert",
    headline: "Kódolok.",
    body: "Ez a rövid verzió. A hosszabb: full-stack fejlesztő vagyok, olyan éles rendszereket építek és üzemeltetek, amiken emberek nap mint nap szó szerint átsétálnak — a React frontendtől a Linux szerverekig minden hozzám tartozik. Rendszerekben gondolkodom, akkor is működésre bírom a dolgokat, amikor épp minden ég, és simán elmegy egy órám arra, hogy egy gombot jó érzés legyen megnyomni.",
    ctas: { work: "munkáim ↓", github: "github →", contact: "kapcsolat →" },
    micro: "épp beléptetőrendszereket tartok életben országszerte.",
  },
  about: {
    title: "RÓLAM",
    paras: [
      "Norbert vagyok, full-stack fejlesztő Budapesten. Napközben az <strong>EverLinken</strong> dolgozom — ez egy beléptető- és parkolórendszer-platform, több száz telepítéssel országszerte; a legnagyobb rendszer több ezer kártyás felhasználót szolgál ki. Az én terepem a kliens és minden, ami hozzá ér: a React/TypeScript frontend, a mögötte futó Laravel backend, a realtime réteg — és jut bőven a szerveroldali tűzoltásból is, amikor a production úgy dönt, hogy ma véleménye van.",
      "2024-ben végeztem az ELTE programtervező informatikus szakán — vagyis két éve fizetnek azért, amit jóval régebb óta csinálok. Az egyetem irgalmatlan mennyiségű nyelvet nyomott a kezembe C-től Haskellen át Agdáig, de a tanulság nem egy konkrét nyelv volt. Hanem az, hogy minden rendszer — és minden rendszer megérthető.",
      "Ami igazán hajt: előbb <em>működjön</em>, aztán legyen <em>jó</em> is. Én vagyok az, aki megjavítja az éles hibát, este meg azt az animációt csiszolgatja a frontenden, amit senki nem kért. A kettő együtt ér valamit: az egyik életben tartja a rendszert, a másik miatt élmény használni.",
      "Amikor nem a billentyűzetnél ülök… na jó, olyankor is általában a billentyűzetnél ülök, csak épp egy másiknál. Lentebb kiderül.",
    ],
  },
  experience: {
    title: "TAPASZTALAT",
    role: "Fejlesztő",
    org: "EverLink",
    dates: "2024 → jelenleg · Budapest",
    intro:
      "Az EverLink beléptető- és parkolórendszereket épít — fizikai infrastruktúrát, szoftveres aggyal. Kártyaolvasók, sorompók, kioszkok, és a platform, ami az egészet összefogja. Kis cég: védőháló nincs, „majd valaki más” sincs. Ami a tiéd, azért te felelsz.",
    domainsLead: "Az én pályám a kliensoldal és minden, ami hozzá tartozik:",
    domains: [
      {
        label: "Frontend",
        body: "a React + TypeScript felület, amit az operátorok nap mint nap nyomkodnak — én húztam fel, és én tartom rendben (a <code>tsconfig</code> ipari szigorúságra állítva, mert az <code>any</code> nem típus, hanem beismerő vallomás).",
      },
      {
        label: "Backend",
        body: "a frontend mögötti Laravel/PHP szolgáltatások — Horizon queue-k, Reverb websocket, Redis, MariaDB.",
      },
      {
        label: "A hálátlan középső réteg",
        body: "build tooling, statikus analízis, CI, meg az a fajta szerver-debugolás, ami nem nézi a munkaköri leírást.",
      },
    ],
    fieldNotesTitle: "Terepjegyzetek",
    fieldNotes: [
      {
        id: "FN-01",
        title: "Mentés, élesben.",
        body: "Helyszíni telepítés egy új ügyfélnél; a deploy közepén a rendszer látványosan összeomlott — az ügyfél szeme láttára, egy olyan céges laptopon, ami már egy böngészőtől is megizzad. Ott helyben, élesben derítettem fel és javítottam a hibát, miközben körülöttem zajlott tovább a telepítés. Semmiből nem tanulsz gyorsabban stacket, mint közönség előtt debugolva. Működő rendszerrel jöttünk el.",
      },
      {
        id: "FN-02",
        title: "A 970 fájlos refaktor.",
        body: "Egy nagy Laravel kódbázis kinőtte a saját struktúráját — és ~970 PHP fájlt kézzel átpakolni a legbiztosabb recept ezer apró bugra. Inkább az IDE szkriptelhető refaktor-API-jával vezényeltem le az egészet, így minden áthelyezés atomian frissített minden hivatkozást. Nagy, ijesztő és unalmas — pont az a fajta meló, amit vagy automatizálsz, vagy bele se kezdesz.",
      },
      {
        id: "FN-03",
        title: "A statikus analízis darálás.",
        body: "A kódbázis a „PHPStan level 2, kétszáz-valahány hiba” szintről indult; ma level 8, tisztán. Nem látványos munka. Minden szint száz apró vita a fél évvel ezelőtti önmagaddal. A kódbázis azóta ritkábban szól vissza.",
      },
      {
        id: "FN-04",
        title: "Infrastruktúra-tűzoltás.",
        body: "Félrekonfigurált Apache MPM; adatbázis, ami reboot után azért nem indult el, mert egy runtime könyvtár nem élte túl az újraindítást; custom systemd unitok, amiknek tényleg service-ként illett volna viselkedniük. Az a fajta probléma, amiből sosem lesz portfólió-screenshot — csak egy rendszer, ami azóta állva marad.",
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
          "Valós idejű képernyő–fény szinkron Matter-izzókra, Home Assistanten keresztül — a SignalRGB-élmény kiterjesztve oda, ahová a SignalRGB nem ér el. Élőben mintavételezi a képernyőt, egy helyi dashboardon zónákat rendelsz az izzókhoz, a színek pedig a helyi hálózaton mennek ki a lámpákig.",
          "Abból született, hogy a setupom többi része együtt világított a képernyővel, a plafon viszont nem — és ezt nem bírtam annyiban hagyni. Fájdalmasan specifikus, kicsit abszurd, és működik.",
          "És hogy őszinte legyek — mert inkább elmondom, mint hogy találgatnod kelljen: ez a projekt szinte végig AI-asszisztált fejlesztéssel készült. Nem vagyok Python-fejlesztő, de az architektúra az enyém, pontosan tudom, melyik komponens mit csinál és miért, és minden döntést én hoztam. Hogy ez szerintem mit jelent, arról a 06-os track szól.",
        ],
      },
      {
        catalog: "JXN-002",
        name: "section-cms",
        stack: "PHP, nulláról",
        github: "https://github.com/Jxn01/section-cms",
        paras: [
          "Lightweight, moduláris, SEO-first CMS, vanilla PHP-ban. Se framework, se build step, se akkora dependency-fa, amit külön monitorozni kéne.",
          "Az origin story jobb, mint az elevator pitch: egy (nem fejlesztő) kollégának kellett egy weboldal, amit <em>nélkülem</em> is karban tud tartani — és pontosan egy darab hostingja volt: egy meglévő WordPress-szerver, amit nem akart fizetős VPS-re cserélni. Úgyhogy az egész úgy készült, hogy egy WordPress-host keretei közt is elférjen: vanilla PHP, bemásolod és megy, nulla extra szerverigény.",
          "Egyben a csendes bizonyíték is, hogy értem, mit csinálnak a frameworkök a motorháztető alatt. A Laravel fizeti a számlákat; ez mutatja meg, hogy azt is tudom, <em>miért</em>.",
        ],
        status: "[STÁTUSZ: élő demó hamarosan — saját hoszting]",
      },
      {
        catalog: "JXN-003",
        name: "algoritmizator",
        stack: "Laravel · PHP",
        github: "https://github.com/Jxn01/algoritmizator",
        paras: [
          "Gamifikált webes platform algoritmusok és adatszerkezetek tanulásához. A BSc-szakdolgozatom — és az a projekt, amin megtanultam full-stack webfejleszteni, mert amikor nekiálltam, még nem tudtam. Választottam témát, választottam stacket, a tananyagot meg írta a kényszer. A kódbázison látszik, ahogy egy fejlesztő élő adásban összerakja magát — és ezt direkt hagytam így.",
        ],
        status: "[STÁTUSZ: élő demó hamarosan — saját hoszting]",
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
        body: "Egyetlen zsh-scriptként indult, ami <code>screen</code> és <code>say</code> parancsokkal pátyolgatott egy Minecraft-szervert. Mára teljes Python szerverkezelő csomag: automata újraindítás crash után, ütemezett restartok, backupok. Nincs ennél őszintébb ops-tréning — a játékos a legkönyörtelenebb uptime-SLA.",
      },
      {
        catalog: "JXN-005",
        name: "citybuilder",
        stack: "Java · egyetemi csapatprojekt",
        github: "https://github.com/Jxn01/citybuilder",
        body: "Kis SimCity-szerű játék, csapatban, szoftvertechnológia tárgyra. A teljesség kedvéért szerepel itt — és bizonyítéknak, hogy túléltem a csapatmunkát.",
      },
      {
        catalog: "JXN-006",
        name: "elte-ik-proginf-bsc",
        stack: "Minden, egyszerre",
        github: "https://github.com/Jxn01/elte-ik-proginf-bsc",
        body: "Hat félévnyi ELTE-s munka egy archívumban: C, C++, Java, Haskell, Erlang, Agda, Python, R, SQL és még jó pár dolog. A 07-es track „láttam már” listájának bizonylatai.",
      },
    ],
    labTitle: "A laborban",
    lab: [
      {
        name: "Ez az oldal.",
        body: "A portfólió, amit épp nézel, maga is projekt: saját tervezés, saját build, saját hoszting. Rekurzió mint feature.",
      },
      {
        name: "A Számológép.",
        body: "Mindenki első projektje egy számológép — az enyém az utolsó lesz. Egy szándékosan, már-már kórosan túltervezett számológép; a terv az, hogy addig csinálom, amíg be nem bizonyítja az Euler-tételt. Határidő nincs. Akkor lesz kész, amikor már elég elborult.",
      },
    ],
  },
  ai: {
    title: "AI: AHOGY TÉNYLEG HASZNÁLOM",
    paras: [
      "Nap mint nap fejlesztek AI-agentekkel, és erről inkább beszélek nyíltan, mint hogy úgy csináljak, mintha nem így lenne.",
      "Az álláspontom: <strong>az AI-asszisztált fejlesztés egy skill — és ez a skill nem a promptírás, hanem az architektúra.</strong> Kontextusmenedzsment; annak ismerete, hogy mit lehet egy modellre rábízni és mit nem; a probléma ellenőrizhető darabokra bontása; az output kritikus olvasása; és a rendszer olyan mély értése, hogy kiszúrd, amikor a modell magabiztosan téved. Kódot kérni bárki tud. Tudni, hogy <em>mit kérj, milyen sorrendben, milyen megkötésekkel, és hogyan ellenőrizd</em> — az a szakma.",
      "A saját stackemben — Laravel, React, TypeScript — minden sort elolvasok és értek, ami élesbe megy. Az agent gyorsít; a tervezés és az ellenőrzés az enyém. A stackemen kívül meg kimondom őszintén: a matterlights szinte teljes egészében agentic fejlesztéssel készült, olyan nyelven, amit nem írok folyékonyan. A rendszert akkor is én terveztem, tudom, mit csinál minden komponense, és minden architekturális döntés az enyém volt. Amit nem csináltam: nem kézzel írtam a Pythont. Az eredmény viszont egy működő termék, amire enélkül sosem fért volna bele az időmbe.",
      "Amiben viszont <em>nem</em> hiszek: beírni a promptba, hogy „ne hibázz”, és várni a bugmentes kódot. A modell az ítélőképesség erősítője. Ha nulla ítélőképességet szorzol fel, nagyon gyors nullát kapsz.",
      "A toolchain, ha valakit érdekel: Claude Code és Cursor napi szinten, több modellszolgáltató, feladattól függően. Otthon saját vason futnak a helyi modellek — Open WebUI a chat-workflow-khoz, ComfyUI képhez és videóhoz —, mert egy eszköz korlátait úgy ismered meg igazán, ha magad üzemelteted.",
    ],
  },
  stack: {
    title: "STACK",
    tiers: [
      {
        name: "Napi szinten",
        intro: "A production stack. Ezekkel szállítok minden nap, és ezekért felelek, ha eltörnek.",
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
        intro: "Valós projektekben használtam, csak nem minden nap.",
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
          'Hat félév ELTE IK alatt mindegyik megfordult a kezem alatt — a bizonylatok <a href="https://github.com/Jxn01/elte-ik-proginf-bsc">az archívumban</a>.',
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
      "A „láttam már” pontosan annyit jelent: nem állítom, hogy folyékonyan beszélek Agdául — azt állítom, hogy egyszer tételeket bizonyítottam egy fordítónak, és túléltem. A listának nem a nyelvek a lényege. Hanem hogy a következő stack sosem akadály.",
  },
  offclock: {
    title: "MUNKAIDŐN KÍVÜL",
    items: [
      {
        label: "Souls-játékok",
        body: "Dark Souls, Elden Ring, Hollow Knight. Szeretem az olyan játékot, ami annyira tisztel, hogy hajlandó megölni.",
      },
      {
        label: "Warframe",
        body: "~3000 óra. A sunk costot belülről ismerem, és ettől függetlenül folytatom.",
      },
      {
        label: "CRT-sarok",
        body: "Egy PS2, CRT tévére kötve — ahogy a fejlesztők megálmodták. Vannak jelek, amiknek jár a natív felbontás.",
      },
      {
        label: "D&D",
        body: "Jelenleg egy kaotikus-semleges gnóm artificert tolok, akinek Gloria nevű ágyúja van. Többévnyi DM-elés után játékosnak lenni maga a nyaralás — csak közben robbannak a dolgok.",
      },
      {
        label: "Okosotthon",
        body: "Home Assistant OS viszi a házat. Lásd JXN-001, hogy mi történik, ha a lámpák nem bírják a tempót.",
      },
      {
        label: "Hip-hop és sneakerek",
        body: "Mindkét part, ótestamentum. Mindig szól valami — és a rotáció a cipőspolcra is kiterjed. A frontendmánia nem áll meg a képernyőnél.",
      },
      {
        label: "Lokális AI",
        body: "Egy RTX 5090, ami megdolgozik a helyéért: saját hosztolt LLM-ek, kép- és videógeneráló pipeline-ok, chat frontendek. Félig labor, félig hobbi, teljes egészében hősugárzó.",
      },
    ],
  },
  now: {
    title: "MOST",
    lead: "Éppen most:",
    items: [
      "Építem ezt az oldalt, és rendes hosztot keresek neki",
      "Tervezem a számológépet",
      "Sorozatban halok meg ebben: %GAME%",
    ],
    spinningLabel: "most pörög:",
    lastUpdatedLabel: "Utolsó frissítés:",
  },
  contact: {
    title: "KAPCSOLAT",
    lead: "Írj rám.",
    body: "Találtál valami érdekeset? Nem értesz egyet a stack-tierekkel? Érdekel, hogy halad a számológép? (Lassan.)",
    emailLabel: "Email",
    emailPlaceholder: "[PLACEHOLDER — email]",
    closing: "Aktívan nem keresek munkát — de az érdekes problémák kapják az első választ.",
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
