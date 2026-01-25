

console.log("home.js loaded", {
  readyState: document.readyState,
  featuredGrid: !!document.getElementById("homeFeaturedGrid"),
  skillsGrid: !!document.getElementById("skillsGrid"),
});

const grid = document.getElementById("homeFeaturedGrid");
const DATA_URL = "assets/data/projects.json";

function cardHTML(p) {
    const tagPills = (p.tags || []).slice(0, 5).map(t => `<span class="tag">${t}</span>`).join("");
    const githubBtn = p.github
    ? `<a class="btn btn-primary" href="${p.github}" target="_blank" rel="noopener">GitHub</a>`
    : "";
    const liveBtn = p.live
    ? `<a class="btn btn-quiet" href="${p.live}" target="_blank" rel="noopener">Live</a>`
    : "";

    return `
    <article class="card">
        <div class="card-title-row">
        <h3 class="card-title">${p.title || ""}</h3>
        <span class="badge">Featured</span>
        </div>
        <p class="card-desc">${p.desc || ""}</p>
        <div class="tag-row">${tagPills}</div>
        <div class="actions">${githubBtn}${liveBtn}</div>
    </article>
    `;
}

async function initFeatured() {
    const res = await fetch(DATA_URL, { cache: "no-store" });
    const projects = await res.json();
    const featured = (projects || []).filter(p => p.tier === "featured");
    grid.innerHTML = featured.map(cardHTML).join("");
}

initFeatured().catch(() => {
    grid.innerHTML = "<p>Could not load featured projects.</p>";
});

async function loadSkillsFromProjects() {
    const grid = document.getElementById("skillsGrid");
    if (!grid) return;

    const res = await fetch("assets/data/projects.json", { cache: "no-store" });
    const projects = await res.json();

    const set = new Set();
    (projects || []).forEach(p => (p.tags || []).forEach(t => set.add(t)));

    // sort alphabetically
    const skills = [...set].sort((a, b) => a.localeCompare(b));

    const PRIORITY = ["Python","FastAPI","SQL","SQLite","APIs","Java","HTML","CSS","JavaScript"];
    const prioritized = [
    ...PRIORITY.filter(x => skills.includes(x)),
    ...skills.filter(x => !PRIORITY.includes(x))
    ];
    const finalSkills = prioritized.slice(0,14);

    grid.innerHTML = finalSkills.map(s => `<span>${s}</span>`).join("");
}

loadSkillsFromProjects().catch(console.error);