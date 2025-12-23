const searchInput = document.getElementById("searchInput");
const programList = document.getElementById("programList");
const noResults = document.getElementById("noResults");
const searchResultsTitle = document.getElementById("searchResultsTitle");
const searchQuerySpan = document.getElementById("searchQuery");

let programs = [];

fetch("data/programs.json")
  .then((r) => r.json())
  .then((data) => {
    programs = data.programs;
  });

searchInput.addEventListener("input", () => {
  const query = searchInput.value.trim().toLowerCase();
  programList.innerHTML = "";
  let found = false;

  if (query) {
    searchResultsTitle.style.display = "block";
    searchQuerySpan.textContent = searchInput.value;
  } else {
    searchResultsTitle.style.display = "none";
  }

  programs.forEach((p) => {
    if (query && p.title.toLowerCase().includes(query)) {
      found = true;
      programList.innerHTML += `
        <div class="program-card">
          <a href="${p.url}" class="btn-entry">
            <i class="fas fa-arrow-left"></i> כניסה
          </a>

          <div class="program-info">
            <div class="program-title">${p.title}</div>
            <div class="program-desc">${p.description}</div>
          </div>

          <img src="${p.image}" class="program-image">
        </div>
      `;
    }
  });

  noResults.style.display = !found && query ? "block" : "none";
});
