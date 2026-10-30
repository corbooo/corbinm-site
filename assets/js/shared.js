const yearElement = document.getElementById("year");

if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}

const revealElements = document.querySelectorAll(".scroll-reveal");

if (revealElements.length && "IntersectionObserver" in window && !matchMedia("(prefers-reduced-motion: reduce)").matches) {

  document.documentElement.classList.add("has-scroll-reveal");

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -48px 0px" });

  revealElements.forEach((element) => observer.observe(element));
}