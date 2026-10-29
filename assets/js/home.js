const revealElements = document.querySelectorAll(".home__reveal");

const reducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
);

if ("IntersectionObserver" in window && !reducedMotion.matches) {
  document.documentElement.classList.add("has-scroll-reveal");

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, {
    threshold: 0.12,
    rootMargin: "0px 0px -48px 0px"
  });

  revealElements.forEach((element) => observer.observe(element));
}

const header = document.querySelector(".site-header");

function updateHeader() {
  header.classList.toggle(
    "is-visible",
    window.scrollY > 250
  );
}

window.addEventListener("scroll", updateHeader, { passive: true });

updateHeader();
