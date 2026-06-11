/**
 * The eggs that stay eggs. The big toys moved into the deck (bottom right,
 * clearly labeled — discoverability beats mystique). What remains here are
 * the bonuses for people who type at websites.
 */

const html = document.documentElement;

/* — console liner notes ————————————————————————————————————————————————— */
const mono = "font-family:monospace";
console.log(
  "%cJXN-000%c — side %s\n%cproduced & engineered by Norbert Oláh\nno cookies · no trackers · no skill bars\n\n%cthe toys are in the deck, bottom right. the terminal also answers to ~",
  `${mono};color:#d8c08a;font-size:14px;letter-spacing:.2em`,
  `${mono};color:#a39c92`,
  html.dataset.side ?? "A",
  `${mono};color:#a39c92`,
  `${mono};color:#e887ab`,
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
let realTitle = document.title;
document.addEventListener("astro:page-load", () => {
  realTitle = document.title;
});
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    realTitle = document.title;
    document.title = "⏸ needle up — JXN-000";
  } else {
    document.title = realTitle;
  }
});

/* — in-page bindings (re-armed after every soft navigation) ————————————— */
function bindPage(): void {
  // header status link opens the modal instead of navigating
  document.querySelectorAll<HTMLAnchorElement>("a.js-status").forEach((a) => {
    if (a.dataset.bound) return;
    a.dataset.bound = "1";
    a.addEventListener("click", (e) => {
      e.preventDefault();
      dispatchEvent(new CustomEvent("jxn:overlay", { detail: "status" }));
    });
  });

  // contact: [ sudo hire-me ] opens the terminal and types for you
  document.querySelectorAll<HTMLButtonElement>(".js-hire").forEach((b) => {
    if (b.dataset.bound) return;
    b.dataset.bound = "1";
    b.addEventListener("click", () => {
      dispatchEvent(new CustomEvent("jxn:term-run", { detail: "sudo hire-me" }));
    });
  });

  // the souls card: go on. touch it.
  document.querySelectorAll<HTMLElement>('[data-egg="souls"]').forEach((card) => {
    if (card.dataset.bound) return;
    card.dataset.bound = "1";
    card.addEventListener("click", () => {
      let died = document.getElementById("youdied");
      if (!died) {
        died = document.createElement("div");
        died.id = "youdied";
        died.setAttribute("aria-hidden", "true");
        died.innerHTML = "<span>YOU DIED</span>";
        document.body.appendChild(died);
      }
      died.classList.remove("show");
      void died.offsetWidth; // restart the animation
      died.classList.add("show");
    });
  });

  // the d20: chaotic neutral, like the gnome
  document.querySelectorAll<HTMLButtonElement>(".js-d20").forEach((btn) => {
    if (btn.dataset.bound) return;
    btn.dataset.bound = "1";
    const label = btn.textContent ?? "roll d20";
    btn.addEventListener("click", () => {
      if (btn.classList.contains("rolling")) return;
      btn.classList.add("rolling");
      let ticks = 0;
      const spin = window.setInterval(() => {
        btn.textContent = String(1 + Math.floor(Math.random() * 20));
        ticks += 1;
        if (ticks >= 9) {
          window.clearInterval(spin);
          const roll = 1 + Math.floor(Math.random() * 20);
          btn.textContent = `${label} → ${roll}`;
          btn.classList.remove("rolling");
          if (roll === 20) {
            degauss();
            toast("natural 20. gloria approves.");
          } else if (roll === 1) {
            toast("critical miss. gloria misfires.");
          }
        }
      }, 70);
    });
  });
}
bindPage();
document.addEventListener("astro:page-load", bindPage);

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
