
document.addEventListener("click", (e) => {
  const dd = document.getElementById("skillDropdown");
  if (dd && !dd.contains(e.target)) dd.removeAttribute("open");
});

const DATA_URL = "../assets/data/projects.json";

const els = {
  search: document.getElementById("projectSearch"),
  sort: document.getElementById("projectSort"),
  clear: document.getElementById("clearFilters"),
  featuredGrid: document.getElementById("featuredGrid"),
  miniSlider: document.getElementById("miniSlider"),
  emptyState: document.getElementById("emptyState"),
  prev: document.getElementById("miniPrev"),
  next: document.getElementById("miniNext"),
};

const state = {
  q: "",
  skills: new Set(),
  sort: "featured",
  projects: [],
  allSkills: []
};

const norm = s => (s || "").toLowerCase().trim();

const dateMs = p => {
  const t = Date.parse(p.date || "");
  return Number.isFinite(t) ? t : 0;
};

function computeSkills(projects) {
  const set = new Set();
  projects.forEach(p => (p.tags || []).forEach(t => set.add(t)));
  return [...set].sort((a, b) => a.localeCompare(b));
}

function renderSkillDropdown(skills) {
  const panel = document.getElementById("skillPanel");
  panel.innerHTML = "";

  skills.forEach(skill => {
    const row = document.createElement("label");
    row.className = "skill-item";
    row.innerHTML = `
      <input type="checkbox" value="${skill}">
      <span>${skill}</span>
    `;

    row.querySelector("input").addEventListener("change", (e) => {
      e.target.checked ? state.skills.add(skill) : state.skills.delete(skill);
      renderAll();
    });

    panel.appendChild(row);
  });
}

function projectMatches(p) {
  const q = norm(state.q);
  const tags = norm((p.tags || []).join(" "));

  if (q && !(
    norm(p.title).includes(q) ||
    norm(p.desc).includes(q) ||
    tags.includes(q)
  )) return false;

  if (state.skills.size === 0) return true;

  return [...state.skills].some(s => tags.includes(norm(s)));
}

function sortProjects(list) {
  if (state.sort === "newest") return [...list].sort((a,b)=>dateMs(b)-dateMs(a));
  if (state.sort === "oldest") return [...list].sort((a,b)=>dateMs(a)-dateMs(b));
  return list;
}

function cardHTML(p, isMini) {
  return `
    <article class="card ${isMini ? "card-mini" : ""}">
      <div class="card-title-row">
        <h3 class="card-title">${p.title}</h3>
        ${p.tier === "featured" ? `<span class="badge">Featured</span>` : ""}
      </div>
      <p class="card-desc">${p.desc}</p>
      <div class="tag-row">${(p.tags||[]).map(t=>`<span class="tag">${t}</span>`).join("")}</div>
      <div class="actions">
        ${p.github ? `<a class="btn btn-primary" href="${p.github}" target="_blank">GitHub</a>` : ""}
        ${p.live ? `<a class="btn btn-quiet" href="${p.live}" target="_blank">Live</a>` : ""}
      </div>
    </article>
  `;
}

function renderAll() {
  const filtered = state.projects.filter(projectMatches);

  const featured = filtered.filter(p => p.tier === "featured");
  const mini = filtered.filter(p => p.tier !== "featured");

  const f = state.sort === "featured" ? featured : sortProjects(featured);
  const m = state.sort === "featured" ? mini : sortProjects(mini);

  els.featuredGrid.innerHTML = f.map(p => cardHTML(p,false)).join("");
  els.miniSlider.innerHTML = m.map(p => cardHTML(p,true)).join("");

  els.emptyState.hidden = (f.length + m.length) !== 0;
  els.miniSlider.scrollLeft = 0;
}

function wireUI() {
  els.search.addEventListener("input", e => {
    state.q = e.target.value;
    renderAll();
  });

  els.sort.addEventListener("change", e => {
    state.sort = e.target.value;
    renderAll();
  });

  els.clear.addEventListener("click", () => {
    state.q = "";
    state.skills.clear();
    state.sort = "featured";

    els.search.value = "";
    els.sort.value = "featured";

    document.querySelectorAll("#skillPanel input").forEach(cb => cb.checked = false);

    renderAll();
  });

  const scroll = dir => {
    const card = els.miniSlider.querySelector(".card-mini");
    const width = card ? card.offsetWidth + 16 : 360;
    els.miniSlider.scrollBy({ left: dir * width, behavior: "smooth" });
  };

  els.prev.addEventListener("click", () => scroll(-1));
  els.next.addEventListener("click", () => scroll(1));
}

async function init() {
  wireUI();

  const res = await fetch(DATA_URL, { cache: "no-store" });
  const raw = await res.json();

  state.projects = (raw || []).map(p => ({
    title: p.title || "",
    desc: p.desc || "",
    tier: p.tier === "featured" ? "featured" : "mini",
    date: p.date || "",
    tags: p.tags || [],
    github: p.github || null,
    live: p.live || null
  }));

  state.allSkills = computeSkills(state.projects);
  renderSkillDropdown(state.allSkills);
  renderAll();
}

init().catch(err => {
  console.error(err);
  els.featuredGrid.innerHTML = "<p>Could not load projects.</p>";
});