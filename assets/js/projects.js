
async function loadProjects() {
  const response = await fetch("../assets/data/projects.json");

  if (!response.ok) {
    throw new Error("Could not load projects.");
  }

  const projects = await response.json();

  // Separate featured and remaining projects
  const featured = projects
    .filter((project) => project.featured)
    .slice(0, 3);

  const remaining = projects
    .filter((project) => !featured.includes(project))
    .sort((a, b) => b.date.localeCompare(a.date));

  // Featured projects
  const container = document.getElementById("featuredProjects");
  const template = document.getElementById("featuredCardTemplate");

  if (featured.length === 0) {
    const empty = document.createElement("div");
    empty.className = "projects__card projects__card--empty";
    empty.textContent = "No featured projects right now.";
    container.append(empty);
  }

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

    const tagsContainer = card.querySelector(".projects__card-tags");

    for (const tag of project.tags.slice(0, 3)) {
      const span = document.createElement("span");
      span.textContent = tag;
      tagsContainer.append(span);
    }

    container.append(card);
  }

  // Expanded project dialog
  const dialog = document.getElementById("projectDialog");

  function openProject(element) {
    const project = projects.find(
      (item) => item.id === element.dataset.projectId
    );

    if (!project) return;

    document.getElementById("projectDialogCategory").textContent = project.category;
    document.getElementById("projectDialogTitle").textContent = project.title;
    document.getElementById("projectDialogDescription").textContent = project.description;

    const tagsContainer = document.getElementById("projectDialogTags");
    tagsContainer.replaceChildren();

    for (const tag of project.tags) {
      const span = document.createElement("span");
      span.textContent = tag;
      tagsContainer.append(span);
    }

    // Project links
    const githubLink = document.getElementById("projectDialogGitHub");
    const demoLink = document.getElementById("projectDialogDemo");

    githubLink.hidden = !project.links?.github;
    demoLink.hidden = !project.links?.demo;

    if (project.links?.github) {
      githubLink.href = project.links.github;
    }

    if (project.links?.demo) {
      demoLink.href = project.links.demo;
    }

    const linksSection = document.getElementById("projectDialogLinksSection");
    linksSection.hidden = !project.links?.github && !project.links?.demo;

    dialog.showModal();
  }

  // Remaining projects
  const collection = document.getElementById("moreProjects");
  const rowTemplate = document.getElementById("projectRowTemplate");
  const searchInput = document.getElementById("projectSearch");
  const categoryFilter = document.getElementById("projectCategory");
  const results = document.getElementById("projectResults");

  // Populate category filter
  const categories = [
    ...new Set(remaining.map((project) => project.category))
  ].sort();

  for (const category of categories) {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categoryFilter.append(option);
  }

  // Render projects based on search and category
  function renderCollection() {
    const query = searchInput.value.trim().toLowerCase();
    const selectedCategory = categoryFilter.value;

    const filtered = remaining.filter((project) => {
      const matchesCategory =
        selectedCategory === "all" || project.category === selectedCategory;

      const searchableText = [
        project.title,
        project.category,
        project.summary,
        ...project.tags
      ].join(" ").toLowerCase();

      return matchesCategory && searchableText.includes(query);
    });

    collection.replaceChildren();
    collection.scrollTop = 0;

    results.textContent = `Showing ${filtered.length} of ${remaining.length} projects`;

    if (filtered.length === 0) {
      const empty = document.createElement("p");
      empty.className = "projects__collection-empty";
      empty.textContent = "No matching projects. Try a different search or category.";
      collection.append(empty);
      return;
    }

    for (const project of filtered) {
      const row = rowTemplate.content.firstElementChild.cloneNode(true);

      row.dataset.projectId = project.id;

      row.querySelector(".projects__collection-category").textContent = project.category;
      row.querySelector(".projects__collection-title").textContent = project.title;
      row.querySelector(".projects__collection-summary").textContent = project.summary;

      collection.append(row);
    }
  }

  // Collection interactions
  searchInput.addEventListener("input", renderCollection);
  categoryFilter.addEventListener("change", renderCollection);

  collection.addEventListener("click", (event) => {
    const row = event.target.closest(".projects__collection-item");

    if (row) openProject(row);
  });

  renderCollection();

  // Featured card interactions
  container.addEventListener("click", (event) => {
    const card = event.target.closest(".projects__card");

    if (card) openProject(card);
  });

  container.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;

    const card = event.target.closest(".projects__card");

    if (card && event.target === card) {
      event.preventDefault();
      openProject(card);
    }
  });

  // Close dialog when clicking outside
  dialog.addEventListener("click", (event) => {
    const rect = dialog.getBoundingClientRect();

    const clickedOutside =
      event.clientX < rect.left ||
      event.clientX > rect.right ||
      event.clientY < rect.top ||
      event.clientY > rect.bottom;

    if (clickedOutside) {
      dialog.close();
    }
  });
}

loadProjects().catch((error) => {
  console.error(error);
  document.getElementById("featuredProjects").textContent =
    "Projects could not be loaded.";
  document.getElementById("moreProjects").textContent =
    "Projects could not be loaded.";
});
