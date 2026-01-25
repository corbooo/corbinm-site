async function loadMostUsedSkills(limit = 12) {
    const grid = document.getElementById("aboutSkillsGrid");
    if (!grid) return;

    const res = await fetch("../assets/data/projects.json", { cache: "no-store" });
    const projects = await res.json();

    const counts = new Map();

    (projects || []).forEach(p => {
    (p.tags || []).forEach(tag => {
        const t = String(tag).trim();
        if (!t) return;
        counts.set(t, (counts.get(t) || 0) + 1);
    });
    });

    const ranked = [...counts.entries()]
    .sort((a, b) => (b[1] - a[1]) || a[0].localeCompare(b[0]))
    .slice(0, limit)
    .map(([tag]) => tag);

    grid.innerHTML = ranked.map(t => `<span>${t}</span>`).join("");
}

loadMostUsedSkills(12).catch(console.error);