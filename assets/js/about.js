import { loadProjects } from "./lib/data.js";

async function loadMostUsedSkills(limit = 12) {
  const grid = document.getElementById("aboutSkillsGrid");
  if (!grid) return;

  const projects = await loadProjects("..");
  const counts = new Map();

  (projects || []).forEach((project) => {
    (project.tags || []).forEach((tag) => {
      const value = String(tag).trim();
      if (!value) return;
      counts.set(value, (counts.get(value) || 0) + 1);
    });
  });

  const ranked = [...counts.entries()]
    .sort((a, b) => (b[1] - a[1]) || a[0].localeCompare(b[0]))
    .slice(0, limit)
    .map(([tag]) => tag);

  grid.innerHTML = ranked.map((tag) => `<span class="skills-cluster__item">${tag}</span>`).join("");
}

loadMostUsedSkills(12).catch(console.error);
