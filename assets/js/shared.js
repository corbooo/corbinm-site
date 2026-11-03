export const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

const yearElement = document.getElementById("year");

if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}

const revealObserver = "IntersectionObserver" in window &&
  !reducedMotion.matches
  ? new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -48px 0px" })
  : null;

export function observeReveals(elements) {
  if (!revealObserver || !elements.length) return;

  document.documentElement.classList.add("has-scroll-reveal");
  elements.forEach((element) => revealObserver.observe(element));
}

observeReveals(document.querySelectorAll(".scroll-reveal"));

export async function loadData(name) {
  const response = await fetch(new URL(`../data/${name}.json`, import.meta.url));
  if (!response.ok) throw new Error(`Could not load ${name}.`);
  return response.json();
}

for (const dialog of document.querySelectorAll(".site-dialog")) {
  // Bounds keep clicks in the dialog's padding from being treated as backdrop clicks.
  dialog.addEventListener("click", (event) => {
    const rect = dialog.getBoundingClientRect();
    if (
      event.clientX < rect.left || event.clientX > rect.right ||
      event.clientY < rect.top || event.clientY > rect.bottom
    ) {
      dialog.close();
    }
  });
}
