import { useEffect, useRef, useState } from "react";
import { resolveColor } from "../lib/colors";

/**
 * TAG — a spray can for the whole site. Real spray dynamics: soft particle
 * cloud, overspray, and drips when you linger. Your piece is saved locally
 * and welcomes you back. The wall doesn't judge; the wall remembers.
 */

const STORE = "jxn.wall";

interface Drip {
  x: number;
  y: number;
  len: number;
  max: number;
  w: number;
  color: string;
}

interface Props {
  onClose: () => void;
}

export default function Spray({ onClose }: Props): React.ReactElement {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [colors, setColors] = useState<string[]>([]);
  const [color, setColor] = useState("");
  const colorRef = useRef(color);
  colorRef.current = color;

  useEffect(() => {
    const palette = [
      resolveColor("--accent"),
      resolveColor("--gold"),
      resolveColor("--cream"),
      resolveColor("--mint"),
      resolveColor("--ink-0"),
    ];
    setColors(palette);
    setColor(palette[0]!);

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = innerWidth * dpr;
    canvas.height = innerHeight * dpr;
    ctx.scale(dpr, dpr);

    // the wall remembers
    const saved = localStorage.getItem(STORE);
    if (saved) {
      const img = new Image();
      img.onload = () => ctx.drawImage(img, 0, 0, innerWidth, innerHeight);
      img.src = saved;
    }

    const drips: Drip[] = [];
    let spraying = false;
    let lastX = 0;
    let lastY = 0;
    let linger = 0;

    function burst(x: number, y: number): void {
      if (!ctx) return;
      ctx.fillStyle = colorRef.current;
      // dense core
      for (let i = 0; i < 38; i++) {
        const a = Math.random() * Math.PI * 2;
        const r = Math.abs(gauss()) * 11;
        ctx.globalAlpha = 0.16;
        const size = Math.random() * 1.6 + 0.4;
        ctx.fillRect(x + Math.cos(a) * r, y + Math.sin(a) * r, size, size);
      }
      // overspray halo
      for (let i = 0; i < 10; i++) {
        const a = Math.random() * Math.PI * 2;
        const r = 12 + Math.random() * 22;
        ctx.globalAlpha = 0.05;
        ctx.fillRect(x + Math.cos(a) * r, y + Math.sin(a) * r, 1, 1);
      }
      ctx.globalAlpha = 1;
    }

    function gauss(): number {
      return (Math.random() + Math.random() + Math.random() - 1.5) / 1.5;
    }

    function onDown(e: PointerEvent): void {
      if ((e.target as HTMLElement).closest(".spray-tools")) return;
      spraying = true;
      linger = 0;
      lastX = e.clientX;
      lastY = e.clientY;
      burst(e.clientX, e.clientY);
    }

    function onMove(e: PointerEvent): void {
      if (!spraying) return;
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      const dist = Math.hypot(dx, dy);
      const steps = Math.max(1, Math.floor(dist / 4));
      for (let i = 0; i < steps; i++) {
        burst(lastX + (dx * i) / steps, lastY + (dy * i) / steps);
      }
      // linger → paint pools → drips. like a real can held too long.
      linger = dist < 3 ? linger + 1 : 0;
      if (linger > 6 && Math.random() < 0.3 && drips.length < 24) {
        drips.push({
          x: e.clientX + gauss() * 6,
          y: e.clientY + 4,
          len: 0,
          max: 24 + Math.random() * 70,
          w: 1 + Math.random() * 1.4,
          color: colorRef.current,
        });
        linger = 0;
      }
      lastX = e.clientX;
      lastY = e.clientY;
    }

    function onUp(): void {
      spraying = false;
    }

    let raf = 0;
    function dripFrame(): void {
      raf = requestAnimationFrame(dripFrame);
      if (!ctx) return;
      for (let i = drips.length - 1; i >= 0; i--) {
        const d = drips[i]!;
        const speed = 0.6 + (1 - d.len / d.max) * 0.8;
        ctx.globalAlpha = 0.5;
        ctx.fillStyle = d.color;
        ctx.fillRect(d.x, d.y + d.len, d.w, speed + 1);
        ctx.globalAlpha = 1;
        d.len += speed;
        if (d.len >= d.max) drips.splice(i, 1);
      }
    }

    canvas.addEventListener("pointerdown", onDown);
    addEventListener("pointermove", onMove);
    addEventListener("pointerup", onUp);
    raf = requestAnimationFrame(dripFrame);

    return () => {
      // the wall remembers — save on the way out
      try {
        localStorage.setItem(STORE, canvas.toDataURL("image/png"));
      } catch {
        /* a very large piece; the wall forgives */
      }
      cancelAnimationFrame(raf);
      canvas.removeEventListener("pointerdown", onDown);
      removeEventListener("pointermove", onMove);
      removeEventListener("pointerup", onUp);
    };
  }, []);

  const wipe = (): void => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (canvas && ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      localStorage.removeItem(STORE);
    }
  };

  return (
    <>
      <canvas id="spray-canvas" ref={canvasRef} aria-label="spray wall" />
      <div className="spray-tools" role="toolbar" aria-label="spray tools">
        {colors.map((c) => (
          <button
            key={c}
            className="spray-swatch"
            style={{ background: c }}
            aria-pressed={color === c}
            aria-label={`color ${c}`}
            onClick={() => setColor(c)}
          />
        ))}
        <button className="deck-btn" onClick={wipe} title="buff the wall">
          wipe
        </button>
        <button className="deck-btn" onClick={onClose} title="put the cap back on">
          done
        </button>
      </div>
    </>
  );
}
