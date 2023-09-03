document.addEventListener("DOMContentLoaded", () => {
  const corsProxyURL = "https://corsproxy.io/?";
  const apiURL = "http://api.deezer.com/search?limit=15&q=";

  const inputContainer = document.querySelector(".input-container");
  const input = inputContainer.querySelector("#input");

  const songsContainer = document.querySelector(".songs-container");

  const controlContainer = document.querySelector(".control-container");

  const lyricsContainer = document.querySelector(".lyrics-container");

  const getMusicList = async function (url) {
    try {
      const res = await fetch(corsProxyURL + url);
      const json = await res.json();
      return json;
    } catch (e) {
      return {};
    }
  };

  const getLyrics = async function (title, artist) {
    try {
      const res = await fetch(
        corsProxyURL + `https://lyrist.vercel.app/api/${title}/${artist}`
      );
      const json = await res.json();
      return json;
    } catch (e) {
      return {};
    }
  };

  const showLyrics = async function (song, currentURL) {
    const json = await getLyrics(song.title, song.artist.name);

    if (Object.keys(json).length === 0 || json.error) {
      lyricsContainer.innerHTML = `<h1>Sorry.<br> 
                                  The lyrics of "${song.artist.name} - ${song.title}" are not ready yet.
                                  </h1>`;
    } else {
      lyricsContainer.innerHTML = `<img src=${json.image}>
                                  <p id='lyrics'>
                                  ${json.lyrics.replaceAll("\n", "<br>")}
                                  </p>`;
    }

    controlContainer.innerHTML = '<button id="returnBtn">Return</button>';
    const returnBtn = controlContainer.querySelector("#returnBtn");
    returnBtn.addEventListener("click", () => {
      updateMusicList(currentURL);
    });

    songsContainer.classList.remove("active");
    lyricsContainer.classList.add("active");
  };

  const showMusicList = function (json, currentURL) {
    songsContainer.innerHTML = "";

    const fragment = document.createDocumentFragment();
    json.data.forEach((song) => {
      const li = document.createElement("li");
      li.className = "song";

      li.innerHTML = `<div class='info'>
                    <span class="artist">${song.artist.name}</span> - ${song.title}
                    </div>
                    <button id="lyricsBtn">Get Lyrics</button>`;

      const lyricsBtn = li.querySelector("#lyricsBtn");
      lyricsBtn.addEventListener("click", () => {
        showLyrics(song, currentURL);
      });

      fragment.appendChild(li);
    });

    songsContainer.appendChild(fragment);

    songsContainer.classList.add("active");
    lyricsContainer.classList.remove("active");
  };

  const updateMoreButton = function (json) {
    controlContainer.innerHTML = "";

    if (json.prev) {
      controlContainer.innerHTML += `<button id="prevBtn">Prev</button>`;
    }
    if (json.next) {
      controlContainer.innerHTML += `<button id="nextBtn">Next</button>`;
    }

    if (json.prev) {
      controlContainer.querySelector("#prevBtn").onclick = () => {
        updateMusicList(json.prev);
      };
    }
    if (json.next) {
      controlContainer.querySelector("#nextBtn").onclick = () => {
        updateMusicList(json.next);
      };
    }
  };

  const updateMusicList = async function (url) {
    const json = await getMusicList(url);
    if (json === null || Object.keys(json).length === 0) return;

    showMusicList(json, url);
    updateMoreButton(json);
  };

  inputContainer.addEventListener("submit", (e) => {
    e.preventDefault();

    if (input.value.trim() === "") {
      alert("Please type in a search term..");
      return;
    }

    updateMusicList(apiURL + input.value.trim());
    input.value = "";
  });
});
