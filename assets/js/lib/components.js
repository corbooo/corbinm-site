import { safeHTML, dateRange } from "./utils.js";

export function projectCardHTML(project, { mini = false, featuredBadge = false } = {}) {
  const badge = featuredBadge ? '<span class="badge">Featured</span>' : "";
  const tags = (project.tags || [])
    .map((tag) => `<span class="tag">${safeHTML(tag)}</span>`)
    .join("");

  const github = project.github
    ? `<a class="btn btn-primary" href="${safeHTML(project.github)}" target="_blank" rel="noopener">GitHub</a>`
    : "";

  const live = project.live
    ? `<a class="btn btn-quiet" href="${safeHTML(project.live)}" target="_blank" rel="noopener">Live</a>`
    : "";

  return `
    <article class="card ${mini ? "card-mini" : ""}">
      <div class="card-title-row">
        <h3 class="card-title">${safeHTML(project.title)}</h3>
        ${badge}
      </div>
      <p class="card-desc">${safeHTML(project.desc)}</p>
      <div class="tag-row">${tags}</div>
      <div class="actions">${github}${live}</div>
    </article>
  `;
}

export function workCardHTML(work) {
  const tags = (work.tags || [])
    .slice(0, 6)
    .map((tag) => `<span class="tag">${safeHTML(tag)}</span>`)
    .join("");

  const bullets = (work.highlights || [])
    .slice(0, 5)
    .map((item) => `<li>${safeHTML(item)}</li>`)
    .join("");

  const meta = [
    `<span>${safeHTML(dateRange(work.start, work.end))}</span>`,
    work.location ? `<span class="dot">${safeHTML(work.location)}</span>` : ""
  ].filter(Boolean).join("");

  return `
    <article class="card exp-card">
      <div class="card-title-row">
        <h3 class="card-title">${safeHTML(work.role)}</h3>
      </div>
      <p class="card-desc">${safeHTML(work.company)}</p>
      <div class="exp-meta">${meta}</div>
      ${tags ? `<div class="tag-row">${tags}</div>` : ""}
      ${bullets ? `<ul class="exp-bullets">${bullets}</ul>` : ""}
    </article>
  `;
}

export function educationCardHTML(education) {
  const meta = `${safeHTML(dateRange(education.start, education.end))}${education.status ? ` (${safeHTML(education.status)})` : ""}`;
  const coursework = (education.coursework || [])
    .slice(0, 12)
    .map((course) => `<span class="pill">${safeHTML(course)}</span>`)
    .join("");

  return `
    <article class="card exp-card">
      <div class="card-title-row">
        <h3 class="card-title">${safeHTML(education.school)}</h3>
      </div>
      <p class="card-desc">${safeHTML(education.degree)}</p>
      <div class="exp-meta"><span>${meta}</span></div>
      ${coursework ? `<div class="coursework">${coursework}</div>` : ""}
    </article>
  `;
}
