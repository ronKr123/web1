const params = new URLSearchParams(window.location.search);
const episodeId = Number(params.get("id"));

fetch("data/programs.json")
  .then((r) => r.json())
  .then((data) => {
    const program = data.programs[0];
    const episode = program.episodes.find((e) => e.id === episodeId);

    // כותרת
    document.getElementById("episodeTitle").innerText = episode.title;

    // תיאור
    document.getElementById("episodeDescription").innerHTML =
      episode.description.replace(/\./g, ".<br>");

    // YouTube embed
    let url = new URL(episode.youtube);
    let videoId = url.searchParams.get("v");
    let start = url.searchParams.get("t")?.replace("s", "");

    document.getElementById(
      "videoFrame"
    ).src = `https://www.youtube.com/embed/${videoId}${
      start ? `?start=${start}` : ""
    }`;

    // פרקים נוספים
    const container = document.getElementById("otherEpisodes");

    program.episodes
      .filter((e) => e.id !== episodeId)
      .forEach((ep) => {
        container.innerHTML += `
          <div class="episode-card">
            <a href="episode.html?id=${ep.id}">
              <img src="${ep.image}">
              <h3>${ep.title}</h3>
            </a>
          </div>
        `;
      });
  });
