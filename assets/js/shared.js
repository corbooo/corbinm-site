
const yearElement = document.getElementById("year");

if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}

const observer = "IntersectionObserver" in window &&
  !matchMedia("(prefers-reduced-motion: reduce)").matches
  ? new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -48px 0px" })
  : null;

export function observeReveals(elements) {
  if (!observer || !elements.length) return;

  document.documentElement.classList.add("has-scroll-reveal");
  elements.forEach((element) => observer.observe(element));
}

observeReveals(document.querySelectorAll(".scroll-reveal"));