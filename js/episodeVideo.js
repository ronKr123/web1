const params = new URLSearchParams(location.search);
const seriesId = params.get("series");
const episodeId = params.get("episode");

fetch("data/series.json") // הקובץ עם ה-JSON ששלחת
  .then((r) => r.json())
  .then((data) => {
    const series = data.series.find((s) => s.id === seriesId);
    if (!series) return;

    const episode = series.episodes.find((e) => e.id === episodeId);
    if (!episode) return;

    // כותרת + תיאור
    document.getElementById("episodeTitle").textContent = episode.title;
    document.getElementById("episodeDescription").textContent =
      episode.description;

    // YouTube embed
    const videoId = episode.youtube.split("v=")[1];
    document.getElementById("videoFrame").src =
      `https://www.youtube.com/embed/${videoId}`;

    // פרקים נוספים
    const other = document.getElementById("otherEpisodes");
    series.episodes.forEach((ep) => {
      if (ep.id === episode.id) return;

      const card = document.createElement("div");
      card.className = "episode-card";
      card.innerHTML = `
        <a href="episodeVideo.html?series=${series.id}&episode=${ep.id}" style="text-decoration: none; color: inherit;">
        <img src="${ep.image}" alt="${ep.title}">
        <h3>${ep.title}</h3>
        </a>
      `;
      other.appendChild(card);
    });
  });
