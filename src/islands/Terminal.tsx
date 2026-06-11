import { useCallback, useEffect, useRef, useState } from "react";
import { growBonsai, bonsaiToHtml } from "../lib/bonsai";
import { withBase } from "../lib/url";
import type { OverlayId } from "./Deck";
import "./terminal.css";

/**
 * The terminal. Lives in the deck (and answers to ~ / `). It reads the actual
 * page for `ls`/`cat`, reports the actual build for `uptime`, grows actual
 * trees, and can reach every other toy in the deck.
 * Machines speak English; the terminal is EN on both sides of the record.
 */

type LineKind = "in" | "out" | "err" | "raw";

interface Line {
  kind: LineKind;
  html: string;
  id: number;
}

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

// session memory: closing the window doesn't wipe the scrollback
let scrollback: Line[] = [];
let history: string[] = [];
let lineSeq = 0;

// mailbox: the deck queues a command, the terminal runs it on mount
let queued: string | null = null;
export function queueTermCommand(cmd: string): void {
  queued = cmd;
}

interface Props {
  onClose: () => void;
  onOverlay: (id: OverlayId) => void;
}

export default function Terminal({ onClose, onOverlay }: Props): React.ReactElement {
  const [lines, setLines] = useState<Line[]>(scrollback);
  const [value, setValue] = useState("");
  const [busy, setBusy] = useState(false);
  const histIdx = useRef(history.length);
  const inputRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const bonsaiTimer = useRef<number>(0);

  const print = useCallback((kind: LineKind, html: string): void => {
    setLines((prev) => {
      scrollback = [...prev, { kind, html, id: lineSeq++ }];
      return scrollback;
    });
  }, []);

  const out = useCallback((text: string) => print("out", esc(text)), [print]);
  const err = useCallback((text: string) => print("err", esc(text)), [print]);
  const raw = useCallback((html: string) => print("raw", html), [print]);

  useEffect(() => {
    inputRef.current?.focus();
    if (scrollback.length === 0) {
      raw(
        `<span class="t-dim">jxn-000 terminal — type <span class="t-accent">help</span>. or don't. exploration is respected.</span>`,
      );
    }
    if (queued) {
      const cmd = queued;
      queued = null;
      window.setTimeout(() => run(cmd), 280);
    }
    return () => window.clearInterval(bonsaiTimer.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
          `<span class="t-accent">pads</span>      open the drum machine`,
          `<span class="t-accent">tag</span>       open the spray can`,
          `<span class="t-accent">mix</span>       open the mixer`,
          `<span class="t-accent">status</span>    the engine room`,
          `<span class="t-accent">side</span> <span class="t-dim">a|b</span>  flip the record`,
          `<span class="t-accent">clear</span>     wipe`,
          `<span class="t-accent">exit</span>      close (esc and :q also work)`,
          `<span class="t-dim">…there are more. this is a crate; dig.</span>`,
        ].join("\n"),
      );
    },
    fetch: () => {
      const sw = ["--bg-2", "--accent", "--gold", "--cream", "--mint", "--ink-1"]
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
      raw(items || `<span class="t-dim">empty. you're probably off the record — the tracks live on /en.</span>`);
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
        dispatchEvent(
          new CustomEvent("jxn:flip", { detail: withBase(side === "a" ? "/en" : "/hu") }),
        );
      }, 350);
    },
    pads: () => onOverlay("pads"),
    tag: () => onOverlay("spray"),
    spray: () => onOverlay("spray"),
    mix: () => onOverlay("mix"),
    status: () => onOverlay("status"),
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
          copy[copy.length - 1] = {
            ...copy[copy.length - 1]!,
            kind: "raw",
            html: bonsaiToHtml(grid),
          };
          scrollback = copy;
          return copy;
        });
        if (next.done) {
          window.clearInterval(bonsaiTimer.current);
          setBusy(false);
          print(
            "raw",
            `<span class="t-dim">done growing. the one in <span class="t-accent">status</span> grows with the site — check back next month.</span>`,
          );
        }
      }, 80);
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
    play: () => out("the beat is structural here — but the pads are real. try: pads"),
    vim: () => out("this is not that kind of terminal. (:q works here though, which is more than some can say.)"),
    nano: () => commands.vim!([]),
    emacs: () => out("no. (respectfully.)"),
    rm: () => err("rm: this record is read-only. as records should be."),
    man: () => out("the only manual here is docs/jxn-000-site-asset.md, and you can't have it."),
    clear: () => {
      scrollback = [];
      setLines([]);
    },
    exit: () => onClose(),
    ":q": () => onClose(),
    ":wq": () => onClose(),
  };

  const run = (input: string): void => {
    const trimmed = input.trim();
    print("in", esc(trimmed));
    if (!trimmed) return;
    history.push(trimmed);
    histIdx.current = history.length;
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
      if (history.length === 0) return;
      histIdx.current = Math.max(0, histIdx.current - 1);
      setValue(history[histIdx.current] ?? "");
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      histIdx.current = Math.min(history.length, histIdx.current + 1);
      setValue(history[histIdx.current] ?? "");
    }
  };

  return (
    <div
      className="ov-backdrop"
      onPointerDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="window term ov-window" role="dialog" aria-label="terminal">
        <div className="window-bar">
          <span>jxn@jxn-000: ~</span>
          <span className="win-controls">
            <button className="win-close" onClick={onClose} aria-label="close">
              ×
            </button>
          </span>
        </div>
        <div className="term-body" ref={bodyRef} onClick={() => inputRef.current?.focus()}>
          {lines.map((l) => (
            <div
              key={l.id}
              className={`t-${l.kind}`}
              dangerouslySetInnerHTML={{ __html: l.html }}
            />
          ))}
        </div>
        <div className="term-chips" aria-label="quick commands">
          {["help", "fetch", "ls", "bonsai", "pads", "cat 02", "side a", "side b"].map((c) => (
            <button key={c} onClick={() => run(c)} disabled={busy}>
              {c}
            </button>
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
