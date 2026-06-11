import { useCallback, useEffect, useRef, useState } from "react";
import { growBonsai, bonsaiToHtml } from "../lib/bonsai";
import "./terminal.css";

/**
 * The terminal. Press ~ anywhere. It reads the actual page for `ls`/`cat`,
 * reports the actual build for `uptime`, and grows actual trees.
 * Machines speak English; the terminal is EN on both sides of the record.
 */

type LineKind = "in" | "out" | "err" | "raw";

interface Line {
  kind: LineKind;
  html: string;
}

let lineId = 0;

const esc = (s: string): string =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function pageSections(): { no: string; title: string; el: HTMLElement }[] {
  return [...document.querySelectorAll<HTMLElement>("[data-track]")].map((el) => ({
    no: el.dataset.no ?? "??",
    title: (el.dataset.title ?? "untitled").toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    el,
  }));
}

const CAT = String.raw`   /\_/\   ___
  ( o.o ) (_  \
   |_T_|    )  ) ~ meow.
  /     \  (  (
 (_(_)_(_)__)_)`;

const GLORIA = String.raw`        ______
   ____/__||__\_____
  |    GLORIA       \\
  |__________________\\
   (__)         (__)      "say hi."`;

const JXN_ART = String.raw`     ██╗██╗  ██╗███╗   ██╗
     ██║╚██╗██╔╝████╗  ██║
     ██║ ╚███╔╝ ██╔██╗ ██║
██   ██║ ██╔██╗ ██║╚██╗██║
╚█████╔╝██╔╝ ██╗██║ ╚████║
 ╚════╝ ╚═╝  ╚═╝╚═╝  ╚═══╝`;

function fmtUptime(): string {
  const ms = Date.now() - new Date(__BUILD_TIME__).getTime();
  const d = Math.floor(ms / 86400000);
  const h = Math.floor((ms % 86400000) / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  return `${d}d ${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export default function Terminal(): React.ReactElement | null {
  const [open, setOpen] = useState(false);
  const [lines, setLines] = useState<Line[]>([]);
  const [value, setValue] = useState("");
  const [busy, setBusy] = useState(false);
  const historyRef = useRef<string[]>([]);
  const histIdx = useRef(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const bonsaiTimer = useRef<number>(0);

  const print = useCallback((kind: LineKind, html: string): void => {
    setLines((prev) => [...prev, { kind, html }]);
  }, []);

  const out = useCallback((text: string) => print("out", esc(text)), [print]);
  const err = useCallback((text: string) => print("err", esc(text)), [print]);
  const raw = useCallback((html: string) => print("raw", html), [print]);

  // open/close
  useEffect(() => {
    const onKey = (e: KeyboardEvent): void => {
      const t = e.target as HTMLElement;
      const typing =
        t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable;
      if (e.key === "~" && !typing) {
        e.preventDefault();
        setOpen((o) => !o);
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    };
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
      if (lines.length === 0) {
        raw(
          `<span class="t-dim">jxn-000 terminal — type <span class="t-accent">help</span>. or don't. exploration is respected.</span>`,
        );
      }
    } else {
      window.clearInterval(bonsaiTimer.current);
      setBusy(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight });
  }, [lines]);

  const commands: Record<string, (args: string[]) => void> = {
    help: () => {
      raw(
        [
          `<span class="t-accent">help</span>      this`,
          `<span class="t-accent">fetch</span>     system info`,
          `<span class="t-accent">ls</span>        list tracks`,
          `<span class="t-accent">cat</span> <span class="t-dim">&lt;n&gt;</span>   read a track (number or name)`,
          `<span class="t-accent">uptime</span>    since last master`,
          `<span class="t-accent">bonsai</span>    grow one`,
          `<span class="t-accent">side</span> <span class="t-dim">a|b</span>  flip the record`,
          `<span class="t-accent">status</span>    the engine room`,
          `<span class="t-accent">clear</span>     wipe`,
          `<span class="t-accent">exit</span>      close (esc and :q also work)`,
          `<span class="t-dim">…there are more. this is a crate; dig.</span>`,
        ].join("\n"),
      );
    },
    fetch: () => {
      const sw = ["--bg-2", "--accent", "--gold", "--cream", "--ink-1"]
        .map((t) => `<span class="t-swatch" style="background:var(${t})"></span>`)
        .join("");
      raw(
        `<span class="t-accent">${esc(JXN_ART)}</span>\n` +
          [
            `<span class="t-gold">jxn</span>@<span class="t-gold">${esc(location.host || "jxn-000")}</span>`,
            `<span class="t-dim">──────────────────────────</span>`,
            `<span class="t-accent">os</span>        static HTML, hand-mastered`,
            `<span class="t-accent">kernel</span>    astro 5 + react islands`,
            `<span class="t-accent">shell</span>     this one`,
            `<span class="t-accent">uptime</span>    ${fmtUptime()} (since last master)`,
            `<span class="t-accent">build</span>     ${__COMMIT__}`,
            `<span class="t-accent">packages</span>  0 trackers, 0 cookies`,
            `<span class="t-accent">cpu</span>       1 developer`,
            `<span class="t-accent">side</span>      ${document.documentElement.dataset.side ?? "A"}`,
            `<span class="t-accent">cat. no</span>   JXN-000`,
            ``,
            sw,
          ].join("\n"),
      );
    },
    neofetch: () => commands.fetch!([]),
    ls: () => {
      const items = pageSections()
        .map((s) => `<span class="t-accent">${s.no}</span>-${esc(s.title)}.md`)
        .join("\n");
      raw(items || `<span class="t-dim">empty. you're probably on a subpage — the record is at /en.</span>`);
    },
    cat: (args) => {
      const q = args.join(" ").trim().toLowerCase();
      if (!q || q === "cat") {
        // `cat` with nothing to read: the cat.
        raw(`<span class="t-gold">${esc(CAT)}</span>`);
        return;
      }
      const sections = pageSections();
      const hit = sections.find(
        (s) => s.no === q.padStart(2, "0") || s.title.includes(q.replace(/\.md$/, "")),
      );
      if (!hit) {
        err(`cat: ${q}: no such track`);
        return;
      }
      const text = (hit.el.innerText ?? "").replace(/\n{3,}/g, "\n\n").trim();
      out(text.length > 4000 ? `${text.slice(0, 4000)}\n[…]` : text);
    },
    uptime: () => {
      out(`up ${fmtUptime()} (since last master) — load average: comfortable`);
    },
    whoami: () => out("norbert. or jxn, depending on the paperwork."),
    pwd: () => out("/home/jxn/budapest"),
    date: () => out(new Date().toString()),
    echo: (args) => out(args.join(" ")),
    side: (args) => {
      const side = args[0]?.toLowerCase();
      if (side !== "a" && side !== "b") {
        err("usage: side a|b");
        return;
      }
      out("flipping the record…");
      window.setTimeout(() => {
        location.href = side === "a" ? "/en" : "/hu";
      }, 350);
    },
    status: () => {
      out("opening the engine room…");
      window.setTimeout(() => {
        location.href = "/status";
      }, 350);
    },
    bonsai: () => {
      if (busy) return;
      setBusy(true);
      const gen = growBonsai((Math.random() * 2 ** 31) | 0, 34);
      raw("");
      bonsaiTimer.current = window.setInterval(() => {
        const next = gen.next();
        const grid = next.value;
        setLines((prev) => {
          const copy = [...prev];
          copy[copy.length - 1] = { kind: "raw", html: bonsaiToHtml(grid) };
          return copy;
        });
        if (next.done) {
          window.clearInterval(bonsaiTimer.current);
          setBusy(false);
          print(
            "raw",
            `<span class="t-dim">done growing. the one on /status grows with the site — check back next month.</span>`,
          );
        }
      }, 90);
    },
    "hire-me": () => err("permission denied: try sudo."),
    sudo: (args) => {
      if (args.join(" ").includes("hire-me")) {
        raw(
          [
            `<span class="t-gold">permission granted.</span> (you seem trustworthy.)`,
            ``,
            `github    <a href="https://github.com/Jxn01">github.com/Jxn01</a>`,
            `linkedin  <a href="https://www.linkedin.com/in/jxn01">linkedin.com/in/jxn01</a>`,
            `email     [PLACEHOLDER — email] <span class="t-dim">(the owner hasn't wired this up yet. genuinely.)</span>`,
            ``,
            `<span class="t-dim">not actively looking — interesting problems get answered first.</span>`,
          ].join("\n"),
        );
      } else {
        out("we trust you have received the usual lecture. (try: sudo hire-me)");
      }
    },
    gloria: () => {
      raw(`<span class="t-gold">${esc(GLORIA)}</span>`);
      window.setTimeout(() => out("BOOM."), 666);
    },
    warframe: () => out("~3,000 hours. I understand sunk cost intimately and continue regardless."),
    play: () => out("no audio on this site. the beat is structural. (90 bpm — it's in the timings.)"),
    vim: () => out("this is not that kind of terminal. (:q works here though, which is more than some can say.)"),
    nano: () => commands.vim!([]),
    emacs: () => out("no. (respectfully.)"),
    rm: () => err("rm: this record is read-only. as records should be."),
    man: () => out("the only manual here is docs/jxn-000-site-asset.md, and you can't have it."),
    clear: () => setLines([]),
    exit: () => setOpen(false),
    ":q": () => setOpen(false),
    ":wq": () => setOpen(false),
  };

  const run = (input: string): void => {
    const trimmed = input.trim();
    print("in", esc(trimmed));
    if (!trimmed) return;
    historyRef.current.push(trimmed);
    histIdx.current = historyRef.current.length;
    const [cmd = "", ...args] = trimmed.split(/\s+/);
    const fn = commands[cmd.toLowerCase()];
    if (fn) {
      fn(args);
    } else {
      err(`command not found: ${cmd} — try help`);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Enter") {
      run(value);
      setValue("");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const h = historyRef.current;
      if (h.length === 0) return;
      histIdx.current = Math.max(0, histIdx.current - 1);
      setValue(h[histIdx.current] ?? "");
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const h = historyRef.current;
      histIdx.current = Math.min(h.length, histIdx.current + 1);
      setValue(h[histIdx.current] ?? "");
    }
  };

  if (!open) return null;

  return (
    <div
      className="term-backdrop"
      onPointerDown={(e) => {
        if (e.target === e.currentTarget) setOpen(false);
      }}
    >
      <div className="window term" role="dialog" aria-label="terminal">
        <div className="window-bar">
          <span>jxn@jxn-000: ~</span>
          <span className="win-controls">
            <button className="win-close" onClick={() => setOpen(false)} aria-label="close">
              ×
            </button>
          </span>
        </div>
        <div className="term-body" ref={bodyRef} onClick={() => inputRef.current?.focus()}>
          {lines.map((l, i) => (
            <div
              key={`${i}-${lineId++}`}
              className={`t-${l.kind}`}
              dangerouslySetInnerHTML={{ __html: l.html }}
            />
          ))}
        </div>
        <div className="term-input-row">
          <span className="t-prompt">jxn@jxn-000:~$</span>
          <input
            ref={inputRef}
            value={value}
            disabled={busy}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={onKeyDown}
            spellCheck={false}
            autoCapitalize="off"
            autoComplete="off"
            aria-label="terminal input"
          />
        </div>
      </div>
    </div>
  );
}
