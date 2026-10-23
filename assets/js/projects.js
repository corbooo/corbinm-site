import { projectCardHTML } from "./lib/components.js";
import { loadProjects } from "./lib/data.js";
import { safeHTML, uniqueSorted } from "./lib/utils.js";

const els = {
  dropdown: document.getElementById("skillDropdown"),
  panel: document.getElementById("skillPanel"),
  search: document.getElementById("projectSearch"),
  sort: document.getElementById("projectSort"),
  clear: document.getElementById("clearFilters"),
  featuredGrid: document.getElementById("featuredGrid"),
  miniSlider: document.getElementById("miniSlider"),
  emptyState: document.getElementById("emptyState"),
  prev: document.getElementById("miniPrev"),
  next: document.getElementById("miniNext")
};

const state = {
  query: "",
  selectedSkills: new Set(),
  sort: "featured",
  projects: []
};

const normalize = (value) => String(value ?? "").trim().toLowerCase();
const projectDate = (project) => Date.parse(project.date || "") || 0;

function matchesProject(project) {
  const query = normalize(state.query);
  const searchable = [project.title, project.desc, (project.tags || []).join(" ")]
    .map(normalize);

  if (query && !searchable.some((value) => value.includes(query))) return false;
  if (!state.selectedSkills.size) return true;

  const tags = (project.tags || []).map(normalize);
  return [...state.selectedSkills].some((skill) => tags.includes(normalize(skill)));
}

function sortProjects(projects) {
  if (state.sort === "featured") return projects;
  const direction = state.sort === "newest" ? -1 : 1;
  return [...projects].sort((a, b) => direction * (projectDate(a) - projectDate(b)));
}

function renderAll() {
  const filtered = state.projects.filter(matchesProject);
  const featured = sortProjects(filtered.filter((project) => project.tier === "featured"));
  const mini = sortProjects(filtered.filter((project) => project.tier !== "featured"));

  els.featuredGrid.innerHTML = featured
    .map((project) => projectCardHTML(project, { featuredBadge: true }))
    .join("");

  els.miniSlider.innerHTML = mini
    .map((project) => projectCardHTML(project, { mini: true }))
    .join("");

  els.miniSlider.scrollLeft = 0;
  els.emptyState.hidden = filtered.length > 0;
}

function renderSkillDropdown(projects) {
  const skills = uniqueSorted(projects.flatMap((project) => project.tags || []));
  els.panel.innerHTML = skills.map((skill) => `
    <label class="projects__skill-item">
      <input type="checkbox" value="${safeHTML(skill)}">
      <span>${safeHTML(skill)}</span>
    </label>
  `).join("");
}

function resetFilters() {
  state.query = "";
  state.selectedSkills.clear();
  state.sort = "featured";
  els.search.value = "";
  els.sort.value = "featured";
  els.panel.querySelectorAll("input:checked").forEach((input) => {
    input.checked = false;
  });
  renderAll();
}

function scrollMiniProjects(direction) {
  const firstCard = els.miniSlider.querySelector(".projects__card--mini");
  const amount = firstCard ? firstCard.getBoundingClientRect().width + 16 : 360;
  els.miniSlider.scrollBy({ left: direction * amount, behavior: "smooth" });
}

function wireUI() {
  document.addEventListener("click", (event) => {
    if (!els.dropdown.contains(event.target)) els.dropdown.open = false;
  });

  // Event delegation: one listener handles every skill checkbox.
  els.panel.addEventListener("change", (event) => {
    if (!event.target.matches('input[type="checkbox"]')) return;
    const skill = event.target.value;
    if (event.target.checked) state.selectedSkills.add(skill);
    else state.selectedSkills.delete(skill);
    renderAll();
  });

  els.search.addEventListener("input", (event) => {
    state.query = event.target.value;
    renderAll();
  });

  els.sort.addEventListener("change", (event) => {
    state.sort = event.target.value;
    renderAll();
  });

  els.clear.addEventListener("click", resetFilters);
  els.prev.addEventListener("click", () => scrollMiniProjects(-1));
  els.next.addEventListener("click", () => scrollMiniProjects(1));
}

async function init() {
  wireUI();
  state.projects = await loadProjects("..");
  renderSkillDropdown(state.projects);
  renderAll();
}

init().catch((error) => {
  console.error(error);
  els.featuredGrid.innerHTML = "<p>Could not load projects data.</p>";
});
