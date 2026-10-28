
const chapters = document.querySelectorAll(".about__chapter");

chapters.forEach((chapter) => {
  const button = chapter.querySelector(".about__chapter-toggle");

  chapter.addEventListener("click", () => {
    const shouldOpen = !chapter.classList.contains("is-open");

    chapters.forEach((item) => {
      const isOpen = shouldOpen && item === chapter;

      item.classList.toggle("is-open", isOpen);

      item.querySelector(".about__chapter-toggle")
        .setAttribute("aria-expanded", String(isOpen));
    });
  });
});

/* Scroll-drawn signature */

const signature = document.querySelector(".about__closing-line");

if (signature) {
  const stroke = signature.querySelector(".about__closing-stroke");
  const dot = signature.querySelector(".about__closing-dot");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  function updateSignature() {
    if (reducedMotion.matches) {
      signature.classList.remove("is-animating");
      stroke.style.strokeDashoffset = "";
      dot.style.opacity = "";
      return;
    }

    signature.classList.add("is-animating");

    const top = signature.getBoundingClientRect().top;
    const height = window.innerHeight;

    const start = height * 0.80;
    const end = height * 0.50;

    const progress = Math.max(0, Math.min(1,
      (start - top) / (start - end)
    ));

    stroke.style.strokeDashoffset = 100 * (1 - progress);

    dot.style.opacity = Math.max(0, Math.min(1,
      (progress - 0.45) / 0.1
    ));
  }

  window.addEventListener("scroll", updateSignature, { passive: true });
  window.addEventListener("resize", updateSignature);
  reducedMotion.addEventListener("change", updateSignature);

  updateSignature();
}
