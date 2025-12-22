const params = new URLSearchParams(window.location.search);
const programId = params.get("id");

let allEpisodes = [];
let displayedCount = 0;
const PAGE_SIZE = 5; // טען 5 פרקים בכל לחיצה

fetch("data/programs.json")
  .then((r) => r.json())
  .then((programs) => {
    const program = programs[programId];
    if (!program) return;

    document.title = program.title;
    document.getElementById("program-title").innerText = program.title;
    document.getElementById("program-description").innerText =
      program.description;
    document.getElementById("program-banner").src = program.banner;

    setupFavorites(program);
    loadRSS(program.rss);
  });

function loadRSS(rssUrl) {
  const api = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(
    rssUrl
  )}`;

  fetch(api)
    .then((r) => r.json())
    .then((data) => {
      allEpisodes = data.items.map((item) => ({
        title: item.title,
        description: stripHtml(item.description),
        image: item.thumbnail,
        date: new Date(item.pubDate).toLocaleDateString("he-IL"),
        duration: parseDuration(item.itunes?.duration || item.duration || 0),
        guid: item.guid,
      }));

      renderMore();
    });
}

function parseDuration(duration) {
  if (!duration) return 0;
  // אם duration הוא מספר שניות
  if (typeof duration === "number") return Math.floor(duration / 60);
  // אם duration בפורמט "hh:mm:ss" או "mm:ss"
  const parts = duration.split(":").map(Number);
  if (parts.length === 3)
    return parts[0] * 60 + parts[1] + Math.floor(parts[2] / 60);
  if (parts.length === 2) return parts[0] + Math.floor(parts[1] / 60);
  return 0;
}

function renderMore() {
  const container = document.getElementById("episodes-container");
  const slice = allEpisodes.slice(displayedCount, displayedCount + PAGE_SIZE);

  slice.forEach((ep) => {
    container.insertAdjacentHTML(
      "beforeend",
      `
      <div class="episode-card show">
        <div class="episode-image-container">
          <img src="${ep.image}">
          <a href="/episode.html?guid=${
            ep.guid
          }&program=${programId}" class="play-button">
            <i class="fa-solid fa-circle-play"></i>
          </a>
        </div>
        <div class="episode-info">
          <h4>${ep.title}</h4>
          <p class="description">${ep.description}</p>
          <p class="date">${ep.date}</p>
          <p class="duration">משך הפרק: ${ep.duration / 60} דקות</p>
        </div>
      </div>
    `
    );
  });

  displayedCount += slice.length;

  if (displayedCount >= allEpisodes.length) {
    document.getElementById("load-more").style.display = "none";
  }
}

document.getElementById("load-more").addEventListener("click", renderMore);

function setupFavorites(program) {
  const btn = document.getElementById("favorite-btn");
  const icon = document.getElementById("favorite-icon");

  let favorites = JSON.parse(localStorage.getItem("favoritePrograms") || "[]");

  if (favorites.find((p) => p.id === program.id)) {
    icon.classList.replace("fa-regular", "fa-solid");
  }

  btn.onclick = () => {
    const index = favorites.findIndex((p) => p.id === program.id);

    if (index === -1) {
      favorites.push(program);
      icon.classList.replace("fa-regular", "fa-solid");
    } else {
      favorites.splice(index, 1);
      icon.classList.replace("fa-solid", "fa-regular");
    }

    localStorage.setItem("favoritePrograms", JSON.stringify(favorites));
  };
}

function stripHtml(html) {
  return html.replace(/<[^>]*>/g, "").slice(0, 150) + "...";
}
