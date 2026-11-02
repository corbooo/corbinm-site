
import { observeReveals } from "./shared.js";

const template = document.getElementById("experience-milestone-template");
const dialog = document.getElementById("experience-dialog");

const timelineObserver = "IntersectionObserver" in window &&
  !matchMedia("(prefers-reduced-motion: reduce)").matches
  ? new IntersectionObserver((entries, observer) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;

        const list = entry.target.parentElement;
        const path = list.previousElementSibling.querySelector(":scope > path");

        list.classList.add("is-drawn");

        path.addEventListener("transitionend", (event) => {
          if (event.propertyName === "stroke-dashoffset") {
            list.previousElementSibling.classList.add("is-complete");
          }
        }, { once: true });

        requestAnimationFrame(() => {
          path.style.strokeDashoffset = 0;
        });

        observer.unobserve(entry.target);
      }
    }, { rootMargin: "0px 0px -20% 0px" })
  : null;

function formatDate(value) {
  if (value === "present") return "Present";

  const [year, month] = value.split("-");
  return new Date(year, month - 1).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric"
  });
}

function openMilestone(type, entry, dates) {
  const education = type === "education";
  const details = (education ? entry.coursework : entry.highlights) ?? [];
  dialog.dataset.type = type;

  document.getElementById("experience-dialog-category").textContent = education ? "Education" : "Work Experience";
  document.getElementById("experience-dialog-title").textContent = entry.school ?? entry.company;
  document.getElementById("experience-dialog-subtitle").textContent = entry.degree ?? entry.role;
  document.getElementById("experience-dialog-date").textContent = dates;
  document.getElementById("experience-dialog-heading").textContent = education ? "Relevant Coursework" : "Highlights";

  const list = document.getElementById("experience-dialog-list");
  list.replaceChildren(...details.map((text) => {
    const item = document.createElement("li");
    item.textContent = text;
    return item;
  }));

  dialog.querySelector(".experience__dialog-details").hidden = !details.length;
  dialog.showModal();
}

dialog.addEventListener("click", (event) => {
  const rect = dialog.getBoundingClientRect();
  if (
    event.clientX < rect.left || event.clientX > rect.right ||
    event.clientY < rect.top || event.clientY > rect.bottom
  ) dialog.close();
});

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
  const endY = lastY + 40;

  path += ` L ${lastX} ${endY}`;

  const svg = list.previousElementSibling;
  svg.setAttribute("viewBox", `0 0 ${bounds.width} ${bounds.height}`);

  const timelinePath = svg.querySelector(":scope > path");
  timelinePath.setAttribute("d", path);

  svg.querySelector(".experience__timeline-arrow").setAttribute(
    "d",
    `M ${lastX - 6} ${endY - 8} L ${lastX} ${endY} L ${lastX + 6} ${endY - 8}`
  );

  if (timelineObserver) {
    const length = timelinePath.getTotalLength();
    timelinePath.style.strokeDasharray = length;
    timelinePath.style.strokeDashoffset = list.classList.contains("is-drawn") ? 0 : length;
  }
}

async function loadTimeline(type) {
  const list = document.getElementById(`experience-${type}`);
  const response = await fetch(`../assets/data/${type}.json`);
  if (!response.ok) throw new Error(`Could not load ${type}.`);

  const entries = await response.json();
  const items = entries
    .sort((a, b) => a.start.localeCompare(b.start))
    .map((entry, index) => {
      const item = template.content.firstElementChild.cloneNode(true);
      item.style.setProperty("--progress", index / Math.max(entries.length - 1, 1));
      item.querySelector(".experience__milestone-title").textContent = entry.school ?? entry.company;
      item.querySelector(".experience__milestone-detail").textContent = entry.degree ?? entry.role;

      const dates = `${formatDate(entry.start)} – ${formatDate(entry.end)}${entry.status === "expected" ? " (Expected)" : ""}`;
      item.querySelector(".experience__milestone-date").textContent = dates;

      const trigger = item.querySelector(".experience__milestone-trigger");
      trigger.setAttribute("aria-label", `View details for ${entry.school ?? entry.company}`);
      trigger.addEventListener("click", () => openMilestone(type, entry, dates));
      return item;
    });

  list.replaceChildren(...items);
  drawTimeline(list);

  if (timelineObserver && list.firstElementChild) {
    timelineObserver.observe(list.firstElementChild);
  }
}

async function loadSkills() {
  const response = await fetch("../assets/data/skills.json");
  if (!response.ok) throw new Error("Could not load skills.");

  const entries = await response.json();
  const skillTemplate = document.getElementById("experience-skill-template");
  const grid = document.getElementById("experience-skills");
  const groups = entries.map((entry, index) => {
    const group = skillTemplate.content.firstElementChild.cloneNode(true);
    group.classList.add(index % 2 === 0 ? "scroll-reveal--left" : "scroll-reveal--right");
    group.querySelector(".experience__skill-title").textContent = entry.category;
    group.querySelector(".experience__skill-list").textContent = entry.skills.join(" · ");
    return group;
  });

  grid.replaceChildren(...groups);
  observeReveals(groups);
}

loadSkills().catch((error) => {
  console.error(error);
  document.getElementById("experience-skills").textContent = "Could not load skills.";
});

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