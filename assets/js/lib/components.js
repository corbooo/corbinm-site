import { safeHTML, dateRange } from "./utils.js";

export function projectCardHTML(project, { mini = false, featuredBadge = false } = {}) {
  const badge = featuredBadge
    ? '<span class="badge badge--outline project-card__badge">Featured</span>'
    : "";

  const tags = (project.tags || [])
    .map((tag) => `<span class="tag">${safeHTML(tag)}</span>`)
    .join("");

  const github = project.github
    ? `<a class="button button--primary" href="${safeHTML(project.github)}" target="_blank" rel="noopener">GitHub</a>`
    : "";

  const live = project.live
    ? `<a class="button button--subtle" href="${safeHTML(project.live)}" target="_blank" rel="noopener">Live</a>`
    : "";

  return `
    <article class="content-card project-card ${mini ? "project-card--compact" : ""} ${featuredBadge ? "project-card--featured" : ""}">
      <div class="content-card__header">
        <h3 class="content-card__title">${safeHTML(project.title)}</h3>
        ${badge}
      </div>
      <p class="content-card__description">${safeHTML(project.desc)}</p>
      <div class="tag-list project-card__tags">${tags}</div>
      <div class="action-group">${github}${live}</div>
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
    work.location ? `<span class="experience-card__meta-separator">${safeHTML(work.location)}</span>` : ""
  ].filter(Boolean).join("");

  return `
    <article class="content-card experience-card">
      <div class="content-card__header">
        <h3 class="content-card__title">${safeHTML(work.role)}</h3>
      </div>
      <p class="content-card__description">${safeHTML(work.company)}</p>
      <div class="experience-card__meta">${meta}</div>
      ${tags ? `<div class="tag-list">${tags}</div>` : ""}
      ${bullets ? `<ul class="experience-card__bullets">${bullets}</ul>` : ""}
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
    <article class="content-card experience-card">
      <div class="content-card__header">
        <h3 class="content-card__title">${safeHTML(education.school)}</h3>
      </div>
      <p class="content-card__description">${safeHTML(education.degree)}</p>
      <div class="experience-card__meta"><span>${meta}</span></div>
      ${coursework ? `<div class="experience-card__coursework">${coursework}</div>` : ""}
    </article>
  `;
}
