async function fetchJSON(url) {
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Fetch failed: ${url} (${response.status})`);
  }
  return response.json();
}

export function loadProjects(basePath = ".") {
  return fetchJSON(`${basePath}/assets/data/projects.json`);
}

export function loadWork(basePath = ".") {
  return fetchJSON(`${basePath}/assets/data/work.json`);
}

export function loadEducation(basePath = ".") {
  return fetchJSON(`${basePath}/assets/data/education.json`);
}
