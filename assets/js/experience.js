
(() => {
  const WORK_URL = "../assets/data/work.json";
  const EDU_URL = "../assets/data/education.json";

  const workGrid = document.getElementById("workGrid");
  const eduGrid = document.getElementById("eduGrid");

  const monthFmt = (ym) => {
    if (!ym || ym === "present") return "Present";
    const [y, m] = ym.split("-").map(Number);
    if (!y || !m) return ym;
    const date = new Date(y, m - 1, 1);
    return date.toLocaleString("en-US", { month: "short", year: "numeric" });
  };

  const rangeFmt = (start, end) => `${monthFmt(start)} – ${monthFmt(end)}`;

  function safeHTML(s) {
    return String(s ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function workCard(w) {
    const tags = (w.tags || []).slice(0, 6).map(t => `<span class="tag">${safeHTML(t)}</span>`).join("");
    const bullets = (w.highlights || []).slice(0, 5).map(b => `<li>${safeHTML(b)}</li>`).join("");

    const metaParts = [
      `<span>${safeHTML(rangeFmt(w.start, w.end))}</span>`,
      w.location ? `<span class="dot">${safeHTML(w.location)}</span>` : ""
    ].filter(Boolean).join("");

    return `
      <article class="card exp-card">
        <div class="card-title-row">
          <h3 class="card-title">${safeHTML(w.role)}</h3>
        </div>
        <p class="card-desc">${safeHTML(w.company)}</p>
        <div class="exp-meta">${metaParts}</div>
        ${tags ? `<div class="tag-row">${tags}</div>` : ""}
        ${bullets ? `<ul class="exp-bullets">${bullets}</ul>` : ""}
      </article>
    `;
  }

  function eduCard(e) {
    const meta = `${safeHTML(rangeFmt(e.start, e.end))}${e.status ? ` (${safeHTML(e.status)})` : ""}`;

    const coursework = (e.coursework || []).slice(0, 12)
      .map(c => `<span class="pill">${safeHTML(c)}</span>`)
      .join("");

    return `
      <article class="card exp-card">
        <div class="card-title-row">
          <h3 class="card-title">${safeHTML(e.school)}</h3>
        </div>
        <p class="card-desc">${safeHTML(e.degree)}</p>
        <div class="exp-meta"><span>${meta}</span></div>
        ${coursework ? `<div class="coursework">${coursework}</div>` : ""}
      </article>
    `;
  }

  async function fetchJSON(url) {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error(`Fetch failed: ${url} (${res.status})`);
    return res.json();
  }

  async function init() {
    if (workGrid) {
      const work = await fetchJSON(WORK_URL);
      workGrid.innerHTML = (work || []).map(workCard).join("");
    }

    if (eduGrid) {
      const edu = await fetchJSON(EDU_URL);
      eduGrid.innerHTML = (edu || []).map(eduCard).join("");
    }
  }

  init().catch((err) => {
    console.error(err);
    if (workGrid) workGrid.innerHTML = "<p>Could not load work experience.</p>";
    if (eduGrid) eduGrid.innerHTML = "<p>Could not load education history.</p>";
  });
})();