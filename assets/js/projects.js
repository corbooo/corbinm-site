document.getElementById("year").textContent = new Date().getFullYear();

document.addEventListener("click", (e) => {
    const dd = document.getElementById("skillDropdown");
    if (!dd) return;
    if (!dd.contains(e.target)) dd.removeAttribute("open");
});

const DATA_URL = "../assets/data/projects.json";

const els = {
    search: document.getElementById("projectSearch"),
    sort: document.getElementById("projectSort"),
    chipRow: document.getElementById("chipRow"),
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

const norm = (s) => (s || "").toLowerCase().trim();

function dateMs(p) {
    const t = Date.parse(p.date || "");
    return Number.isFinite(t) ? t : 0;
}

function computeSkills(projects) {
    const set = new Set();
    for (const p of projects) {
    for (const t of (p.tags || [])) set.add(t);
    }
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

    const checkbox = row.querySelector("input");
    checkbox.addEventListener("change", () => {
        if (checkbox.checked) state.skills.add(skill);
        else state.skills.delete(skill);
        renderAll();
    });

    panel.appendChild(row);
    });
}

function projectMatches(p) {
    const q = norm(state.q);
    const title = norm(p.title);
    const desc = norm(p.desc);
    const tags = norm((p.tags || []).join(" "));

    const searchOk = !q || title.includes(q) || desc.includes(q) || tags.includes(q);
    if (!searchOk) return false;

    if (state.skills.size === 0) return true;

    // OR match across selected skills
    for (const s of state.skills) {
    if (tags.includes(norm(s))) return true;
    }
    return false;
}

function sortProjects(list) {
    if (state.sort === "newest") return [...list].sort((a, b) => dateMs(b) - dateMs(a));
    if (state.sort === "oldest") return [...list].sort((a, b) => dateMs(a) - dateMs(b));
    // featured: keep JSON order
    return list;
}

function cardHTML(p, isMini) {
    const badge = p.tier === "featured" ? `<span class="badge">Featured</span>` : "";
    const pills = (p.tags || []).map(t => `<span class="tag">${t}</span>`).join("");

    const github = p.github
    ? `<a class="btn btn-primary" href="${p.github}" target="_blank" rel="noopener">GitHub</a>`
    : "";

    const live = p.live
    ? `<a class="btn btn-quiet" href="${p.live}" target="_blank" rel="noopener">Live</a>`
    : "";

    return `
    <article class="card ${isMini ? "card-mini" : ""}">
        <div class="card-title-row">
        <h3 class="card-title">${p.title}</h3>
        ${badge}
        </div>
        <p class="card-desc">${p.desc}</p>
        <div class="tag-row">${pills}</div>
        <div class="actions">${github}${live}</div>
    </article>
    `;
}

function renderAll() {
    const filtered = state.projects.filter(projectMatches);

    const featured = filtered.filter(p => p.tier === "featured");
    const mini = filtered.filter(p => p.tier !== "featured");

    const featuredSorted = state.sort === "featured" ? featured : sortProjects(featured);
    const miniSorted = state.sort === "featured" ? mini : sortProjects(mini);

    els.featuredGrid.innerHTML = featuredSorted.map(p => cardHTML(p, false)).join("");
    els.miniSlider.innerHTML = miniSorted.map(p => cardHTML(p, true)).join("");

    const visibleCount = featuredSorted.length + miniSorted.length;
    els.emptyState.hidden = visibleCount !== 0;

    els.miniSlider.scrollLeft = 0;
}

function wireUI() {
    els.search.addEventListener("input", (e) => {
    state.q = e.target.value || "";
    renderAll();
    });

    els.sort.addEventListener("change", (e) => {
    state.sort = e.target.value;
    renderAll();
    });

    els.clear.addEventListener("click", () => {
    // reset state
    state.q = "";
    state.skills.clear();
    state.sort = "featured";

    // reset inputs
    els.search.value = "";
    els.sort.value = "featured";

    // reset skill checkboxes
    document
        .querySelectorAll("#skillPanel input[type='checkbox']")
        .forEach(cb => (cb.checked = false));

    renderAll();
    });

    const scrollByCard = (dir) => {
    const first = els.miniSlider.querySelector(".card-mini");
    const amount = first ? (first.getBoundingClientRect().width + 16) : 360;
    els.miniSlider.scrollBy({ left: dir * amount, behavior: "smooth" });
    };

    els.prev.addEventListener("click", () => scrollByCard(-1));
    els.next.addEventListener("click", () => scrollByCard(1));
}

async function init() {
    wireUI();

    const res = await fetch(DATA_URL, { cache: "no-store" });
    const raw = await res.json();

    state.projects = (raw || []).map(p => ({
    id: p.id || "",
    title: p.title || "",
    desc: p.desc || "",
    tier: p.tier === "featured" ? "featured" : "mini",
    date: p.date || "",
    tags: Array.isArray(p.tags) ? p.tags : [],
    github: p.github || null,
    live: p.live || null
    }));

    state.allSkills = computeSkills(state.projects);
    renderSkillDropdown(state.allSkills);
    renderAll();
}

init().catch(err => {
    console.error(err);
    els.featuredGrid.innerHTML = "<p>Could not load projects data.</p>";
});