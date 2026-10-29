
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
  const featuredIds = new Set(featured.map((project) => project.id));

  const remaining = projects
    .filter((project) => !featuredIds.has(project.id))
    .sort((a, b) => b.date.localeCompare(a.date));

  const container = document.getElementById("featuredProjects");
  const template = document.getElementById("featuredCardTemplate");

  container.replaceChildren();

  // Handle no featured projects
  if (featured.length === 0) {
    const empty = document.createElement("div");
    empty.className = "projects__card projects__card--empty";
    empty.textContent = "No featured projects right now.";
    container.append(empty);
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
    const project = projects.find(
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

  // Remaining projects collection
  const collection = document.getElementById("moreProjects");
  const rowTemplate = document.getElementById("projectRowTemplate");
  const searchInput = document.getElementById("projectSearch");
  const categoryFilter = document.getElementById("projectCategory");
  const results = document.getElementById("projectResults");

  // Generate category options from the project data
  const categories = [...new Set(remaining.map((project) => project.category))].sort();

  for (const category of categories) {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categoryFilter.append(option);
  }

  // Render the collection using the active filters
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

      const matchesSearch = searchableText.includes(query);

      return matchesCategory && matchesSearch;
    });

    collection.replaceChildren();
    collection.scrollTop = 0;

    results.textContent = `Showing ${filtered.length} of ${remaining.length} projects`;

    // Display a message when nothing matches
    if (filtered.length === 0) {
      const empty = document.createElement("p");
      empty.className = "projects__collection-empty";
      empty.textContent = "No matching projects. Try a different search or category.";
      collection.append(empty);
      return;
    }

    // Create a row for each matching project
    for (const project of filtered) {
      const row = rowTemplate.content.firstElementChild.cloneNode(true);

      row.dataset.projectId = project.id;

      row.querySelector(".projects__collection-category").textContent = project.category;
      row.querySelector(".projects__collection-title").textContent = project.title;
      row.querySelector(".projects__collection-summary").textContent = project.summary;

      row.addEventListener("click", () => openProject(row));

      collection.append(row);
    }
  }

  // Update immediately when searching or changing category
  searchInput.addEventListener("input", renderCollection);
  categoryFilter.addEventListener("change", renderCollection);

  // Initial display
  renderCollection();
  
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
