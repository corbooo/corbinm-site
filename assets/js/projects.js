
async function loadProjects() {
  const response = await fetch("../assets/data/projects.json");

  if (!response.ok) {
    throw new Error("Could not load projects.");
  }

  const projects = await response.json();

  console.log("All projects:", projects);
}

loadProjects();
