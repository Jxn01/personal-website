/**
 * ASCII bonsai, grown from scratch (a faithful cbonsai-style port, zero deps).
 *
 * Deterministic: same seed → same tree. The /status tree is seeded by the
 * site's age in weeks, so it genuinely grows as the site lives. The terminal
 * `bonsai` command grows a random one on demand.
 */

export interface BonsaiCell {
  ch: string;
  kind: "trunk" | "leaf" | "pot";
}

export type BonsaiGrid = (BonsaiCell | null)[][];

export const BONSAI_W = 56;
export const BONSAI_H = 19;

function mulberry32(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type BranchType = "trunk" | "shootLeft" | "shootRight" | "dying";

interface Branch {
  x: number;
  y: number;
  type: BranchType;
  life: number;
  age: number;
}

/**
 * Grow a tree, yielding a snapshot grid after every growth tick.
 * `steps` caps trunk life — the age dial (sapling ≈ 12, mighty ≈ 40+).
 */
export function* growBonsai(
  seed: number,
  steps: number,
): Generator<BonsaiGrid, BonsaiGrid> {
  const rand = mulberry32(seed);
  const pick = <T,>(arr: T[]): T => arr[Math.floor(rand() * arr.length)]!;
  const grid: BonsaiGrid = Array.from({ length: BONSAI_H }, () =>
    Array.from({ length: BONSAI_W }, () => null),
  );

  const put = (
    x: number,
    y: number,
    ch: string,
    kind: BonsaiCell["kind"],
    overwrite = true,
  ): void => {
    const xi = Math.round(x);
    const yi = Math.round(y);
    if (xi < 1 || xi >= BONSAI_W - 1 || yi < 0 || yi >= BONSAI_H - 3) return;
    if (!overwrite && grid[yi]![xi]) return;
    // never let leaves eat wood — branches stay readable through the canopy
    if (kind === "leaf" && grid[yi]![xi]?.kind === "trunk") return;
    grid[yi]![xi] = { ch, kind };
  };

  // the pot — drawn first, the tree grows out of it
  const potY = BONSAI_H - 3;
  const pot = [
    ":___________./~~~\\.___________:",
    " \\                           / ",
    "  (_)___________________(_)   ",
  ];
  const potLeft = Math.floor((BONSAI_W - pot[0]!.length) / 2);
  pot.forEach((line, i) => {
    for (let j = 0; j < line.length; j++) {
      const ch = line[j]!;
      if (ch !== " ") {
        const xi = potLeft + j;
        const yi = potY + i;
        if (xi >= 0 && xi < BONSAI_W && yi < BONSAI_H) {
          grid[yi]![xi] = { ch, kind: "pot" };
        }
      }
    }
  });

  // a leaf tuft: dense core, soft edge — canopies, not confetti
  const tuft = (cx: number, cy: number, rx: number, ry: number): void => {
    for (let dy = -ry; dy <= ry; dy++) {
      for (let dx = -rx; dx <= rx; dx++) {
        const d = (dx * dx) / (rx * rx + 0.01) + (dy * dy) / (ry * ry + 0.01);
        if (d > 1) continue;
        const density = d < 0.45 ? 0.92 : 0.55;
        if (rand() < density) {
          put(cx + dx, cy + dy, rand() < 0.82 ? "&" : "%", "leaf", false);
        }
      }
    }
  };

  const maxShoots = Math.max(2, Math.floor(steps / 7));
  let shootsSpawned = 0;
  let nextShootSide: BranchType = rand() < 0.5 ? "shootLeft" : "shootRight";

  const branches: Branch[] = [
    { x: Math.floor(BONSAI_W / 2), y: potY - 1, type: "trunk", life: steps, age: 0 },
  ];

  // base flare: the trunk grips the pot
  put(branches[0]!.x - 1, potY - 1, "/", "trunk");
  put(branches[0]!.x, potY - 1, "|", "trunk");
  put(branches[0]!.x + 1, potY - 1, "\\", "trunk");

  const snapshot = (): BonsaiGrid =>
    grid.map((row) => row.map((c) => (c ? { ...c } : null)));

  while (branches.length > 0) {
    for (let i = branches.length - 1; i >= 0; i--) {
      const b = branches[i]!;
      b.life -= 1;
      b.age += 1;

      if (b.life <= 0) {
        // the limb crowns itself in foliage and rests
        if (b.type === "trunk" || b.type === "dying") {
          tuft(b.x, b.y - 1, 6, 2);
        } else {
          tuft(b.x, b.y, 4, 2);
        }
        branches.splice(i, 1);
        continue;
      }

      let dx = 0;
      let dy = 0;

      if (b.type === "trunk") {
        if (b.age <= 2) {
          // young trunk: straight and thick
          dx = 0;
          dy = -1;
        } else {
          dx = pick([-1, -1, 0, 0, 0, 1, 1]);
          dy = rand() < 0.9 ? -1 : 0;
        }
        // shed side branches on the way up
        if (
          b.age > 2 &&
          b.life > 4 &&
          shootsSpawned < maxShoots &&
          rand() < 0.42
        ) {
          branches.push({
            x: b.x,
            y: b.y,
            type: nextShootSide,
            life: 4 + Math.floor(rand() * Math.min(9, steps / 3)),
            age: 0,
          });
          nextShootSide = nextShootSide === "shootLeft" ? "shootRight" : "shootLeft";
          shootsSpawned += 1;
        }
        if (b.life < 4) b.type = "dying";
      } else if (b.type === "shootLeft" || b.type === "shootRight") {
        const out = b.type === "shootLeft" ? -1 : 1;
        dx = pick([out, out, out, 0]);
        dy = rand() < 0.35 ? -1 : 0;
        if (b.life < 3) b.type = "dying";
      } else {
        // dying: drift gently and leaf out as it goes
        dx = pick([-1, 0, 0, 1]);
        dy = rand() < 0.4 ? -1 : 0;
        tuft(b.x + dx, b.y + dy, 3, 1);
      }

      // clamp inside the frame, steer back toward center at the edges
      if (b.x + dx < 4) dx = 1;
      if (b.x + dx > BONSAI_W - 5) dx = -1;

      b.x += dx;
      b.y += dy;

      // wood characters follow the stroke direction
      let ch: string;
      if (b.type === "trunk" || b.type === "dying") {
        ch = dx === 0 ? "|" : dx < 0 ? "\\" : "/";
        if (dy === 0) ch = "~";
      } else {
        ch = dy < 0 ? (dx < 0 ? "\\" : dx > 0 ? "/" : "|") : "~";
      }
      put(b.x, b.y, ch, "trunk");

      // thick lower trunk: a second stroke of wood beside the spine
      if (b.type === "trunk" && b.age <= 3) {
        put(b.x - 1, b.y, "/", "trunk", false);
        put(b.x + 1, b.y, "\\", "trunk", false);
      }

      // young leaves sprout along living shoots
      if ((b.type === "shootLeft" || b.type === "shootRight") && rand() < 0.4) {
        put(b.x + pick([-1, 1]), b.y - 1, "&", "leaf", false);
      }
    }

    yield snapshot();
  }

  return snapshot();
}

/** Render a grid to HTML with register classes (caller provides CSS). */
export function bonsaiToHtml(grid: BonsaiGrid): string {
  return grid
    .map((row) =>
      row
        .map((cell) => {
          if (!cell) return " ";
          const cls =
            cell.kind === "leaf" ? "b-leaf" : cell.kind === "trunk" ? "b-trunk" : "b-pot";
          const ch = cell.ch === "&" ? "&amp;" : cell.ch === "<" ? "&lt;" : cell.ch;
          return `<span class="${cls}">${ch}</span>`;
        })
        .join(""),
    )
    .join("\n");
}

/** The /status tree: seeded + sized by the site's age. It grows. Really. */
export function ageBonsai(launchIso: string): { seed: number; steps: number } {
  const weeks = Math.max(
    0,
    Math.floor((Date.now() - new Date(launchIso).getTime()) / (7 * 24 * 3600 * 1000)),
  );
  return {
    // one tree per week of life — everyone sees the same tree this week
    seed: 0x4a584e + weeks,
    // sapling at launch, mighty around year two
    steps: Math.min(46, 14 + weeks),
  };
}
