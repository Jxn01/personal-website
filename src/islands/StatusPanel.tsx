import { useEffect, useRef, useState } from "react";
import { ageBonsai, bonsaiToHtml, growBonsai } from "../lib/bonsai";
import { config } from "../config";
import "./status.css";

/**
 * The engine room. Build facts, live uptime, the registers — and THE TREE,
 * seeded by the site's age in weeks. It is genuinely bigger next month.
 * Rendered identically as a page (/status) and as a modal from the deck.
 */

const SWATCHES = [
  ["--bg-0", "base"],
  ["--bg-2", "sleeve"],
  ["--accent", "side ink"],
  ["--gold", "jewelry"],
  ["--cream", "human"],
  ["--mint", "live"],
  ["--error", "failure"],
] as const;

function fmt(ms: number): string {
  const d = Math.floor(ms / 86400000);
  const h = Math.floor((ms % 86400000) / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  const pad = (n: number): string => String(n).padStart(2, "0");
  return `${d}d ${pad(h)}:${pad(m)}:${pad(s)}`;
}

export default function StatusPanel(): React.ReactElement {
  const built = new Date(__BUILD_TIME__);
  const [uptime, setUptime] = useState(() => fmt(Date.now() - built.getTime()));
  const [host, setHost] = useState("—");
  const treeRef = useRef<HTMLPreElement>(null);

  useEffect(() => {
    setHost(location.host || "local playback");
    const t = window.setInterval(
      () => setUptime(fmt(Date.now() - built.getTime())),
      1000,
    );
    return () => window.clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // the tree — this week's tree, grown live (instant under reduced motion)
  useEffect(() => {
    const el = treeRef.current;
    if (!el) return;
    const { seed, steps } = ageBonsai(config.launchDate);
    const gen = growBonsai(seed, steps);
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      let last = gen.next();
      while (!last.done) last = gen.next();
      el.innerHTML = bonsaiToHtml(last.value);
      return;
    }
    const timer = window.setInterval(() => {
      const next = gen.next();
      el.innerHTML = bonsaiToHtml(next.value);
      if (next.done) window.clearInterval(timer);
    }, 90);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="status-body">
      <dl className="readout">
        <dt>cat. no</dt>
        <dd>JXN-000</dd>
        <dt>state</dt>
        <dd>
          <span className="st-live">● operational</span>
        </dd>
        <dt>build</dt>
        <dd>{__COMMIT__}</dd>
        <dt>mastered</dt>
        <dd>{built.toISOString().replace("T", " ").slice(0, 16)} UTC</dd>
        <dt>uptime</dt>
        <dd>{uptime} (since last master)</dd>
        <dt>host</dt>
        <dd>{host}</dd>
        <dt>engine</dt>
        <dd>astro 5 · react islands · hand-rolled everything else</dd>
        <dt>cargo</dt>
        <dd>0 cookies · 0 trackers · 0 skill bars</dd>
        <dt>tempo</dt>
        <dd>90 bpm (structural — the pads can prove it)</dd>
      </dl>

      <div className="st-tokens">
        <span className="label">registers</span>
        <span className="swatches">
          {SWATCHES.map(([token, name]) => (
            <i key={token} style={{ background: `var(${token})` }} title={`${name} · ${token}`} />
          ))}
        </span>
      </div>

      <div className="st-grove">
        <pre ref={treeRef} aria-label="an ASCII bonsai, grown from this site's age"></pre>
        <p className="label st-note">
          planted {config.launchDate}. it grows with the site. check back.
        </p>
      </div>
    </div>
  );
}
