import type { Dict } from "./types";

/**
 * SIDE A — English (canonical).
 * Copy is verbatim from docs/jxn-000-site-asset.md, PART 2. Do not "improve" it.
 */
export const en: Dict = {
  meta: {
    htmlLang: "en",
    side: "A",
    title: "Norbert Oláh — I code. · JXN-000",
    description:
      "Full-stack developer in Budapest, building and maintaining production systems people physically walk through every day — from React frontends down to the Linux boxes they run on.",
  },
  ui: {
    skipToContent: "skip to content",
    sideTooltip: "EN / HU",
    statusLink: "status",
    portraitLabel: "fig.01 · norbert oláh · budapest · duotone",
    trackLabel: "track",
  },
  hero: {
    name: "Norbert Oláh",
    headline: "I code.",
    body: "That's the honest version. The longer version: full-stack developer building and maintaining production systems people physically walk through every day — from React frontends down to the Linux boxes they run on. I think in systems, I get things working when everything's on fire, and I will absolutely lose an hour making a button feel right.",
    ctas: { work: "view work ↓", github: "github →", contact: "contact →" },
    micro: "currently keeping access control systems alive across Hungary.",
  },
  about: {
    title: "ABOUT",
    paras: [
      "I'm Norbert — a full-stack developer in Budapest. By day I work on <strong>EverLink</strong>, an access control and parking platform: hundreds of installed systems across Hungary, the largest serving a few thousand cardholders. My territory is the client and everything the client touches — the React/TypeScript frontend, the Laravel backend behind it, the realtime layer, and a healthy share of the server firefighting when production decides to have opinions.",
      "I graduated from ELTE's Computer Science BSc in 2024, which means I've been paid to write code for two years and writing it for considerably longer. University put an unreasonable number of languages through my hands — C to Haskell to Agda — and the takeaway wasn't any single language. It was that everything is a system, and systems can be understood.",
      "What actually drives me: making things <em>work</em>, and then making them <em>good</em>. I'm the person who fixes the production outage and then spends the evening polishing the frontend animation nobody asked for. Both halves matter. One keeps the lights on, the other is why anyone enjoys flipping the switch.",
      "When I'm not at a keyboard I'm— okay, I'm usually still at a keyboard, but a different one. More below.",
    ],
  },
  experience: {
    title: "EXPERIENCE",
    role: "Developer",
    org: "EverLink",
    dates: "2024 → present · Budapest",
    intro:
      "EverLink builds access control and parking systems — physical infrastructure with software brains. Card readers, barriers, kiosks, and the platform that orchestrates all of it. A small company with no safety net and no “someone else's problem.” When it's yours, it's <em>yours</em>.",
    domainsLead: "My domain is the client side and everything adjacent to it:",
    domains: [
      {
        label: "Frontend",
        body: "the React + TypeScript application operators actually use — built up and kept strict (<code>tsconfig</code> tightened to industry-standard strictness, because <code>any</code> is a confession, not a type).",
      },
      {
        label: "Backend",
        body: "the Laravel/PHP services behind that frontend — queues via Horizon, realtime via Reverb websockets, Redis, MariaDB.",
      },
      {
        label: "The unglamorous middle",
        body: "build tooling, static analysis, CI, and the server-level debugging that doesn't respect job descriptions.",
      },
    ],
    fieldNotesTitle: "Field notes",
    fieldNotes: [
      {
        id: "FN-01",
        title: "The live deploy rescue.",
        body: "On-site at a new installation, mid-deployment, the system decided to comprehensively fail — in front of the client, on a work laptop that struggles to run a browser. Diagnosed and fixed production live, on location, while the deployment continued around me. Nothing teaches you a stack faster than debugging it while people watch. We left with a working system.",
      },
      {
        id: "FN-02",
        title: "The 970-file refactor.",
        body: "A large Laravel codebase had outgrown its structure, and moving ~970 PHP files by hand is how you create a thousand subtle bugs. Instead I drove the refactor programmatically through the IDE's scripting API, so every move updated every reference atomically. Big, scary, boring — exactly the kind of change you automate or don't attempt.",
      },
      {
        id: "FN-03",
        title: "The static analysis grind.",
        body: "Took the codebase from “PHPStan level 2, two hundred-plus errors” up through level 8, clean. Not glamorous. Every level is a hundred small arguments with your past self. The codebase argues back less now.",
      },
      {
        id: "FN-04",
        title: "Infrastructure firefighting.",
        body: "Apache MPM misconfigurations, a database that refused to start after reboot because a runtime directory didn't survive it, custom systemd units that needed to actually behave like services. The kind of problems that don't show up in portfolios because there's nothing to screenshot — just a system that stays up now.",
      },
    ],
  },
  featured: {
    title: "FEATURED PROJECTS",
    projects: [
      {
        catalog: "JXN-001",
        name: "matterlights",
        stack: "Python · Home Assistant · Matter",
        github: "https://github.com/Jxn01/matterlights",
        paras: [
          "Screen-to-light sync for Matter bulbs through Home Assistant — the SignalRGB treatment, extended to lights SignalRGB can't reach. Samples the screen in real time, maps zones to bulbs through a local dashboard with a zone designer, and pushes colors out over the local network.",
          "Born of a real itch: the rest of my setup synced to my screen, the ceiling didn't, and that was unacceptable. It's painfully specific, slightly absurd, and works.",
          "Full disclosure, because I'd rather say it than have you guess: this one was built almost entirely through AI-assisted development. I'm not a Python developer — but I architected it, I understand what every component does and why, and I directed every decision. More on what I think that means in track 06.",
        ],
      },
      {
        catalog: "JXN-002",
        name: "section-cms",
        stack: "PHP, from scratch",
        github: "https://github.com/Jxn01/section-cms",
        paras: [
          "A lightweight, modular, SEO-first CMS written in plain PHP. No framework, no build step, no dependency tree that needs its own monitoring.",
          "The origin story is better than the elevator pitch: a colleague (not a developer) needed a website he could maintain <em>without me</em>, and he had exactly one piece of hosting available — an existing WordPress server he didn't want to replace with a paid VPS. So the whole thing is engineered to live inside a WordPress host's constraints: plain PHP, drop-in deployable, no special server requirements.",
          "It's also my quiet proof that I know what the frameworks are doing under the hood. Laravel pays my bills; this shows I understand <em>why</em>.",
        ],
        status: "[STATUS: live demo pending — will be self-hosted]",
      },
      {
        catalog: "JXN-003",
        name: "algoritmizator",
        stack: "Laravel · PHP",
        github: "https://github.com/Jxn01/algoritmizator",
        paras: [
          "A gamified web platform for learning algorithms and data structures. My BSc thesis — and the project where I learned full-stack web development, because I didn't know it yet when I started. Picked the topic, picked the stack, and let necessity be the curriculum. The codebase shows a developer being assembled in real time, and I've left it that way on purpose.",
        ],
        status: "[STATUS: live demo pending — will be self-hosted]",
      },
    ],
  },
  more: {
    title: "MORE PROJECTS",
    projects: [
      {
        catalog: "JXN-004",
        name: "minecraft-server-utilities",
        stack: "Python (formerly zsh)",
        github: "https://github.com/Jxn01/minecraft-server-utilities",
        body: "Started life as a single z-shell script babysitting a Minecraft server through <code>screen</code> and <code>say</code> commands. Grew up into a full Python-based server management suite: crash auto-restarts, scheduled restarts, backups. The most honest ops training there is — players are a ruthless uptime SLA.",
      },
      {
        catalog: "JXN-005",
        name: "citybuilder",
        stack: "Java · university group project",
        github: "https://github.com/Jxn01/citybuilder",
        body: "A small SimCity-like built with a team for a software engineering course. Included for completeness and as proof I survived group work.",
      },
      {
        catalog: "JXN-006",
        name: "elte-ik-proginf-bsc",
        stack: "Everything, simultaneously",
        github: "https://github.com/Jxn01/elte-ik-proginf-bsc",
        body: "Six semesters of ELTE coursework in one archive: C, C++, Java, Haskell, Erlang, Agda, Python, R, SQL, and more. The receipts for the “seen before” list in track 07.",
      },
    ],
    labTitle: "In the lab",
    lab: [
      {
        name: "This site.",
        body: "The portfolio you're looking at is itself a project: designed, built, and self-hosted. Recursion as a feature.",
      },
      {
        name: "The Calculator.",
        body: "Everyone's first project is a calculator. Mine will be the last one. An intentionally, pathologically over-engineered calculator — the plan is to keep going until it can prove Euler's theorem. No timeline. It's done when it's unhinged enough.",
      },
    ],
  },
  ai: {
    title: "AI: HOW I ACTUALLY USE IT",
    paras: [
      "I develop with AI agents daily, and I'd rather talk about it plainly than pretend otherwise.",
      "Here's the position: <strong>AI-assisted development is a skill, and the skill is not prompt-writing — it's architecture.</strong> Context management, knowing what a model can and can't be trusted with, decomposing problems into verifiable pieces, reading the output critically, and understanding the system you're building deeply enough to catch the model being confidently wrong. Anyone can ask for code. Knowing <em>what to ask for, in what order, with what constraints, and how to verify it</em> is the actual craft.",
      "In my own stack — Laravel, React, TypeScript — I read and understand every line that ships. The agent accelerates; I architect and verify. Outside my stack, I'll say it straight: matterlights is built almost entirely through agentic development, in a language I don't write fluently. I still designed the system, I know what every component does, and I made every architectural call. What I didn't do is hand-write the Python — and the result is a working product I couldn't have justified the time to build otherwise.",
      "What I <em>don't</em> believe in: typing “make no mistakes” into a prompt and expecting bug-free code. The model is a force multiplier on judgment. Multiply zero judgment and you get very fast zero.",
      "The toolchain, for the curious: Claude Code and Cursor as daily drivers, multiple model providers routed by task. At home I run local models on my own hardware — Open WebUI for chat workflows, ComfyUI for image and video generation — because the best way to understand a tool's limits is to host it yourself.",
    ],
  },
  stack: {
    title: "STACK",
    tiers: [
      {
        name: "Daily drivers",
        intro: "The production stack. I ship with these every day and answer for them when they break.",
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
          "Linux (Debian servers, Arch workstation)",
          "Vite",
          "PHPStan/Larastan",
          "Git + GitLab CI",
        ],
      },
      {
        name: "Comfortable",
        intro: "Used in real projects, just not every day.",
        items: [
          "Python",
          "Java",
          "Bash/zsh",
          "systemd & general server administration",
          "Home Assistant",
          "SQL beyond the ORM",
        ],
      },
      {
        name: "Seen before",
        intro:
          'Six semesters of ELTE IK put all of this through my hands — receipts in <a href="https://github.com/Jxn01/elte-ik-proginf-bsc">the archive</a>.',
        items: [
          "C",
          "C++",
          "Haskell",
          "Erlang",
          "Agda (type theory)",
          "R",
          "SageMath (cryptography)",
          "Hadoop MapReduce",
          "Spark",
          "PowerShell",
          "socket programming",
          "neural networks",
          "concurrent programming in Java",
        ],
      },
    ],
    closing:
      "“Seen before” means exactly that — I'm not claiming fluency in Agda, I'm claiming I once proved things to a compiler and lived. The point of the list isn't the languages. It's that the next stack is never the problem.",
  },
  offclock: {
    title: "OFF THE CLOCK",
    items: [
      {
        label: "Souls games",
        body: "Dark Souls, Elden Ring, Hollow Knight. I like software that respects me enough to kill me.",
      },
      {
        label: "Warframe",
        body: "~3,000 hours. I understand sunk cost intimately and continue regardless.",
      },
      {
        label: "CRT corner",
        body: "A PS2 hooked up to a CRT TV, the way the developers intended. Some signals deserve their native resolution.",
      },
      {
        label: "D&D",
        body: "Currently playing a chaotic-neutral gnome artificer with a cannon named Gloria. After years of DMing, being a player is a vacation where things explode.",
      },
      {
        label: "Home automation",
        body: "Home Assistant OS runs the house. See JXN-001 for what happens when the lights don't keep up.",
      },
      {
        label: "Hip-hop & sneakers",
        body: "Both coasts, the old testament. Always on rotation — and the rotation extends to the shoe rack. The frontend obsession does not stop at screens.",
      },
      {
        label: "Local AI",
        body: "An RTX 5090 earning its keep — self-hosted LLMs, image and video gen pipelines, chat frontends. Partly a lab, partly a hobby, fully a space heater.",
      },
    ],
  },
  now: {
    title: "NOW",
    lead: "Currently:",
    items: [
      "Building this site and getting it properly hosted",
      "Plotting the calculator",
      "Dying repeatedly in %GAME%",
    ],
    spinningLabel: "now spinning:",
    lastUpdatedLabel: "Last updated:",
  },
  contact: {
    title: "CONTACT",
    lead: "Say hi.",
    body: "Found something interesting here? Disagree with my stack tiers? Want to know how the calculator is going? (Slowly.)",
    emailLabel: "Email",
    emailPlaceholder: "[PLACEHOLDER — email]",
    closing: "I'm not actively looking — but interesting problems get answered first.",
  },
  footer: {
    lines: [
      "produced & engineered by Norbert Oláh",
      "recorded in Budapest · mixed with machines · mastered by hand",
      "no cookies · no trackers · no skill bars",
    ],
  },
  tracks: {
    titles: [
      "INTRO",
      "ABOUT",
      "EXPERIENCE",
      "FEATURED PROJECTS",
      "MORE PROJECTS",
      "AI: HOW I ACTUALLY USE IT",
      "STACK",
      "OFF THE CLOCK",
      "NOW",
      "CONTACT",
    ],
  },
};
