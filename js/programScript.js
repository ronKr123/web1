const params = new URLSearchParams(location.search);
const programId = params.get("id");

const PAGE_SIZE = 5;
let allEpisodes = [];
let displayedCount = 0;

// ===== טען נתוני תכנית =====
fetch("data/programs.json")
  .then((r) => r.json())
  .then((data) => {
    const program = data.programs.find((p) => p.id === programId);
    if (!program) return;

    document.getElementById("program-title").innerText = program.title;
    document.getElementById("program-description").innerHTML =
      program.description;
    document.getElementById("program-banner").src = program.banner;

    loadRSS(program.rss);
    initFavorites(program);
  })
  .catch((err) => console.error("Error loading programs.json:", err));

// ===== טען RSS =====
function loadRSS(rssUrl) {
  const api = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(
    rssUrl
  )}`;

  fetch(api)
    .then((r) => r.json())
    .then((data) => {
      allEpisodes = data.items.map((item, index) => ({
        id: index,
        title: item.title || "ללא כותרת",
        description: item.description || "",
        image:
          item.thumbnail || data.feed?.image || "media/default-episode.png", // תמונה ברירת מחדל
        date: item.pubDate
          ? new Date(item.pubDate).toLocaleDateString("he-IL")
          : "-",
        duration: parseDuration(item.enclosure?.duration),
        guid: item.guid,
      }));

      displayedCount = 0;
      document.getElementById("episodes-container").innerHTML = ""; // נקה קודם
      renderMore();
      document.getElementById("load-more").style.display =
        allEpisodes.length > PAGE_SIZE ? "block" : "none"; // כפתור תמיד נכון
    });
}

// ===== הצגת עוד פרקים =====
function renderMore() {
  const container = document.getElementById("episodes-container");
  const remaining = allEpisodes.length - displayedCount;
  const count = Math.min(PAGE_SIZE, remaining);

  if (count <= 0) return;

  const slice = allEpisodes.slice(displayedCount, displayedCount + count);

  slice.forEach((ep) => {
    container.insertAdjacentHTML(
      "beforeend",
      `
      <div class="episode-card">
        <div class="episode-image-container">
          <img src="${ep.image}" loading="lazy" alt="תמונה של ${ep.title}">
          <a href="episode.html?guid=${encodeURIComponent(
            ep.guid
          )}&program=${encodeURIComponent(programId)}" class="play-button">
            <i class="fa-solid fa-circle-play"></i>
          </a>
        </div>
        <div class="episode-info">
          <h4>${ep.title}</h4>
          <p class="description">${ep.description}</p>
          <p class="date">${ep.date}</p>
          <p class="duration">משך הפרק: ${ep.duration} דקות</p>
        </div>
      </div>
      `
    );
  });

  displayedCount += count;

  // הצג או הסתר את הכפתור בהתאם לשאר הפרקים
  const loadMoreBtn = document.getElementById("load-more");
  if (displayedCount >= allEpisodes.length) {
    loadMoreBtn.style.display = "none";
  } else {
    loadMoreBtn.style.display = "block";
  }
}

document.getElementById("load-more").addEventListener("click", renderMore);

// ===== המרת משך זמן =====
function parseDuration(dur) {
  if (!dur) return "לא ידוע";
  if (!isNaN(dur)) return Math.round(dur / 60);

  const parts = dur.split(":").map(Number);
  if (parts.length === 3) return parts[0] * 60 + parts[1];
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  return "לא ידוע";
}

// ===== מועדפים =====
function initFavorites(program) {
  const favorites = JSON.parse(
    localStorage.getItem("favoritePrograms") || "[]"
  );
  const icon = document.getElementById("favorite-icon");

  if (favorites.find((p) => p.id === program.id)) {
    icon.classList.replace("fa-regular", "fa-solid");
    icon.classList.add("favorited");
  }

  document.getElementById("favorite-btn").onclick = () => {
    const index = favorites.findIndex((p) => p.id === program.id);

    if (index === -1) {
      favorites.push(program);
      icon.classList.replace("fa-regular", "fa-solid");
      icon.classList.add("favorited");
    } else {
      favorites.splice(index, 1);
      icon.classList.replace("fa-solid", "fa-regular");
      icon.classList.remove("favorited");
    }

    localStorage.setItem("favoritePrograms", JSON.stringify(favorites));
  };
}
