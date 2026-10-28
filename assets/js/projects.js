
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
    
    card.dataset.projectId = project.id;
    card.tabIndex = 0;
    card.setAttribute("role", "button");
    card.setAttribute("aria-haspopup", "dialog");
    card.setAttribute("aria-label", `View details for ${project.title}`);

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
  
  // Expanded project dialog
  const dialog = document.getElementById("projectDialog");

  function openProject(card) {
    const project = featured.find(
      (item) => item.id === card.dataset.projectId
    );

    if (!project) return;

    document.getElementById("projectDialogCategory").textContent = project.category;
    document.getElementById("projectDialogTitle").textContent = project.title;
    document.getElementById("projectDialogDescription").textContent = project.description;

    // Display all technologies
    const tagsContainer = document.getElementById("projectDialogTags");
    tagsContainer.replaceChildren();

    project.tags.forEach((tag) => {
      const span = document.createElement("span");
      span.textContent = tag;
      tagsContainer.append(span);
    });

    // Update project links
    const githubLink = document.getElementById("projectDialogGitHub");
    const demoLink = document.getElementById("projectDialogDemo");

    githubLink.hidden = !project.links?.github;
    demoLink.hidden = !project.links?.demo;

    if (project.links?.github) { githubLink.href = project.links.github; }
    if (project.links?.demo) { demoLink.href = project.links.demo; }

    // Hide the links section when no links are available
    const linksSection = document.getElementById("projectDialogLinksSection");
    linksSection.hidden = !project.links?.github && !project.links?.demo;

    dialog.showModal();
  }
  
  // Close the dialog when clicking outside it
  dialog.addEventListener("click", (event) => {
    const rect = dialog.getBoundingClientRect();

    const clickedOutside = event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom;
    
    if (clickedOutside) {
      dialog.close();
    }
  });

  // Open a card when clicked
  container.addEventListener("click", (event) => {
    const card = event.target.closest(".projects__card");

    if (card) openProject(card);
  });

  // Allow keyboard activation
  container.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;

    const card = event.target.closest(".projects__card");

    if (card && event.target === card) {
      event.preventDefault();
      openProject(card);
    }
  });
}

loadProjects().catch((error) => {
  console.error(error);
  document.getElementById("featuredProjects").textContent = "Projects could not be loaded.";
});
