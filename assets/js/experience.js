
const template = document.getElementById("experience-milestone-template");

function formatDate(value) {
  if (value === "present") return "Present";

  const [year, month] = value.split("-");
  return new Date(year, month - 1).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric"
  });
}

async function loadTimeline(type) {
  const list = document.getElementById(`experience-${type}`);
  const response = await fetch(`../assets/data/${type}.json`);

  if (!response.ok) throw new Error(`Could not load ${type}.`);

  const entries = await response.json();

  const items = entries
    .sort((a, b) => b.start.localeCompare(a.start))
    .map((entry) => {
      const item = template.content.firstElementChild.cloneNode(true);

      item.querySelector(".experience__milestone-title").textContent = entry.school ?? entry.company;
      item.querySelector(".experience__milestone-detail").textContent = entry.degree ?? entry.role;
      item.querySelector(".experience__milestone-date").textContent =
        `${formatDate(entry.start)} – ${formatDate(entry.end)}${entry.status === "expected" ? " (Expected)" : ""}`;

      return item;
    });

  list.replaceChildren(...items);
}

for (const type of ["education", "work"]) {
  loadTimeline(type).catch((error) => {
    console.error(error);
    document.getElementById(`experience-${type}`).textContent = "Could not load timeline.";
  });
}