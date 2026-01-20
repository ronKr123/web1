const RSS_PROXY = "https://api.rss2json.com/v1/api.json?rss_url=";

const selectedProgramIds = [
  "tov-shebatem",
  "betalim",
  "eamon",
  "melechblayizerhaim",
];

fetch("data/programs.json")
  .then((r) => r.json())
  .then((data) => {
    const programs = data.programs.filter((p) =>
      selectedProgramIds.includes(p.id),
    );

    programs.forEach(loadLatestEpisode);
  });

function loadLatestEpisode(program) {
  fetch(RSS_PROXY + encodeURIComponent(program.rss))
    .then((r) => r.json())
    .then((feed) => {
      if (!feed.items || !feed.items.length) return;

      const ep = feed.items[0];
      renderEpisodeCard(program, ep);
    })
    .catch((err) => console.error("RSS error:", err));
}

function renderEpisodeCard(program, ep) {
  const container = document.getElementById("latest-episodes");

  const date = ep.pubDate
    ? new Date(ep.pubDate).toLocaleDateString("he-IL")
    : "";

  const image =
    ep.itunes?.image ||
    ep.thumbnail ||
    program.tab ||
    "media/default-episode.png";

  container.insertAdjacentHTML(
    "beforeend",
    `
    <div class="custom-episode-card">
      <a href="playerEpisode.html?guid=${encodeURIComponent(ep.guid)}&program=${
        program.id
      }">
        <i class="fa-solid fa-circle-play"></i>
      </a>

      <div class="card-text">
        <h4 style="direction: rtl; text-align: right;">
          ${ep.title}
        </h4>
        <p style="direction: rtl; text-align: right; font-size: 20px;">
          ${program.title}
        </p>
        <p style="direction: rtl; text-align: right;">
          ${date}
        </p>
      </div>

      <a href="playerEpisode.html?guid=${encodeURIComponent(ep.guid)}&program=${
        program.id
      }">
        <img src="${image}" alt="${ep.title}">
      </a>
    </div>
    `,
  );
}
