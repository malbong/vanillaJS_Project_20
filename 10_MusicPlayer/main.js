document.addEventListener("DOMContentLoaded", () => {
  const musicList = ["ukulele", "summer", "hey"];
  let currentIndex = 0;

  const musicContainer = document.querySelector(".music-container");
  const audio = document.querySelector("audio");

  const actionBtn = document.querySelector("#actionBtn");
  const actionIcon = actionBtn.querySelector("i");
  const nextBtn = document.querySelector("#nextBtn");
  const prevBtn = document.querySelector("#prevBtn");

  const title = document.querySelector("#title");
  const image = document.querySelector(".image-container img");

  const progressOuter = document.querySelector(".progress-outer");
  const progressInner = document.querySelector(".progress-inner");

  const curTime = document.querySelector("#curtime");
  const endTime = document.querySelector("#endtime");

  const playMusic = function () {
    actionIcon.classList.remove("fa-play");
    actionIcon.classList.add("fa-pause");
    musicContainer.classList.add("active");

    audio.play();
  };

  const pauseMusic = function () {
    actionIcon.classList.remove("fa-pause");
    actionIcon.classList.add("fa-play");
    musicContainer.classList.remove("active");

    audio.pause();
  };

  const setTitleAndImage = function () {
    title.textContent = musicList[currentIndex];
    image.src = `images/${musicList[currentIndex]}.jpg`;
    audio.src = `music/${musicList[currentIndex]}.mp3`;
  };

  const toggleMusic = function () {
    if (audio.paused) playMusic();
    else pauseMusic();
  };

  const playNextMusic = function () {
    const nextMusicIndex = (currentIndex + 1) % musicList.length;
    currentIndex = nextMusicIndex;

    setTitleAndImage();
    playMusic();
  };

  const playPrevMusic = function () {
    const prevMusicIndex =
      (currentIndex - 1 + musicList.length) % musicList.length;
    currentIndex = prevMusicIndex;

    setTitleAndImage();
    playMusic();
  };

  const updateProgress = function (event) {
    const { duration, currentTime } = event.target;

    progressInner.style.width = `${100 * (currentTime / duration)}%`;
  };

  const setMusicTime = function (event) {
    const duration = audio.duration;
    audio.currentTime =
      (event.offsetX / event.currentTarget.offsetWidth) * duration;
  };

  const secondsToTime = function (sec) {
    let minutes = String(Math.floor(sec / 60));
    let seconds = String(Math.floor(sec % 60));
    if (minutes < 10) minutes = "0" + minutes;
    if (seconds < 10) seconds = "0" + seconds;
    return minutes + ":" + seconds;
  };

  const updateMusicTime = function (event) {
    if (isNaN(event.target.duration)) return;
    endTime.textContent = secondsToTime(event.target.duration);
    curTime.textContent = secondsToTime(event.target.currentTime);
  };

  actionBtn.addEventListener("click", toggleMusic);
  nextBtn.addEventListener("click", playNextMusic);
  prevBtn.addEventListener("click", playPrevMusic);

  audio.addEventListener("timeupdate", updateProgress);
  audio.addEventListener("timeupdate", updateMusicTime);
  audio.addEventListener("ended", playNextMusic);

  progressOuter.addEventListener("click", setMusicTime);
});
