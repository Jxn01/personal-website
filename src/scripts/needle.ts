/**
 * The needle drop. First visit per session: one typed catalog line, a
 * waveform draw, and the page resolves. ~1 second. Any input skips it.
 * Reduced motion never sees it (gated before paint in Base).
 *
 * ClientRouter-aware: runs the animation once per session on the first real
 * load; on soft navigations it only cleans up the fresh overlay markup.
 */
let played = false;

function needleDrop(): void {
  const html = document.documentElement;
  const needle = document.getElementById("needle");
  if (!needle) return;

  if (played || html.classList.contains("dropped")) {
    needle.remove();
    return;
  }
  played = true;

  const side = html.dataset.side === "B" ? "SIDE B" : "SIDE A";
  const line = `JXN-000 — ${side}`;
  const target = needle.querySelector<HTMLElement>(".nd-type");

  const finish = (): void => {
    sessionStorage.setItem("jxn.dropped", "1");
    needle.style.opacity = "0";
    window.setTimeout(() => {
      html.classList.add("dropped");
      needle.remove();
    }, 260);
    removeEventListener("keydown", finish);
    removeEventListener("pointerdown", finish);
  };

  addEventListener("keydown", finish, { once: true });
  addEventListener("pointerdown", finish, { once: true });

  needle.classList.add("play");
  let i = 0;
  const type = (): void => {
    if (!target || !needle.isConnected) return;
    target.textContent = line.slice(0, ++i);
    if (i < line.length) {
      window.setTimeout(type, 26);
    } else {
      window.setTimeout(finish, 520);
    }
  };
  window.setTimeout(type, 120);
}

needleDrop();
document.addEventListener("astro:page-load", needleDrop);
