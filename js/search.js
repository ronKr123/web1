const searchInput = document.getElementById("searchInput");
const programList = document.getElementById("programList");
const noResults = document.getElementById("noResults");
const searchResultsTitle = document.getElementById("searchResultsTitle");
const searchQuerySpan = document.getElementById("searchQuery");

let programs = [];
let series = [];

// טעינת תוכניות
fetch("data/programs.json")
  .then((r) => r.json())
  .then((data) => {
    programs = data.programs;
  });

// טעינת סדרות
fetch("data/series.json")
  .then((r) => r.json())
  .then((data) => {
    series = data.series;
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

  // חיפוש בתוכניות
  programs.forEach((p) => {
    if (query && p.title.toLowerCase().includes(query)) {
      found = true;
      programList.innerHTML += `
        <div class="program-card">
          <a href="program.html?id=${p.id}" class="btn-entry">
            <i class="fas fa-arrow-left"></i> כניסה
          </a>
          <div class="program-info">
            <div class="program-title">${p.title}</div>
            <div class="program-desc">${p.description}</div>
          </div>
          <img src="${p.tab}" class="program-image">
        </div>
      `;
    }
  });

  // חיפוש בסדרות
  series.forEach((s) => {
    if (query && s.title.toLowerCase().includes(query)) {
      found = true;
      programList.innerHTML += `
        <div class="program-card">
          <a href="programsSeries.html?id=${s.id}" class="btn-entry">
            <i class="fas fa-arrow-left"></i> כניסה לסדרה
          </a>
          <div class="program-info">
            <div class="program-title">${s.title}</div>
            <div class="program-desc">${s.description}</div>
          </div>
          <img src="${s.image}" class="program-image">
        </div>
      `;
    }
  });

  noResults.style.display = !found && query ? "block" : "none";
});

const searchButton = document.querySelector(".search-box button");

searchButton.addEventListener("click", () => {
  // מחזירים את הערך של השדה
  const query = searchInput.value.trim().toLowerCase();

  // מנגנון החיפוש כמו ב־input
  programList.innerHTML = "";
  let found = false;

  if (query) {
    searchResultsTitle.style.display = "block";
    searchQuerySpan.textContent = searchInput.value;
  } else {
    searchResultsTitle.style.display = "none";
  }

  // חיפוש בתוכניות
  programs.forEach((p) => {
    if (query && p.title.toLowerCase().includes(query)) {
      found = true;
      programList.innerHTML += `
        <div class="program-card">
          <a href="program.html?id=${p.id}" class="btn-entry">
            <i class="fas fa-arrow-left"></i> כניסה
          </a>
          <div class="program-info">
            <div class="program-title">${p.title}</div>
            <div class="program-desc">${p.description}</div>
          </div>
          <img src="${p.tab}" class="program-image">
        </div>
      `;
    }
  });

  // חיפוש בסדרות
  series.forEach((s) => {
    if (query && s.title.toLowerCase().includes(query)) {
      found = true;
      programList.innerHTML += `
        <div class="program-card">
          <a href="programsSeries.html?id=${s.id}" class="btn-entry">
            <i class="fas fa-arrow-left"></i> כניסה לסדרה
          </a>
          <div class="program-info">
            <div class="program-title">${s.title}</div>
            <div class="program-desc">${s.description}</div>
          </div>
          <img src="${s.image}" class="program-image">
        </div>
      `;
    }
  });

  noResults.style.display = !found && query ? "block" : "none";
});
