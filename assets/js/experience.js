import { loadWork, loadEducation } from "./lib/data.js";
import { workCardHTML, educationCardHTML } from "./lib/components.js";

const workGrid = document.getElementById("workGrid");
const educationGrid = document.getElementById("eduGrid");

async function renderWork() {
  if (!workGrid) return;
  const work = await loadWork("..");
  workGrid.innerHTML = (work || []).map(workCardHTML).join("");
}

async function renderEducation() {
  if (!educationGrid) return;
  const education = await loadEducation("..");
  educationGrid.innerHTML = (education || []).map(educationCardHTML).join("");
}

Promise.allSettled([renderWork(), renderEducation()]).then((results) => {
  if (results[0].status === "rejected" && workGrid) {
    console.error(results[0].reason);
    workGrid.innerHTML = "<p>Could not load work experience.</p>";
  }

  if (results[1].status === "rejected" && educationGrid) {
    console.error(results[1].reason);
    educationGrid.innerHTML = "<p>Could not load education history.</p>";
  }
});
