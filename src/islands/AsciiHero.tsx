import { useEffect, useRef } from "react";
import { mixRgb, resolveColor } from "../lib/colors";

/**
 * The hero field: value-noise "smoke" rendered as mono glyphs, disturbed by
 * the cursor, rippled by clicks. Cream peaks, rare gold twinkles — the chain
 * glint. Hand-rolled: no three.js, no shader libs. The whole point is that
 * view-source holds up.
 *
 * Budget: sprite-atlas blits at 30fps, DPR-capped, paused when offscreen.
 */

const RAMP = " ··::;=+*x%#@";
const CELL = 16; // css px per glyph cell
const FPS = 30;

// tiny deterministic value noise (no deps)
function makeNoise(seed: number) {
  const perm = new Uint8Array(512);
  let s = seed;
  const rand = () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
  const p = Array.from({ length: 256 }, (_, i) => i);
  for (let i = 255; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [p[i], p[j]] = [p[j]!, p[i]!];
  }
  for (let i = 0; i < 512; i++) perm[i] = p[i & 255]!;

  const grad = (h: number, x: number, y: number) =>
    (h & 1 ? -x : x) + (h & 2 ? -y : y);

  const fade = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);

  return (x: number, y: number): number => {
    const X = Math.floor(x) & 255;
    const Y = Math.floor(y) & 255;
    x -= Math.floor(x);
    y -= Math.floor(y);
    const u = fade(x);
    const v = fade(y);
    const a = perm[X]! + Y;
    const b = perm[X + 1]! + Y;
    const n =
      (1 - v) *
        ((1 - u) * grad(perm[a]!, x, y) + u * grad(perm[b]!, x - 1, y)) +
      v *
        ((1 - u) * grad(perm[a + 1]!, x, y - 1) +
          u * grad(perm[b + 1]!, x - 1, y - 1));
    return n * 0.7071 + 0.5; // ~[0,1]
  };
}

interface Ripple {
  x: number;
  y: number;
  t: number;
}

export default function AsciiHero(): React.ReactElement {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const canvas: HTMLCanvasElement = ref.current;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;
    // astro-island wrappers are display:contents (zero box) — measure and
    // listen on the hero section itself
    const host: HTMLElement = canvas.closest(".hero") ?? canvas;

    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    // resolve through the engine — color-mix()/var() soup means nothing to canvas
    const bg = resolveColor("--bg-0");
    const accent = resolveColor("--accent");
    const colors = {
      accentDim: mixRgb(accent, bg, 0.62),
      accent: mixRgb(accent, bg, 0.34),
      accentHot: accent,
      cream: resolveColor("--cream"),
      gold: resolveColor("--gold"),
    };
    const tiers = [colors.accentDim, colors.accent, colors.accentHot, colors.cream];

    const noise = makeNoise(0x4a584e); // "JXN"
    const dpr = Math.min(devicePixelRatio || 1, 1.5);

    let cols = 0;
    let rows = 0;
    let heat: Float32Array = new Float32Array(0);
    let atlas: HTMLCanvasElement | null = null;
    let glyphW = 0;
    let glyphH = 0;

    // prerender every (glyph × color tier) once; runtime is pure drawImage
    function buildAtlas(): void {
      glyphW = Math.ceil(CELL * dpr);
      glyphH = Math.ceil(CELL * dpr);
      atlas = document.createElement("canvas");
      atlas.width = glyphW * RAMP.length;
      atlas.height = glyphH * (tiers.length + 1); // +1 = gold row
      const a = atlas.getContext("2d");
      if (!a) return;
      a.font = `${13 * dpr}px "JetBrains Mono Variable", "JetBrains Mono", monospace`;
      a.textAlign = "center";
      a.textBaseline = "middle";
      const rowsColors = [...tiers, colors.gold];
      rowsColors.forEach((color, r) => {
        a.fillStyle = color;
        for (let g = 0; g < RAMP.length; g++) {
          a.fillText(RAMP[g]!, g * glyphW + glyphW / 2, r * glyphH + glyphH / 2);
        }
      });
    }

    function resize(): void {
      const rect = host.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      canvas.width = Math.ceil(rect.width * dpr);
      canvas.height = Math.ceil(rect.height * dpr);
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      cols = Math.ceil(rect.width / CELL);
      rows = Math.ceil(rect.height / CELL);
      heat = new Float32Array(cols * rows);
      buildAtlas();
    }

    const pointer = { x: -1e4, y: -1e4, vx: 0, lastX: -1e4 };
    const ripples: Ripple[] = [];

    function onMove(e: PointerEvent): void {
      const rect = canvas.getBoundingClientRect();
      pointer.vx = e.clientX - (pointer.lastX === -1e4 ? e.clientX : pointer.lastX);
      pointer.lastX = e.clientX;
      pointer.x = (e.clientX - rect.left) / CELL;
      pointer.y = (e.clientY - rect.top) / CELL;
    }

    function onLeave(): void {
      pointer.x = -1e4;
      pointer.y = -1e4;
      pointer.lastX = -1e4;
    }

    function onClick(e: PointerEvent): void {
      const rect = canvas.getBoundingClientRect();
      ripples.push({
        x: (e.clientX - rect.left) / CELL,
        y: (e.clientY - rect.top) / CELL,
        t: 0,
      });
      if (ripples.length > 4) ripples.shift();
    }

    // gold twinkles: a stable sparse set of cells — the chain glints
    const isGoldCell = (x: number, y: number): boolean =>
      ((x * 73856093) ^ (y * 19349663)) % 487 === 0;

    let t = 0;
    let raf = 0;
    let last = 0;
    let visible = true;

    function frame(now: number): void {
      raf = requestAnimationFrame(frame);
      if (!visible || !atlas) return;
      if (now - last < 1000 / FPS) return;
      last = now;
      t += 0.0065;

      // stamp pointer heat + decay
      if (pointer.x > -100) {
        const px = Math.round(pointer.x);
        const py = Math.round(pointer.y);
        const R = 5;
        for (let dy = -R; dy <= R; dy++) {
          for (let dx = -R; dx <= R; dx++) {
            const x = px + dx;
            const y = py + dy;
            if (x < 0 || y < 0 || x >= cols || y >= rows) continue;
            const d2 = dx * dx + dy * dy;
            if (d2 > R * R) continue;
            const idx = y * cols + x;
            heat[idx] = Math.min(1.4, heat[idx]! + 0.5 * (1 - d2 / (R * R)));
          }
        }
      }

      for (let i = 0; i < ripples.length; i++) {
        const r = ripples[i]!;
        r.t += 0.55;
        const radius = r.t;
        const band = 1.6;
        const x0 = Math.max(0, Math.floor(r.x - radius - band));
        const x1 = Math.min(cols - 1, Math.ceil(r.x + radius + band));
        const y0 = Math.max(0, Math.floor(r.y - radius - band));
        const y1 = Math.min(rows - 1, Math.ceil(r.y + radius + band));
        for (let y = y0; y <= y1; y++) {
          for (let x = x0; x <= x1; x++) {
            const d = Math.hypot(x - r.x, y - r.y);
            if (Math.abs(d - radius) < band) {
              const idx = y * cols + x;
              heat[idx] = Math.min(1.4, heat[idx]! + 0.5);
            }
          }
        }
      }
      while (ripples.length && ripples[0]!.t > Math.max(cols, rows)) ripples.shift();

      ctx!.clearRect(0, 0, canvas.width, canvas.height);

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const idx = y * cols + x;
          heat[idx] = heat[idx]! * 0.93;

          // two octaves of drifting noise; sparse by design
          const n =
            noise(x * 0.055 + t, y * 0.07 - t * 0.6) * 0.65 +
            noise(x * 0.16 - t * 0.4, y * 0.18 + t) * 0.35;

          let v = (n - 0.4) * 2.05 + heat[idx]!;
          if (v <= 0.04) continue;
          if (v > 1) v = 1;

          const g = Math.min(RAMP.length - 1, Math.floor(v * RAMP.length));
          if (g === 0) continue;

          let tier: number;
          if (isGoldCell(x, y) && v > 0.25) {
            tier = tiers.length; // gold row
          } else {
            tier = Math.min(tiers.length - 1, Math.floor(v * tiers.length));
          }

          ctx!.drawImage(
            atlas,
            g * glyphW,
            tier * glyphH,
            glyphW,
            glyphH,
            x * glyphW,
            y * glyphH,
            glyphW,
            glyphH,
          );
        }
      }
    }

    resize();

    if (reduced) {
      // a single still frame: the field, frozen. still gorgeous, never moving.
      visible = true;
      frame(performance.now() + 1000);
      cancelAnimationFrame(raf);
      return;
    }

    const io = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? true;
    });
    io.observe(canvas);

    const onVis = (): void => {
      visible = !document.hidden;
    };

    addEventListener("resize", resize);
    host.addEventListener("pointermove", onMove);
    host.addEventListener("pointerleave", onLeave);
    host.addEventListener("pointerdown", onClick);
    document.addEventListener("visibilitychange", onVis);
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      removeEventListener("resize", resize);
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
      host.removeEventListener("pointerdown", onClick);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return <canvas ref={ref} className="hero-canvas" aria-hidden="true" />;
}
