import { loadData } from "./shared.js";

function renderTags(container, tags) {
  container.replaceChildren(...tags.map((tag) => {
    const span = document.createElement("span");
    span.textContent = tag;
    return span;
  }));
}

function formatProjectMeta(project) {
  return [project.category, project.status].filter(Boolean).join(" · ");
}

async function loadProjects() {
  const projects = await loadData("projects");
  const featured = projects.filter((project) => project.featured).slice(0, 3);
  const remaining = projects
    .filter((project) => !featured.includes(project))
    .sort((a, b) => b.date.localeCompare(a.date));

  const featuredList = document.getElementById("projects-featured");
  const cardTemplate = document.getElementById("projects-card-template");
  const collection = document.getElementById("projects-collection");
  const rowTemplate = document.getElementById("projects-row-template");
  const searchInput = document.getElementById("projects-search");
  const categoryFilter = document.getElementById("projects-category");
  const results = document.getElementById("projects-results");
  const dialog = document.getElementById("projects-dialog");

  if (featured.length === 0) {
    const empty = document.createElement("div");
    empty.className = "projects__card projects__card--empty";
    empty.textContent = "No featured projects right now.";
    featuredList.append(empty);
  }

  for (const project of featured) {
    const card = cardTemplate.content.firstElementChild.cloneNode(true);
    card.dataset.projectId = project.id;
    card.setAttribute("aria-label", `View details for ${project.title}`);
    card.querySelector(".projects__card-meta").textContent = formatProjectMeta(project);
    card.querySelector(".projects__card-title").textContent = project.title;
    card.querySelector(".projects__card-summary").textContent = project.summary;
    renderTags(card.querySelector(".projects__card-tags"), project.tags.slice(0, 3));
    featuredList.append(card);
  }

  function openProject(element) {
    const project = projects.find((item) => item.id === element.dataset.projectId);
    if (!project) return;

    document.getElementById("projects-dialog-meta").textContent = formatProjectMeta(project);
    document.getElementById("projects-dialog-title").textContent = project.title;
    document.getElementById("projects-dialog-description").textContent = project.description;
    renderTags(document.getElementById("projects-dialog-tags"), project.tags);

    const images = project.images ?? [];
    const gallery = document.getElementById("projects-dialog-gallery");

    gallery.replaceChildren(...images.map((src, index) => {
      const image = document.createElement("img");
      image.src = src;
      image.alt = `${project.title} screenshot ${index + 1}`;
      image.loading = "lazy";
      return image;
    }));

    document.getElementById("projects-dialog-images-section").hidden = !images.length;

    for (const name of ["github", "demo"]) {
      const link = document.getElementById(`projects-dialog-${name}`);
      const url = project.links?.[name];
      link.hidden = !url;
      if (url) link.href = url;
    }

    document.getElementById("projects-dialog-links-section").hidden =
      !project.links?.github && !project.links?.demo;

    dialog.showModal();
  }

  const categories = [...new Set(remaining.map((project) => project.category))].sort();
  for (const category of categories) {
    categoryFilter.add(new Option(category, category));
  }

  function renderCollection() {
    const query = searchInput.value.trim().toLowerCase();
    const selectedCategory = categoryFilter.value;
    const filtered = remaining.filter((project) => {
      const matchesCategory =
        selectedCategory === "all" || project.category === selectedCategory;
      const searchableText = [
        project.title,
        project.category,
        project.status ?? "",
        project.summary,
        project.tags
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
      row.querySelector(".projects__row-meta").textContent = formatProjectMeta(project);
      row.querySelector(".projects__row-title").textContent = project.title;
      row.querySelector(".projects__row-summary").textContent = project.summary;
      collection.append(row);
    }
  }

  searchInput.addEventListener("input", renderCollection);
  categoryFilter.addEventListener("change", renderCollection);

  for (const list of [featuredList, collection]) {
    list.addEventListener("click", (event) => {
      const item = event.target.closest("[data-project-id]");
      if (item) openProject(item);
    });
  }

  // Collection rows are native buttons; only the featured cards need key handling.
  featuredList.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    const card = event.target.closest("[data-project-id]");
    if (card && event.target === card) {
      event.preventDefault();
      openProject(card);
    }
  });

  renderCollection();
}

loadProjects().catch((error) => {
  console.error(error);
  for (const id of ["projects-featured", "projects-collection"]) {
    document.getElementById(id).textContent = "Projects could not be loaded.";
  }
});
