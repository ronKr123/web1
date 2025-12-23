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
  });

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
        title: item.title,
        description: item.description,
        image: item.thumbnail || data.feed.image,
        date: new Date(item.pubDate).toLocaleDateString("he-IL"),
        duration: parseDuration(item.enclosure?.duration),
        guid: item.guid,
      }));

      renderMore();
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
          <img src="${ep.image}" loading="lazy">
          <a href="episode.html?guid=${ep.guid}&program=${programId}" class="play-button">
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

  if (displayedCount >= allEpisodes.length) {
    document.getElementById("load-more").style.display = "none";
  }
}

document.getElementById("load-more").addEventListener("click", renderMore);

// ===== המרת משך זמן =====
function parseDuration(dur) {
  if (!dur) return "-";
  if (!isNaN(dur)) return Math.round(dur / 60);

  const parts = dur.split(":").map(Number);
  if (parts.length === 3) return parts[0] * 60 + parts[1];
  if (parts.length === 2) return parts[0];
  return "-";
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
