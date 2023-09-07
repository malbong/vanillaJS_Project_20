document.addEventListener("DOMContentLoaded", () => {
  const loadingImage = document.querySelector("#loading");
  const countContainer = document.querySelector("#count-container");

  const days = document.querySelector("#days");
  const hours = document.querySelector("#hours");
  const minutes = document.querySelector("#minutes");
  const seconds = document.querySelector("#seconds");

  const bannerYear = document.querySelector("#banner-year");
  bannerYear.textContent = new Date().getFullYear() + 1;

  const updateDate = function () {
    const nowDate = new Date();
    const newDate = new Date(`${nowDate.getFullYear() + 1}-01-01T00:00:00`);
    const diffDate = newDate - nowDate;

    const d = Math.floor(diffDate / 1000 / 60 / 60 / 24);
    const h = Math.floor((diffDate / 1000 / 60 / 60) % 24);
    const m = Math.floor((diffDate / 1000 / 60) % 60);
    const s = Math.floor((diffDate / 1000) % 60);

    days.textContent = d;
    hours.textContent = 0 < h && h < 10 ? "0" + h : h;
    minutes.textContent = 0 < m && m < 10 ? "0" + m : m;
    seconds.textContent = 0 < s && s < 10 ? "0" + s : s;
  };

  setInterval(updateDate, 500);
  setTimeout(() => {
    loadingImage.remove();
    countContainer.classList.remove("loading");
  }, 1000);
});
