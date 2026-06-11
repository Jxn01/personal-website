import { useEffect, useState } from "react";
import "./mixer.css";

/**
 * THE MIXER — fader deck for the site's actual design tokens. The accent is
 * stored as H/S/L parts precisely so this thing can exist: drag HUE and the
 * entire site — links, splats, ghost numerals, the hero field, the bonsai
 * leaves — re-inks itself live. Your mix is saved and re-applied on return.
 *
 * "mixed with machines · mastered by hand" was always meant literally.
 */

const STORE = "jxn.mix";

export interface Mix {
  h: number | null; // accent hue override
  s: number; // accent saturation %
  grain: number; // dot-grid opacity 0–100
  scan: number; // scanline opacity 0–100
}

const DEFAULTS: Mix = { h: null, s: 76, grain: 100, scan: 100 };

function sideDefaultHue(): number {
  return document.documentElement.dataset.side === "B" ? 27 : 338;
}

export function applyMix(mix: Mix): void {
  const root = document.documentElement.style;
  if (mix.h !== null) {
    root.setProperty("--accent-h", String(mix.h));
    root.setProperty("--accent-s", `${mix.s}%`);
  } else {
    root.removeProperty("--accent-h");
    root.removeProperty("--accent-s");
  }
  root.setProperty("--fx-grain", String(mix.grain / 100));
  root.setProperty("--fx-scan", String(mix.scan / 100));
}

export function loadMix(): Mix {
  try {
    const raw = localStorage.getItem(STORE);
    if (raw) return { ...DEFAULTS, ...(JSON.parse(raw) as Partial<Mix>) };
  } catch {
    /* fresh desk */
  }
  return { ...DEFAULTS };
}

interface Props {
  onClose: () => void;
}

export default function Mixer({ onClose }: Props): React.ReactElement {
  const [mix, setMix] = useState<Mix>(loadMix);

  useEffect(() => {
    applyMix(mix);
    try {
      localStorage.setItem(STORE, JSON.stringify(mix));
    } catch {
      /* the mix lives for the session anyway */
    }
  }, [mix]);

  const reset = (): void => {
    setMix({ ...DEFAULTS });
    localStorage.removeItem(STORE);
  };

  const hue = mix.h ?? sideDefaultHue();

  const channel = (
    label: string,
    value: number,
    min: number,
    max: number,
    onInput: (v: number) => void,
    readout: string,
  ): React.ReactElement => (
    <label className="mix-ch">
      <span className="mix-label">{label}</span>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onInput={(e) => onInput(Number((e.target as HTMLInputElement).value))}
      />
      <span className="mix-read">{readout}</span>
    </label>
  );

  return (
    <div
      className="ov-backdrop"
      onPointerDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="window mixer ov-window" role="dialog" aria-label="the mixer">
        <div className="window-bar">
          <span>jxn-000 — the mixer</span>
          <span className="win-controls">
            <button className="win-close" onClick={onClose} aria-label="close">
              ×
            </button>
          </span>
        </div>

        <div className="mixer-body">
          <p className="mix-note">
            these are the site's live design tokens. drag them. everything re-inks itself —
            the hero, the links, the tree. your mix is remembered.
          </p>

          {channel("HUE", hue, 0, 360, (v) => setMix((m) => ({ ...m, h: v })), `${hue}°`)}
          {channel("SAT", mix.s, 20, 100, (v) => setMix((m) => ({ ...m, h: m.h ?? sideDefaultHue(), s: v })), `${mix.s}%`)}
          {channel("GRAIN", mix.grain, 0, 100, (v) => setMix((m) => ({ ...m, grain: v })), `${mix.grain}`)}
          {channel("SCAN", mix.scan, 0, 100, (v) => setMix((m) => ({ ...m, scan: v })), `${mix.scan}`)}

          <div className="mix-row">
            <span className="mix-chip" style={{ background: "var(--accent)" }} />
            <span className="mix-chip" style={{ background: "var(--gold)" }} />
            <span className="mix-chip" style={{ background: "var(--cream)" }} />
            <span className="mix-chip" style={{ background: "var(--mint)" }} />
            <button className="deck-btn" onClick={reset} title="back to the master">
              master
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
