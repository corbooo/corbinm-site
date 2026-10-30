
const template = document.getElementById("experience-milestone-template");

function formatDate(value) {
  if (value === "present") return "Present";

  const [year, month] = value.split("-");
  return new Date(year, month - 1).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric"
  });
}

function drawTimeline(list) {
  const bounds = list.getBoundingClientRect();

  const points = [...list.querySelectorAll(".experience__marker")].map((marker) => {
    const rect = marker.getBoundingClientRect();
    return [
      rect.left + rect.width / 2 - bounds.left,
      rect.top + rect.height / 2 - bounds.top
    ];
  });

  if (!points.length) return;

  const [firstX, firstY] = points[0];
  let path = `M ${firstX} ${firstY - 40} L ${firstX} ${firstY}`;

  for (let i = 1; i < points.length; i++) {
    const [x1, y1] = points[i - 1];
    const [x2, y2] = points[i];
    const middle = (y1 + y2) / 2;

    path += ` C ${x1} ${middle} ${x2} ${middle} ${x2} ${y2}`;
  }

  const [lastX, lastY] = points.at(-1);
  path += ` L ${lastX} ${lastY + 40}`;

  const svg = list.previousElementSibling;
  svg.setAttribute("viewBox", `0 0 ${bounds.width} ${bounds.height}`);
  svg.querySelector("path").setAttribute("d", path);
}

async function loadTimeline(type) {
  const list = document.getElementById(`experience-${type}`);
  const response = await fetch(`../assets/data/${type}.json`);

  if (!response.ok) throw new Error(`Could not load ${type}.`);

  const entries = await response.json();

  const items = entries
    .sort((a, b) => b.start.localeCompare(a.start))
    .map((entry, index) => {
      const item = template.content.firstElementChild.cloneNode(true);
      item.style.setProperty("--progress", index / Math.max(entries.length - 1, 1));

      item.querySelector(".experience__milestone-title").textContent = entry.school ?? entry.company;
      item.querySelector(".experience__milestone-detail").textContent = entry.degree ?? entry.role;
      item.querySelector(".experience__milestone-date").textContent =
        `${formatDate(entry.start)} – ${formatDate(entry.end)}${entry.status === "expected" ? " (Expected)" : ""}`;

      return item;
    });

  list.replaceChildren(...items);
  drawTimeline(list);
}

for (const type of ["education", "work"]) {
  loadTimeline(type).catch((error) => {
    console.error(error);
    document.getElementById(`experience-${type}`).textContent = "Could not load timeline.";
  });
}

window.addEventListener("resize", () => {
  document.querySelectorAll(".experience__timeline").forEach((list) => {
    if (list.children.length) drawTimeline(list);
  });
});