import { useEffect, useRef } from "react";
import "./matterdemo.css";

/**
 * JXN-001, demonstrated in place: a tiny screen plays ambient "content",
 * six zones sample it, six bulbs follow with a beat of lag — the actual
 * matterlights pipeline (screen → zones → lights), simulated in ~3KB.
 * The ceiling keeps up here.
 */

const ZONES = 6;
const LAG_FRAMES = 9; // the lights trail the screen, like real bulbs do

function zoneHue(zone: number, t: number): number {
  // two slow color fronts drifting across the screen
  const front1 = Math.sin(t * 0.00021 + zone * 0.9) * 70;
  const front2 = Math.sin(t * 0.00009 - zone * 0.55 + 2) * 50;
  return (t * 0.012 + zone * 14 + front1 + front2 + 360) % 360;
}

const zoneColor = (zone: number, t: number): string =>
  `hsl(${zoneHue(zone, t).toFixed(1)} 72% 58%)`;

export default function MatterDemo(): React.ReactElement {
  const screenRef = useRef<HTMLDivElement>(null);
  const bulbsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      // a single still frame: lit, but calm
      const t = 40000;
      if (screenRef.current) {
        const stops = Array.from({ length: ZONES }, (_, z) => zoneColor(z, t)).join(", ");
        screenRef.current.style.background = `linear-gradient(100deg, ${stops})`;
      }
      bulbsRef.current?.querySelectorAll<HTMLElement>(".md-bulb").forEach((b, z) => {
        const c = zoneColor(z, t);
        b.style.background = c;
        b.style.boxShadow = `0 0 14px 2px ${c}`;
      });
      return;
    }

    const history: string[][] = [];
    let raf = 0;
    let visible = true;

    const io = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? true;
    });
    if (screenRef.current) io.observe(screenRef.current);

    function frame(now: number): void {
      raf = requestAnimationFrame(frame);
      if (!visible) return;

      const colors = Array.from({ length: ZONES }, (_, z) => zoneColor(z, now));
      if (screenRef.current) {
        screenRef.current.style.background = `linear-gradient(100deg, ${colors.join(", ")})`;
      }

      history.push(colors);
      if (history.length > LAG_FRAMES) {
        const lagged = history.shift()!;
        bulbsRef.current?.querySelectorAll<HTMLElement>(".md-bulb").forEach((b, z) => {
          const c = lagged[z]!;
          b.style.background = c;
          b.style.boxShadow = `0 0 14px 2px ${c}`;
        });
      }
    }

    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, []);

  return (
    <figure className="md" aria-label="matterlights, simulated live">
      <div className="md-room">
        <div className="md-bulbs" ref={bulbsRef} aria-hidden="true">
          {Array.from({ length: ZONES }, (_, i) => (
            <span className="md-bulb" key={i} />
          ))}
        </div>
        <div className="md-screen" ref={screenRef} aria-hidden="true">
          <span className="md-zones">
            {Array.from({ length: ZONES }, (_, i) => (
              <i key={i} />
            ))}
          </span>
        </div>
      </div>
      <figcaption className="stamp">live sim · screen → zones → bulbs</figcaption>
    </figure>
  );
}
