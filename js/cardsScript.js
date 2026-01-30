const RSS_PROXY = "https://api.rss2json.com/v1/api.json?rss_url=";

const selectedProgramIds = ["tov-shebatem", "kulshPodcast", "eamon"];

let renderedEpisodes = 0;
const MAX_EPISODES = 3;

fetch("data/programs.json")
  .then((r) => r.json())
  .then((data) => {
    const programs = data.programs.filter((p) =>
      selectedProgramIds.includes(p.id),
    );

    programs.forEach(loadLatestEpisode);
  });

function loadLatestEpisode(program) {
  if (renderedEpisodes >= MAX_EPISODES) return;

  fetch(RSS_PROXY + encodeURIComponent(program.rss))
    .then((r) => r.json())
    .then((feed) => {
      if (!feed.items || !feed.items.length) return;
      if (renderedEpisodes >= MAX_EPISODES) return;

      const ep = feed.items[0];
      renderEpisodeCard(program, ep);
      renderedEpisodes++;
    })
    .catch((err) => console.error("RSS error:", err));
}

function renderEpisodeCard(program, ep) {
  const container = document.getElementById("cards-container");

  const image =
    ep.itunes?.image ||
    ep.thumbnail ||
    program.tab ||
    "media/default-episode.png";

  // לוקחים תיאור ומגבילים ל־20 תווים
  let desc = ep.description || ep.content || program.title || "";
  desc = desc.replace(/<[^>]*>/g, ""); // ניקוי HTML מה־RSS

  if (desc.length > 20) {
    desc = desc.substring(0, 180) + "…";
  }

  container.insertAdjacentHTML(
    "beforeend",
    `
    <div class="col-12 col-sm-6 col-md-3">
      <a 
        href="playerEpisode.html?guid=${encodeURIComponent(ep.guid)}&program=${program.id}"
        class="episode-card-flat"
      >
        <img 
          src="${image}" 
          alt="${ep.title}" 
          class="episode-img"
        >

        <div class="episode-body">
          <h3 class="episode-title text-center">
            ${ep.title}
          </h3>

          <p class="episode-desc" style="text-align: right;">
            ${desc}
          </p>
        </div>
      </a>
    </div>
    `,
  );
}
