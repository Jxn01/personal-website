/**
 * ASCII bonsai, grown from scratch (cbonsai-inspired, zero deps).
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
export const BONSAI_H = 18;

function mulberry32(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

interface Branch {
  x: number;
  y: number;
  dx: number;
  life: number;
  trunk: boolean;
}

/**
 * Grow a tree, yielding a snapshot grid after every growth step.
 * `steps` caps total growth — the age dial.
 */
export function* growBonsai(
  seed: number,
  steps: number,
): Generator<BonsaiGrid, BonsaiGrid> {
  const rand = mulberry32(seed);
  const grid: BonsaiGrid = Array.from({ length: BONSAI_H }, () =>
    Array.from({ length: BONSAI_W }, () => null),
  );

  const put = (x: number, y: number, ch: string, kind: BonsaiCell["kind"]): void => {
    const xi = Math.round(x);
    const yi = Math.round(y);
    if (xi < 0 || xi >= BONSAI_W || yi < 0 || yi >= BONSAI_H - 3) return;
    grid[yi]![xi] = { ch, kind };
  };

  // the pot — drawn first, the tree grows out of it
  const potY = BONSAI_H - 3;
  const potLeft = Math.floor(BONSAI_W / 2) - 12;
  const pot = [
    ":___________./~~~\\.___________:",
    " \\                           / ",
    "  (_)___________________(_)   ",
  ];
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

  const leafChars = ["&", "&", "%", "&"];
  const leafCluster = (x: number, y: number, size: number): void => {
    for (let i = 0; i < size; i++) {
      const dx = Math.round((rand() - 0.5) * 5);
      const dy = Math.round((rand() - 0.5) * 2.4);
      put(x + dx, y + dy, leafChars[Math.floor(rand() * leafChars.length)]!, "leaf");
    }
  };

  const branches: Branch[] = [
    { x: BONSAI_W / 2, y: potY - 1, dx: 0, life: Math.min(steps, 32), trunk: true },
  ];

  let grown = 0;
  while (branches.length > 0 && grown < steps) {
    // advance every living branch one cell
    for (let i = branches.length - 1; i >= 0; i--) {
      const b = branches[i]!;
      if (b.life <= 0) {
        // a finished limb crowns itself in leaves
        leafCluster(b.x, b.y, b.trunk ? 10 : 7);
        branches.splice(i, 1);
        continue;
      }

      // drift: trunks meander, branches reach sideways then curl up
      if (b.trunk) {
        b.dx += (rand() - 0.5) * 0.9;
        b.dx = Math.max(-1, Math.min(1, b.dx));
      } else {
        b.dx += (rand() - 0.5) * 0.5;
      }

      const stepX = Math.round(b.dx);
      b.x += stepX;
      b.y -= 1;
      b.life -= 1;

      const ch = b.trunk
        ? stepX === 0 ? "|" : stepX > 0 ? "\\" : "/"
        : stepX === 0 ? "|" : stepX > 0 ? "~" : "~";
      put(b.x, b.y, ch === "|" && !b.trunk ? "/" : ch, "trunk");

      // sprout: trunks shed side branches as they climb
      if (b.trunk && b.life > 3 && rand() < 0.38 && branches.length < 7) {
        branches.push({
          x: b.x,
          y: b.y,
          dx: rand() > 0.5 ? 1.6 : -1.6,
          life: 3 + Math.floor(rand() * 5),
          trunk: false,
        });
      }

      // young leaves along the way
      if (!b.trunk && rand() < 0.5) {
        leafCluster(b.x, b.y, 2);
      }
    }

    grown += 1;
    // snapshot — deep enough copy for rendering
    yield grid.map((row) => row.map((c) => (c ? { ...c } : null)));
  }

  // any survivors crown themselves
  for (const b of branches) leafCluster(b.x, b.y, b.trunk ? 10 : 6);
  return grid.map((row) => row.map((c) => (c ? { ...c } : null)));
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
    steps: Math.min(46, 10 + weeks),
  };
}
