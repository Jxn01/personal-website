import { useEffect, useRef, useState } from "react";
import "./pads.css";

/**
 * JXN-808 — a drum machine that lives in a portfolio for no defensible
 * reason. Four voices synthesized from raw oscillators and noise (no
 * samples, nothing downloaded), sixteen steps, 90 BPM. The same 90 BPM
 * every animation on this site is timed to — press play and the whole
 * page has been nodding along the entire time.
 */

const BPM = 90;
const STEPS = 16;
const SECONDS_PER_STEP = 60 / BPM / 4; // 16ths — 166.6ms, the beat-quarter

type Voice = "kick" | "snare" | "hat" | "rim";

const VOICES: { id: Voice; label: string }[] = [
  { id: "kick", label: "KCK" },
  { id: "snare", label: "SNR" },
  { id: "hat", label: "HAT" },
  { id: "rim", label: "RIM" },
];

// the default pattern is a respectable boom-bap, out of respect
const DEFAULT_PATTERN: Record<Voice, number[]> = {
  kick: [0, 7, 10],
  snare: [4, 12],
  hat: [0, 2, 4, 6, 8, 10, 12, 14],
  rim: [13],
};

type Grid = Record<Voice, boolean[]>;

function defaultGrid(): Grid {
  const g = {} as Grid;
  for (const v of VOICES) {
    g[v.id] = Array.from({ length: STEPS }, (_, i) => DEFAULT_PATTERN[v.id].includes(i));
  }
  return g;
}

// session memory — the groove survives closing the window
let savedGrid: Grid | null = null;

/* — synthesis: four voices from thin air ————————————————————————————————— */
function noiseBuffer(ctx: AudioContext): AudioBuffer {
  const buf = ctx.createBuffer(1, ctx.sampleRate * 0.3, ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  return buf;
}

function playVoice(ctx: AudioContext, noise: AudioBuffer, voice: Voice, t: number): void {
  const out = ctx.createGain();
  out.connect(ctx.destination);

  if (voice === "kick") {
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(140, t);
    osc.frequency.exponentialRampToValueAtTime(44, t + 0.11);
    g.gain.setValueAtTime(0.9, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.26);
    osc.connect(g).connect(out);
    osc.start(t);
    osc.stop(t + 0.3);
  } else if (voice === "snare") {
    const n = ctx.createBufferSource();
    n.buffer = noise;
    const hp = ctx.createBiquadFilter();
    hp.type = "highpass";
    hp.frequency.value = 1400;
    const ng = ctx.createGain();
    ng.gain.setValueAtTime(0.5, t);
    ng.gain.exponentialRampToValueAtTime(0.001, t + 0.16);
    n.connect(hp).connect(ng).connect(out);
    n.start(t);
    n.stop(t + 0.2);
    const osc = ctx.createOscillator();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(196, t);
    const og = ctx.createGain();
    og.gain.setValueAtTime(0.35, t);
    og.gain.exponentialRampToValueAtTime(0.001, t + 0.09);
    osc.connect(og).connect(out);
    osc.start(t);
    osc.stop(t + 0.1);
  } else if (voice === "hat") {
    const n = ctx.createBufferSource();
    n.buffer = noise;
    const hp = ctx.createBiquadFilter();
    hp.type = "highpass";
    hp.frequency.value = 7400;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.22, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.045);
    n.connect(hp).connect(g).connect(out);
    n.start(t);
    n.stop(t + 0.06);
  } else {
    // rim: a short, woody click
    const osc = ctx.createOscillator();
    osc.type = "square";
    osc.frequency.setValueAtTime(820, t);
    const bp = ctx.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.value = 1700;
    bp.Q.value = 4;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.5, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
    osc.connect(bp).connect(g).connect(out);
    osc.start(t);
    osc.stop(t + 0.06);
  }
}

interface Props {
  onClose: () => void;
}

export default function Pads({ onClose }: Props): React.ReactElement {
  const [grid, setGrid] = useState<Grid>(() => savedGrid ?? defaultGrid());
  const [playing, setPlaying] = useState(false);
  const [step, setStep] = useState(-1);

  const ctxRef = useRef<AudioContext | null>(null);
  const noiseRef = useRef<AudioBuffer | null>(null);
  const gridRef = useRef(grid);
  gridRef.current = grid;
  savedGrid = grid;

  const ensureCtx = (): AudioContext => {
    if (!ctxRef.current) {
      ctxRef.current = new AudioContext();
      noiseRef.current = noiseBuffer(ctxRef.current);
    }
    void ctxRef.current.resume();
    return ctxRef.current;
  };

  // lookahead scheduler — the standard Web Audio metronome pattern
  useEffect(() => {
    if (!playing) {
      setStep(-1);
      return;
    }
    const ctx = ensureCtx();
    let nextTime = ctx.currentTime + 0.06;
    let nextStep = 0;
    const timer = window.setInterval(() => {
      while (nextTime < ctx.currentTime + 0.12) {
        const s = nextStep;
        for (const v of VOICES) {
          if (gridRef.current[v.id][s]) {
            playVoice(ctx, noiseRef.current!, v.id, nextTime);
          }
        }
        const visualIn = (nextTime - ctx.currentTime) * 1000;
        window.setTimeout(() => setStep(s), Math.max(0, visualIn));
        nextTime += SECONDS_PER_STEP;
        nextStep = (nextStep + 1) % STEPS;
      }
    }, 25);
    return () => window.clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing]);

  const toggle = (voice: Voice, i: number): void => {
    setGrid((g) => ({
      ...g,
      [voice]: g[voice].map((on, j) => (j === i ? !on : on)),
    }));
    if (!gridRef.current[voice][i]) {
      const ctx = ensureCtx();
      playVoice(ctx, noiseRef.current!, voice, ctx.currentTime);
    }
  };

  const audition = (voice: Voice): void => {
    const ctx = ensureCtx();
    playVoice(ctx, noiseRef.current!, voice, ctx.currentTime);
  };

  return (
    <div
      className="ov-backdrop"
      onPointerDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="window pads ov-window" role="dialog" aria-label="JXN-808 drum machine">
        <div className="window-bar">
          <span>JXN-808 — {BPM} bpm, non-negotiable</span>
          <span className="win-controls">
            <button className="win-close" onClick={onClose} aria-label="close">
              ×
            </button>
          </span>
        </div>

        <div className="pads-body">
          <div className="pads-grid" style={{ ["--steps" as string]: STEPS }}>
            {VOICES.map((v) => (
              <div className="pads-row" key={v.id}>
                <button className="pads-voice" onClick={() => audition(v.id)} title="audition">
                  {v.label}
                </button>
                {grid[v.id].map((on, i) => (
                  <button
                    key={i}
                    className="pads-cell"
                    data-on={on || undefined}
                    data-now={playing && step === i ? "" : undefined}
                    data-beat={i % 4 === 0 ? "" : undefined}
                    onClick={() => toggle(v.id, i)}
                    aria-label={`${v.label} step ${i + 1}`}
                    aria-pressed={on}
                  />
                ))}
              </div>
            ))}
          </div>

          <div className="pads-controls">
            <button className="deck-btn pads-play" onClick={() => setPlaying((p) => !p)}>
              {playing ? "■ stop" : "▶ play"}
            </button>
            <button
              className="deck-btn"
              onClick={() => setGrid(defaultGrid())}
              title="back to the default groove"
            >
              reset
            </button>
            <button
              className="deck-btn"
              onClick={() =>
                setGrid((g) => {
                  const empty = {} as Grid;
                  for (const v of VOICES) empty[v.id] = g[v.id].map(() => false);
                  return empty;
                })
              }
            >
              clear
            </button>
            <span className="pads-note">
              synthesized from oscillators — nothing was downloaded. the whole site runs at {BPM}.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
