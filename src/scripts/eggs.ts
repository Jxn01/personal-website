/**
 * The eggs. Weird, complex, fascinating — and never explained on the page.
 * Registry lives in docs/design.md. If you're reading this in the bundle:
 * yes, this is all of them. Probably.
 */

const html = document.documentElement;

/* — console liner notes ————————————————————————————————————————————————— */
const mono = "font-family:monospace";
console.log(
  "%cJXN-000%c — side %s\n%cproduced & engineered by Norbert Oláh\nno cookies · no trackers · no skill bars\n\n%cstdin is open. press ~",
  `${mono};color:#d8c08a;font-size:14px;letter-spacing:.2em`,
  `${mono};color:#8a8a93`,
  html.dataset.side ?? "A",
  `${mono};color:#8a8a93`,
  `${mono};color:#41ead4`,
);

/* — toast: deadpan feedback channel ————————————————————————————————————— */
let toastTimer = 0;
export function toast(msg: string): void {
  const el = document.getElementById("toast");
  if (!el) return;
  el.textContent = msg;
  el.classList.add("show");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => el.classList.remove("show"), 2400);
}

/* — needle up: blur the tab, lift the needle ———————————————————————————— */
const realTitle = document.title;
document.addEventListener("visibilitychange", () => {
  document.title = document.hidden ? "⏸ needle up — JXN-000" : realTitle;
});

/* — typed sequences: konami + "boombap" ————————————————————————————————— */
const KONAMI = [
  "ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown",
  "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight",
  "b", "a",
];
let kIdx = 0;

const POCKET = "boombap";
let pBuf = "";

const CAT = String.raw`
   /\_/\   ___
  ( o.o ) (_  \
   |_T_|    )  ) ~ meow.
  /     \  (  (
 (_(_)_(_)__)_)
`;

function degauss(): void {
  // CRT degauss wobble + the cat walks by. Some signals deserve it.
  html.classList.add("degauss");
  window.setTimeout(() => html.classList.remove("degauss"), 700);
  const cat = document.getElementById("cat-walk");
  if (cat && !cat.classList.contains("go")) {
    cat.textContent = CAT;
    cat.classList.add("go");
    cat.addEventListener("animationend", () => cat.classList.remove("go"), { once: true });
  }
}

function pocket(): void {
  // four beats of grain at exactly 90 BPM. you'll know.
  html.classList.add("pocket");
  toast("the pocket.");
  window.setTimeout(() => html.classList.remove("pocket"), 666 * 4 + 60);
}

document.addEventListener("keydown", (e) => {
  // never eat keystrokes meant for inputs
  const t = e.target as HTMLElement;
  if (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable) return;

  kIdx = e.key === KONAMI[kIdx] ? kIdx + 1 : e.key === KONAMI[0] ? 1 : 0;
  if (kIdx === KONAMI.length) {
    kIdx = 0;
    degauss();
  }

  if (e.key.length === 1) {
    pBuf = (pBuf + e.key.toLowerCase()).slice(-POCKET.length);
    if (pBuf === POCKET) {
      pBuf = "";
      pocket();
    }
  }
});
