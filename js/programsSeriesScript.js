const params = new URLSearchParams(location.search);
const slug = params.get("id");

fetch("data/series.json")
  .then((r) => r.json())
  .then((data) => {
    const program = data.series.find((p) => p.id === slug);
    if (!program) return;

    document.getElementById("programTitle").innerText = program.title;
    document.getElementById("description").innerHTML =
      program.description || "";

    document.getElementById("generalDescription").innerHTML =
      program.generalDescription || "";

    const grid = document.getElementById("episodesGrid");

    program.episodes.forEach((ep) => {
      grid.innerHTML += `
        <div class="episode-wrapper">
          <a href="episodeVideo.html?series=${slug}&episode=${ep.id}" class="episode-card">
            <img src="${ep.image}" alt="${ep.title}" loading="lazy">
          </a>
          <h3 class="episode-title">${ep.title}</h3>
        </div>
      `;
    });

    initFavorites(program);
  });

function initFavorites(program) {
  const favorites = JSON.parse(
    localStorage.getItem("favoritePrograms") || "[]",
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
        image: program.image,
        urlProgram: `programsSeries.html?id=${program.id}`,
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
