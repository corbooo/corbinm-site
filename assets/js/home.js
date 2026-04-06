import { loadProjects } from "./lib/data.js";
import { projectCardHTML } from "./lib/components.js";
import { uniqueSorted, sortByPriority } from "./lib/utils.js";

const featuredGrid = document.getElementById("homeFeaturedGrid");
const skillsGrid = document.getElementById("skillsGrid");
const PRIORITY_SKILLS = ["Python", "FastAPI", "SQL", "SQLite", "APIs", "Java", "HTML", "CSS", "JavaScript"];
const heroLogo = document.getElementById("heroLogo");
const navLogo = document.getElementById("navLogo");
const floatingLogo = document.getElementById("floatingLogo");

const SCROLL_START = 100;
const SCROLL_RANGE = 200;

function positionFloatingLogoOverHero() {
  if (!heroLogo || !floatingLogo) return;

  const heroRect = heroLogo.getBoundingClientRect();

  floatingLogo.style.top = `${heroRect.top}px`;
  floatingLogo.style.left = `${heroRect.left + heroRect.width / 2}px`;
  floatingLogo.style.width = `${heroRect.width}px`;
}

function updateFloatingLogoVisibility() {
  if (!heroLogo || !floatingLogo) return;

  animateFloatingLogoOnScroll();

  if (window.scrollY > SCROLL_START) {
    heroLogo.classList.add("home__hero-logo--hidden");
  } else {
    heroLogo.classList.remove("home__hero-logo--hidden");
    floatingLogo.classList.remove("home__logo-float--visible");
    navLogo.classList.remove("site-nav__logo-image--visible");
  }
}

function animateFloatingLogoOnScroll() {
  if (!heroLogo || !navLogo || !floatingLogo) return;

  const heroRect = heroLogo.getBoundingClientRect();
  const navRect = navLogo.getBoundingClientRect();

  const startX = heroRect.left + heroRect.width / 2;
  const startY = heroRect.top + heroRect.height / 2;
  const startWidth = heroRect.width;

  const endX = navRect.left + navRect.width / 2;
  const endY = navRect.top + navRect.height / 2 + 5.5;
  const endWidth = navRect.width;

  const scrollProgress = Math.min(
    Math.max((window.scrollY - SCROLL_START) / SCROLL_RANGE, 0),
    1
  );

  const currentX = startX + (endX - startX) * scrollProgress;
  const currentY = startY + (endY - startY) * scrollProgress;
  const currentWidth = startWidth + (endWidth - startWidth) * scrollProgress;

  floatingLogo.style.left = `${currentX}px`;
  floatingLogo.style.top = `${currentY}px`;
  floatingLogo.style.width = `${currentWidth}px`;

  if (scrollProgress >= 0.98) {
    navLogo.classList.add("site-nav__logo-image--visible");
    floatingLogo.classList.remove("home__logo-float--visible");
  } else {
    navLogo.classList.remove("site-nav__logo-image--visible");

    if (window.scrollY > SCROLL_START) {
      floatingLogo.classList.add("home__logo-float--visible");
    }
  }
}

async function renderFeaturedProjects() {
  if (!featuredGrid) return;
  const projects = await loadProjects(".");
  const featured = (projects || []).filter((project) => project.tier === "featured");
  featuredGrid.innerHTML = featured
    .map((project) => projectCardHTML(project, { featuredBadge: true }))
    .join("");
}

async function renderSkills() {
  if (!skillsGrid) return;
  const projects = await loadProjects(".");
  const skills = uniqueSorted((projects || []).flatMap((project) => project.tags || []));
  const ordered = sortByPriority(skills, PRIORITY_SKILLS).slice(0, 14);
  skillsGrid.innerHTML = ordered.map((skill) => `<span class="skills-cluster__item">${skill}</span>`).join("");
}

renderFeaturedProjects().catch(() => {
  if (featuredGrid) featuredGrid.innerHTML = "<p>Could not load featured projects.</p>";
});

window.addEventListener("load", positionFloatingLogoOverHero);
window.addEventListener("resize", positionFloatingLogoOverHero);
window.addEventListener("scroll", updateFloatingLogoVisibility);
window.addEventListener("load", updateFloatingLogoVisibility);
window.addEventListener("scroll", animateFloatingLogoOnScroll);
window.addEventListener("load", animateFloatingLogoOnScroll);
window.addEventListener("resize", animateFloatingLogoOnScroll);

renderSkills().catch(console.error);
