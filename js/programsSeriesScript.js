const params = new URLSearchParams(location.search);
const slug = params.get("id");

fetch("data/series.json")
  .then((r) => r.json())
  .then((data) => {
    const program = data.series.find((p) => p.slug === slug);
    if (!program) return;

    document.getElementById("programTitle").innerText = program.title;
    document.getElementById("description").innerHTML =
      program.description || "";

    const grid = document.getElementById("episodesGrid");

    program.episodes.forEach((ep) => {
      grid.innerHTML += `
        <div class="episode-wrapper">
          <a href="episode.html?series=${slug}&ep=${ep.id}" class="episode-card">
            <img src="${ep.image}" loading="lazy">
          </a>
          <h3 class="episode-title">${ep.title}</h3>
        </div>
      `;
    });

    initFavorites(program);
  });

function initFavorites(program) {
  const favorites = JSON.parse(
    localStorage.getItem("favoritePrograms") || "[]"
  );
  const icon = document.getElementById("favorite-icon");

  if (favorites.find((p) => p.slug === program.slug)) {
    icon.classList.replace("fa-regular", "fa-solid");
    icon.classList.add("favorited");
  }

  document.getElementById("favorite-btn").onclick = () => {
    const index = favorites.findIndex((p) => p.slug === program.slug);

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
