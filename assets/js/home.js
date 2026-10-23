import { loadProjects } from "./lib/data.js";
import { projectCardHTML, skillPillsHTML } from "./lib/components.js";
import { uniqueSorted, sortByPriority } from "./lib/utils.js";

const featuredGrid = document.getElementById("homeFeaturedGrid");
const skillsGrid = document.getElementById("skillsGrid");

const PRIORITY_SKILLS = [ "Python", "FastAPI", "SQL", "SQLite", "APIs", "Java", "HTML", "CSS", "JavaScript"];

async function renderHomeContent() {
  const projects = await loadProjects(".");

  const featured = projects.filter((project) => project.tier === "featured");

  featuredGrid.innerHTML = featured.map((project) => projectCardHTML(project, { featuredBadge: true })).join("");

  const skills = uniqueSorted(projects.flatMap((project) => project.tags || []));

  const ordered = sortByPriority(skills, PRIORITY_SKILLS).slice(0, 14);

  skillsGrid.innerHTML = skillPillsHTML(ordered);
}

renderHomeContent().catch((error) => {
  console.error(error);
  featuredGrid.innerHTML = "<p>Could not load featured projects.</p>";
  skillsGrid.innerHTML = "<p>Could not load skills.</p>";
});
