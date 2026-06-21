import { useCallback, useEffect, useRef, useState } from "react";
import { growBonsai, bonsaiToHtml } from "../lib/bonsai";
import { withBase } from "../lib/url";
import {
  HOME,
  type FsDir,
  type FsNode,
  type Locale,
  isDir,
  nodeAt,
  promptPath,
  readFile,
  resolvePath,
} from "../lib/fs";
import { strings } from "../lib/term-strings";
import type { OverlayId } from "./Deck";
import "./terminal.css";

/**
 * The terminal. Lives in the deck (and answers to ~ / `). It carries a small
 * navigable filesystem (cd / ls / tree / cat / find / pwd), reaches every toy
 * in the deck, and follows the selected language — read live, so flipping the
 * record re-localises it on the spot. Command NAMES stay English; every dev
 * types `ls`.
 */

type LineKind = "in" | "out" | "err" | "raw";

interface Line {
  kind: LineKind;
  html: string;
  id: number;
}

const esc = (s: string): string =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** Live locale — re-read each command so the flip re-localises the terminal. */
const loc = (): Locale => (document.documentElement.lang === "hu" ? "hu" : "en");

const CAT = String.raw`   /\_/\   ___
  ( o.o ) (_  \
   |_T_|    )  ) ~ meow.
  /     \  (  (
 (_(_)_(_)__)_)`;

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

/* — filesystem rendering (HTML, with register colours) —————————————————————— */

function sortedNames(dir: FsDir, all: boolean): string[] {
  return Object.keys(dir.children)
    .filter((n) => all || !dir.children[n]!.hidden)
    .sort((a, b) => {
      const da = dir.children[a]!.type === "dir";
      const db = dir.children[b]!.type === "dir";
      if (da !== db) return da ? -1 : 1;
      return a.localeCompare(b);
    });
}

function nameSpan(name: string, node: FsNode): string {
  const cls = node.hidden ? "t-dim" : node.type === "dir" ? "t-accent" : "";
  return `<span class="${cls}">${esc(name)}${node.type === "dir" ? "/" : ""}</span>`;
}

function lsHtml(dir: FsDir, all: boolean, emptyLabel: string): string {
  const names = sortedNames(dir, all);
  if (!names.length) return `<span class="t-dim">${emptyLabel}</span>`;
  return names.map((n) => nameSpan(n, dir.children[n]!)).join("   ");
}

function treeLines(dir: FsDir, all: boolean, prefix: string): string[] {
  const names = sortedNames(dir, all);
  const out: string[] = [];
  names.forEach((n, i) => {
    const last = i === names.length - 1;
    const node = dir.children[n]!;
    out.push(`${prefix}${last ? "└── " : "├── "}${nameSpan(n, node)}`);
    if (node.type === "dir") {
      out.push(...treeLines(node, all, prefix + (last ? "    " : "│   ")));
    }
  });
  return out;
}

function findLines(dir: FsDir, term: string, base: string, acc: string[]): void {
  for (const name of Object.keys(dir.children)) {
    const node = dir.children[name]!;
    const path = `${base}/${name}`;
    if (name.toLowerCase().includes(term.toLowerCase())) {
      acc.push(
        `<span class="${node.type === "dir" ? "t-accent" : ""}">${esc(path)}${node.type === "dir" ? "/" : ""}</span>`,
      );
    }
    if (node.type === "dir") findLines(node, term, path, acc);
  }
}

// session memory: closing the window keeps scrollback, history AND the cwd
let scrollback: Line[] = [];
let history: string[] = [];
let lineSeq = 0;
let cwd = HOME;

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
  const [prompt, setPrompt] = useState(promptPath(cwd));
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
      raw(`<span class="t-dim">${strings(loc()).banner}</span>`);
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

  const lookup = (arg: string | undefined): { path: string; node: FsNode | null } => {
    const path = resolvePath(cwd, arg);
    return { path, node: nodeAt(path) };
  };

  const commands: Record<string, (args: string[]) => void> = {
    help: () => {
      const S = strings(loc());
      const heads = S.help.map((h) => `${h.cmd}${h.arg ? " " + h.arg : ""}`);
      const max = Math.max(...heads.map((h) => h.length));
      const body = S.help
        .map((h, i) => {
          const head = `<span class="t-accent">${esc(h.cmd)}</span>${h.arg ? ` <span class="t-dim">${esc(h.arg)}</span>` : ""}`;
          const pad = " ".repeat(max - heads[i]!.length + 2);
          return `${head}${pad}<span class="t-dim">${esc(h.desc)}</span>`;
        })
        .join("\n");
      raw(`${body}\n<span class="t-dim">${esc(S.helpMore)}</span>`);
    },

    ls: (args) => {
      const all = args.includes("-a") || args.includes("--all");
      const target = args.find((a) => !a.startsWith("-"));
      const { path, node } = lookup(target);
      if (!node) return err(strings(loc()).noSuchFile(target ?? path));
      if (!isDir(node)) return raw(nameSpan(path.split("/").pop() ?? path, node));
      raw(lsHtml(node, all, strings(loc()).emptyDir));
    },

    cd: (args) => {
      const target = args[0];
      const { path, node } = lookup(target);
      if (!node) return err(strings(loc()).noSuchFile(target ?? path));
      if (!isDir(node)) return err(strings(loc()).notDir(target ?? path));
      cwd = path;
      setPrompt(promptPath(cwd));
    },

    pwd: () => out(cwd),

    cat: (args) => {
      const arg = args[0];
      if (!arg) {
        raw(`<span class="t-art t-gold">${esc(CAT)}</span>`);
        return out(strings(loc()).catMeow);
      }
      const numeric = /^\d{1,2}$/.test(arg) ? arg.padStart(2, "0") : null;
      let node = lookup(arg).node;
      if (!node && numeric) {
        const site = nodeAt(`${HOME}/site`);
        if (isDir(site)) {
          const match = Object.keys(site.children).find((n) => n.startsWith(numeric));
          if (match) node = site.children[match]!;
        }
      }
      if (!node) return err(strings(loc()).noSuchFile(arg));
      if (isDir(node)) return err(strings(loc()).isDir(arg));
      const text = readFile(node, loc());
      if (text === "") return; // /dev/null and friends
      if (node.art) return raw(`<span class="t-art t-gold">${esc(text)}</span>`);
      out(text);
    },

    tree: (args) => {
      const all = args.includes("-a");
      const target = args.find((a) => !a.startsWith("-"));
      const { path, node } = lookup(target);
      if (!node) return err(strings(loc()).noSuchFile(target ?? path));
      if (!isDir(node)) return raw(nameSpan(path.split("/").pop() ?? path, node));
      raw(`<span class="t-accent">${esc(promptPath(path))}</span>\n${treeLines(node, all, "").join("\n")}`);
    },

    find: (args) => {
      const term = args[0];
      if (!term) return err("usage: find <name>");
      const start = nodeAt(cwd);
      if (!isDir(start)) return;
      const acc: string[] = [];
      findLines(start, term, promptPath(cwd) === "~" ? "~" : cwd, acc);
      raw(acc.length ? acc.join("\n") : `<span class="t-dim">— ${esc(term)}: 0</span>`);
    },

    fetch: () => {
      const hu = loc() === "hu";
      const sw = ["--bg-2", "--accent", "--gold", "--cream", "--mint", "--ink-1"]
        .map((t) => `<span class="t-swatch" style="background:var(${t})"></span>`)
        .join("");
      raw(
        `<span class="t-art t-accent">${esc(JXN_ART)}</span>\n` +
          [
            `<span class="t-gold">jxn</span>@<span class="t-gold">${esc(location.host || "jxn-000")}</span>`,
            `<span class="t-dim">──────────────────────────</span>`,
            `<span class="t-accent">os</span>        ${hu ? "statikus HTML, kézzel masterelve" : "static HTML, hand-mastered"}`,
            `<span class="t-accent">kernel</span>    astro 5 + react islands`,
            `<span class="t-accent">shell</span>     ${hu ? "ez itt" : "this one"}`,
            `<span class="t-accent">uptime</span>    ${fmtUptime()} (${hu ? "az utolsó master óta" : "since last master"})`,
            `<span class="t-accent">build</span>     ${__COMMIT__}`,
            `<span class="t-accent">packages</span>  ${hu ? "0 tracker, 0 cookie" : "0 trackers, 0 cookies"}`,
            `<span class="t-accent">cpu</span>       ${hu ? "1 fejlesztő" : "1 developer"}`,
            `<span class="t-accent">side</span>      ${document.documentElement.dataset.side ?? "A"}`,
            `<span class="t-accent">cat. no</span>   JXN-000`,
            ``,
            sw,
          ].join("\n"),
      );
    },
    neofetch: () => commands.fetch!([]),

    uptime: () =>
      out(`up ${fmtUptime()} (${loc() === "hu" ? "az utolsó master óta" : "since last master"})`),
    whoami: () => out(strings(loc()).whoami),
    date: () => out(new Date().toString()),
    echo: (args) => out(args.join(" ")),

    side: (args) => {
      const side = args[0]?.toLowerCase();
      if (side !== "a" && side !== "b") return err(strings(loc()).usageSide);
      out(strings(loc()).flipping);
      window.setTimeout(() => {
        dispatchEvent(new CustomEvent("jxn:flip", { detail: withBase(side === "a" ? "/en" : "/hu") }));
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
            html: `<span class="t-art">${bonsaiToHtml(grid)}</span>`,
          };
          scrollback = copy;
          return copy;
        });
        if (next.done) {
          window.clearInterval(bonsaiTimer.current);
          setBusy(false);
          print("raw", `<span class="t-dim">${strings(loc()).bonsaiDone}</span>`);
        }
      }, 80);
    },

    "hire-me": () => err(strings(loc()).hireDenied),
    sudo: (args) => {
      if (args.join(" ").includes("hire-me")) {
        const note =
          loc() === "hu"
            ? `[PLACEHOLDER — email] <span class="t-dim">(a tulaj még nem kötötte be. tényleg.)</span>`
            : `[PLACEHOLDER — email] <span class="t-dim">(the owner hasn't wired this up yet. genuinely.)</span>`;
        raw(
          [
            `<span class="t-gold">${strings(loc()).sudoGranted}</span>`,
            ``,
            `github    <a href="https://github.com/Jxn01">github.com/Jxn01</a>`,
            `linkedin  <a href="https://www.linkedin.com/in/jxn01">linkedin.com/in/jxn01</a>`,
            `email     ${note}`,
          ].join("\n"),
        );
      } else {
        out(strings(loc()).sudoLecture);
      }
    },
    gloria: () => {
      const g = nodeAt(`${HOME}/off-the-clock/dnd/gloria.cannon`);
      if (g && g.type === "file") raw(`<span class="t-art t-gold">${esc(readFile(g, loc()))}</span>`);
      window.setTimeout(() => out(strings(loc()).boom), 666);
    },
    warframe: () => out(strings(loc()).warframe),
    play: () => out(strings(loc()).play),
    vim: () => out(strings(loc()).vim),
    nano: () => commands.vim!([]),
    emacs: () => out(strings(loc()).emacs),
    rm: () => err(strings(loc()).rm),
    man: () => out(strings(loc()).man),
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
    print(
      "in",
      `jxn@jxn-000:<span class="t-path">${esc(promptPath(cwd))}</span>$ ${esc(trimmed)}`,
    );
    if (!trimmed) return;
    history.push(trimmed);
    histIdx.current = history.length;
    const [cmd = "", ...args] = trimmed.split(/\s+/);
    const fn = commands[cmd.toLowerCase()];
    if (fn) fn(args);
    else err(strings(loc()).cmdNotFound(cmd));
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

  const chips = ["ls", "tree", "fetch", "cd ~/projects", "cat readme.txt", "bonsai", "side a", "side b"];

  return (
    <div
      className="ov-backdrop"
      onPointerDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="window term ov-window" role="dialog" aria-label="terminal">
        <div className="window-bar">
          <span>jxn@jxn-000: {prompt}</span>
          <span className="win-controls">
            <button className="win-close" onClick={onClose} aria-label="close">
              ×
            </button>
          </span>
        </div>
        <div className="term-body" ref={bodyRef} onClick={() => inputRef.current?.focus()}>
          {lines.map((l) => (
            <div key={l.id} className={`t-${l.kind}`} dangerouslySetInnerHTML={{ __html: l.html }} />
          ))}
        </div>
        <div className="term-chips" aria-label="quick commands">
          {chips.map((c) => (
            <button key={c} onClick={() => run(c)} disabled={busy}>
              {c}
            </button>
          ))}
        </div>
        <div className="term-input-row">
          <span className="t-prompt">
            jxn@jxn-000:<span className="t-path">{prompt}</span>$
          </span>
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
