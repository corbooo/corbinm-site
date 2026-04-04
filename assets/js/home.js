import { loadProjects } from "./lib/data.js";
import { projectCardHTML } from "./lib/components.js";
import { uniqueSorted, sortByPriority } from "./lib/utils.js";

const featuredGrid = document.getElementById("homeFeaturedGrid");
const skillsGrid = document.getElementById("skillsGrid");
const PRIORITY_SKILLS = ["Python", "FastAPI", "SQL", "SQLite", "APIs", "Java", "HTML", "CSS", "JavaScript"];

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

renderSkills().catch(console.error);
