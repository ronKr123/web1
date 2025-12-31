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

function getEpisodeImage(item) {
  // 1. נסה itunes:image
  const itunesImages = item.getElementsByTagNameNS(
    "http://www.itunes.com/dtds/podcast-1.0.dtd",
    "image"
  );
  if (itunesImages.length > 0) return itunesImages[0].getAttribute("href");

  // 2. נסה media:content עם type=image/jpeg
  const mediaContents = item.getElementsByTagNameNS(
    "http://search.yahoo.com/mrss/",
    "content"
  );
  for (let i = 0; i < mediaContents.length; i++) {
    const m = mediaContents[i];
    if (m.getAttribute("type") === "image/jpeg") return m.getAttribute("url");
  }

  // 3. fallback
  return "media/default-episode.png";
}

function truncateText(text, maxLength) {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}

// ===== טען RSS =====
function loadRSS(rssUrl) {
  fetch(rssUrl)
    .then((r) => r.text())
    .then((str) => {
      const parser = new DOMParser();
      const xml = parser.parseFromString(str, "application/xml");

      const items = Array.from(xml.querySelectorAll("item"));
      if (!items.length) {
        document.getElementById("episodes-container").innerHTML =
          "<p>לא נמצאו פרקים לתוכנית זו</p>";
        return;
      }

      allEpisodes = Array.from(xml.querySelectorAll("item")).map(
        (item, index) => ({
          id: index,
          title: item.querySelector("title")?.textContent || "ללא כותרת",
          description: item.querySelector("description")?.textContent || "",
          image: getEpisodeImage(item),
          date: item.querySelector("pubDate")
            ? new Date(
                item.querySelector("pubDate").textContent
              ).toLocaleDateString("he-IL")
            : "-",
          duration: parseDuration(
            item.getElementsByTagNameNS(
              "http://www.itunes.com/dtds/podcast-1.0.dtd",
              "duration"
            )[0]?.textContent
          ),
          guid: item.querySelector("guid")?.textContent,
        })
      );

      displayedCount = 0;
      document.getElementById("episodes-container").innerHTML = "";
      renderMore();

      document.getElementById("load-more").style.display =
        allEpisodes.length > PAGE_SIZE ? "block" : "none";
    })
    .catch((err) => {
      console.error("RSS parsing error:", err);
      document.getElementById("episodes-container").innerHTML =
        "<p>שגיאה בטעינת הפרקים</p>";
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
    const div = document.createElement("div");
    div.className = "episode-card";

    div.innerHTML = `
    <div class="episode-image-container">
      <img src="${ep.image}" loading="lazy" alt="תמונה של ${ep.title}">
      <a href="playerEpisode.html?guid=${encodeURIComponent(
        ep.guid
      )}&program=${encodeURIComponent(programId)}" class="play-button">
        <i class="fa-solid fa-circle-play"></i>
      </a>
    </div>
    <div class="episode-info">
      <h4>${ep.title}</h4>
      <p class="description">${truncateText(ep.description, 50)}</p>
      <p class="date">${ep.date}</p>
      <p class="duration">משך הפרק: ${ep.duration} דקות</p>
    </div>
  `;

    container.appendChild(div);

    requestAnimationFrame(() => div.classList.add("show"));
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
      favorites.push({
        id: program.id,
        name: program.title,
        image: program.tab,
        urlProgram: `program.html?id=${program.id}`,
      });
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

const scrollBtn = document.getElementById("scrollTopBtn");

if (scrollBtn) {
  window.addEventListener("scroll", () => {
    scrollBtn.classList.toggle("show", window.scrollY > window.innerHeight / 2);
  });

  scrollBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}
