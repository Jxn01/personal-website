/**
 * Resolve a CSS custom property to an actual rgb() string the canvas can eat.
 * getComputedStyle().getPropertyValue() returns unevaluated var()/color-mix()
 * soup for unregistered properties — so we let the engine resolve it through
 * a probe element's color.
 */
export function resolveColor(cssVar: string): string {
  const probe = document.createElement("i");
  probe.style.color = `var(${cssVar})`;
  probe.style.display = "none";
  document.body.appendChild(probe);
  const rgb = getComputedStyle(probe).color;
  probe.remove();
  return rgb || "#ffffff";
}

/** Mix two resolved rgb() strings (t=0 → a, t=1 → b). */
export function mixRgb(a: string, b: string, t: number): string {
  const pa = a.match(/[\d.]+/g)?.map(Number) ?? [255, 255, 255];
  const pb = b.match(/[\d.]+/g)?.map(Number) ?? [0, 0, 0];
  const m = pa.map((v, i) => Math.round(v + ((pb[i] ?? 0) - v) * t));
  return `rgb(${m[0]}, ${m[1]}, ${m[2]})`;
}
