
async function loadProjects() {
  const response = await fetch("../assets/data/projects.json");

  if (!response.ok) {
    throw new Error("Could not load projects.");
  }

  const projects = await response.json();

  // Select up to three featured projects
  const featured = projects
    .filter((project) => project.featured)
    .slice(0, 3);

  const container = document.getElementById("featuredProjects");
  const template = document.getElementById("featuredCardTemplate");

  container.replaceChildren();

  // Handle no featured projects
  if (featured.length === 0) {
    const empty = document.createElement("div");
    empty.className = "projects__card projects__card--empty";
    empty.textContent = "No featured projects right now.";
    container.append(empty);
    return;
  }

  // Create one card for each featured project
  for (const project of featured) {
    const card = template.content.firstElementChild.cloneNode(true);

    card.querySelector(".projects__card-category").textContent = project.category;
    card.querySelector(".projects__card-title").textContent = project.title;
    card.querySelector(".projects__card-description").textContent = project.summary;

    // Add technology tags
    const tagsContainer = card.querySelector(".projects__card-tags");

    project.tags.slice(0, 3).forEach((tag) => {
      const span = document.createElement("span");
      span.textContent = tag;
      tagsContainer.append(span);
    });

    container.append(card);
  }
}

loadProjects().catch((error) => {
  console.error(error);
  document.getElementById("featuredProjects").textContent = "Projects could not be loaded.";
});
