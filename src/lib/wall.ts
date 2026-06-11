/**
 * THE WALL — a document-anchored paint layer. The spray can draws onto it;
 * everyone scrolls past it. Paint lives in page coordinates (it stays where
 * you put it), persists in localStorage at half resolution, and survives
 * soft navigations because we re-hang the canvas after every swap.
 */

const STORE = "jxn.wall";
const ID = "jxn-wall";

let canvas: HTMLCanvasElement | null = null;

export function wallCanvas(): HTMLCanvasElement | null {
  return canvas;
}

function docHeight(): number {
  return Math.max(document.documentElement.scrollHeight, innerHeight);
}

/** Create (or re-hang) the wall over the current document and restore paint. */
export function mountWall(): void {
  const existing = document.getElementById(ID);
  if (existing instanceof HTMLCanvasElement && existing.isConnected) {
    canvas = existing;
    resizeWall();
    return;
  }

  canvas = document.createElement("canvas");
  canvas.id = ID;
  canvas.width = Math.max(1, document.documentElement.clientWidth);
  canvas.height = docHeight();
  canvas.setAttribute("aria-hidden", "true");
  document.body.appendChild(canvas);
  restore();
}

/** Keep the wall covering the document; preserve paint through resizes. */
export function resizeWall(): void {
  if (!canvas) return;
  const w = Math.max(1, document.documentElement.clientWidth);
  const h = docHeight();
  if (canvas.width === w && canvas.height === h) return;
  const keep = document.createElement("canvas");
  keep.width = canvas.width;
  keep.height = canvas.height;
  keep.getContext("2d")?.drawImage(canvas, 0, 0);
  canvas.width = w;
  canvas.height = h;
  // paint is top-left anchored — like paint
  canvas.getContext("2d")?.drawImage(keep, 0, 0);
}

export function saveWall(): void {
  if (!canvas) return;
  try {
    // half resolution keeps localStorage comfortable; spray forgives blur
    const half = document.createElement("canvas");
    half.width = Math.max(1, Math.floor(canvas.width / 2));
    half.height = Math.max(1, Math.floor(canvas.height / 2));
    half.getContext("2d")?.drawImage(canvas, 0, 0, half.width, half.height);
    localStorage.setItem(STORE, half.toDataURL("image/png"));
  } catch {
    /* a very large piece; the wall forgives */
  }
}

function restore(): void {
  const saved = localStorage.getItem(STORE);
  if (!saved || !canvas) return;
  const img = new Image();
  img.onload = () => {
    canvas
      ?.getContext("2d")
      ?.drawImage(img, 0, 0, img.width * 2, img.height * 2);
  };
  img.src = saved;
}

export function wipeWall(): void {
  if (!canvas) return;
  canvas.getContext("2d")?.clearRect(0, 0, canvas.width, canvas.height);
  localStorage.removeItem(STORE);
}

/** True if anything has ever been painted (cheap check). */
export function wallHasPaint(): boolean {
  return localStorage.getItem(STORE) !== null;
}
