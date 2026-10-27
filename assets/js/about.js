
const chapters = document.querySelectorAll(".about__chapter");

chapters.forEach((chapter) => {
  const button = chapter.querySelector(".about__chapter-toggle");

  button.addEventListener("click", () => {
    const shouldOpen = !chapter.classList.contains("is-open");

    chapters.forEach((item) => {
      const isOpen = shouldOpen && item === chapter;

      item.classList.toggle("is-open", isOpen);

      item.querySelector(".about__chapter-toggle")
        .setAttribute("aria-expanded", String(isOpen));
    });
  });
});