import { loadProjects } from "./lib/data.js";
import { projectCardHTML } from "./lib/components.js";

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

const normalize = (value) => String(value || "").toLowerCase().trim();
const dateMs = (project) => {
  const parsed = Date.parse(project.date || "");
  return Number.isFinite(parsed) ? parsed : 0;
};

function computeSkills(projects) {
  return [...new Set(projects.flatMap((project) => project.tags || []))]
    .sort((a, b) => a.localeCompare(b));
}

function renderSkillDropdown(skills) {
  if (!els.panel) return;
  els.panel.innerHTML = "";

  skills.forEach((skill) => {
    const row = document.createElement("label");
    row.className = "projects__skill-item";
    row.innerHTML = `
      <input type="checkbox" value="${skill}">
      <span>${skill}</span>
    `;

    row.querySelector("input").addEventListener("change", (event) => {
      if (event.target.checked) state.selectedSkills.add(skill);
      else state.selectedSkills.delete(skill);
      renderAll();
    });

    els.panel.appendChild(row);
  });
}

function matchesProject(project) {
  const query = normalize(state.query);
  const title = normalize(project.title);
  const desc = normalize(project.desc);
  const tags = normalize((project.tags || []).join(" "));

  const matchesSearch = !query || title.includes(query) || desc.includes(query) || tags.includes(query);
  if (!matchesSearch) return false;
  if (state.selectedSkills.size === 0) return true;

  return [...state.selectedSkills].some((skill) => tags.includes(normalize(skill)));
}

function sortProjects(projects) {
  if (state.sort === "newest") return [...projects].sort((a, b) => dateMs(b) - dateMs(a));
  if (state.sort === "oldest") return [...projects].sort((a, b) => dateMs(a) - dateMs(b));
  return projects;
}

function renderAll() {
  const filtered = state.projects.filter(matchesProject);
  const featured = filtered.filter((project) => project.tier === "featured");
  const mini = filtered.filter((project) => project.tier !== "featured");

  const visibleFeatured = state.sort === "featured" ? featured : sortProjects(featured);
  const visibleMini = state.sort === "featured" ? mini : sortProjects(mini);

  if (els.featuredGrid) {
    els.featuredGrid.innerHTML = visibleFeatured
      .map((project) => projectCardHTML(project, { featuredBadge: true }))
      .join("");
  }

  if (els.miniSlider) {
    els.miniSlider.innerHTML = visibleMini
      .map((project) => projectCardHTML(project, { mini: true }))
      .join("");
    els.miniSlider.scrollLeft = 0;
  }

  if (els.emptyState) {
    els.emptyState.hidden = (visibleFeatured.length + visibleMini.length) !== 0;
  }
}

function resetFilters() {
  state.query = "";
  state.selectedSkills.clear();
  state.sort = "featured";

  if (els.search) els.search.value = "";
  if (els.sort) els.sort.value = "featured";
  document.querySelectorAll("#skillPanel input[type='checkbox']").forEach((checkbox) => {
    checkbox.checked = false;
  });

  renderAll();
}

function scrollMiniProjects(direction) {
  if (!els.miniSlider) return;
  const firstCard = els.miniSlider.querySelector(".projects__card--mini");
  const amount = firstCard ? firstCard.getBoundingClientRect().width + 16 : 360;
  els.miniSlider.scrollBy({ left: direction * amount, behavior: "smooth" });
}

function wireUI() {
  document.addEventListener("click", (event) => {
    if (els.dropdown && !els.dropdown.contains(event.target)) {
      els.dropdown.removeAttribute("open");
    }
  });

  els.search?.addEventListener("input", (event) => {
    state.query = event.target.value || "";
    renderAll();
  });

  els.sort?.addEventListener("change", (event) => {
    state.sort = event.target.value;
    renderAll();
  });

  els.clear?.addEventListener("click", resetFilters);
  els.prev?.addEventListener("click", () => scrollMiniProjects(-1));
  els.next?.addEventListener("click", () => scrollMiniProjects(1));
}

async function init() {
  wireUI();
  const rawProjects = await loadProjects("..");
  state.projects = (rawProjects || []).map((project) => ({
    id: project.id || "",
    title: project.title || "",
    desc: project.desc || "",
    tier: project.tier === "featured" ? "featured" : "mini",
    date: project.date || "",
    tags: Array.isArray(project.tags) ? project.tags : [],
    github: project.github || null,
    live: project.live || null
  }));

  renderSkillDropdown(computeSkills(state.projects));
  renderAll();
}

init().catch((error) => {
  console.error(error);
  if (els.featuredGrid) els.featuredGrid.innerHTML = "<p>Could not load projects data.</p>";
});
