const cache = new Map();

async function fetchJSON(url) {
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Fetch failed: ${url} (${response.status})`);
  }
  return response.json();
}

export function loadJSON(url) {
  if (!cache.has(url)) {
    cache.set(url, fetchJSON(url));
  }
  return cache.get(url);
}

export function loadProjects(basePath = ".") {
  return loadJSON(`${basePath}/assets/data/projects.json`);
}

export function loadWork(basePath = ".") {
  return loadJSON(`${basePath}/assets/data/work.json`);
}

export function loadEducation(basePath = ".") {
  return loadJSON(`${basePath}/assets/data/education.json`);
}
