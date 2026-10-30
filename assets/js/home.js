

const header = document.querySelector(".site-header");

function updateHeader() {
  header.classList.toggle(
    "is-visible",
    window.scrollY > 250
  );
}

window.addEventListener("scroll", updateHeader, { passive: true });

updateHeader();
