document.addEventListener("DOMContentLoaded", () => {
  const video = document.querySelector(".video__main");
  const playpauseBtn = document.querySelector("#playpauseBtn");
  const stopBtn = document.querySelector("#stopBtn");
  const progress = document.querySelector("#progress");
  const timestamp = document.querySelector("#timestamp");

  const toggleVideo = function () {
    if (video.paused) {
      updatePlayBtnToPause();
      video.play();
    } else {
      updatePauseBtnToPlay();
      video.pause();
    }
  };

  const stopVideo = function () {
    if (!video.paused) updatePauseBtnToPlay();
    video.pause();
    video.currentTime = 0;
  };

  const updatePlayBtnToPause = function () {
    const playIcon = playpauseBtn.querySelector(".fa-play");
    playIcon.classList.remove("fa-play");
    playIcon.classList.add("fa-pause");
  };

  const updatePauseBtnToPlay = function () {
    const pauseIcon = playpauseBtn.querySelector(".fa-pause");
    pauseIcon.classList.remove("fa-pause");
    pauseIcon.classList.add("fa-play");
  };

  const updateVideoProgress = function () {
    progress.value = (video.currentTime / video.duration) * 100;

    let minutes = Math.floor(video.currentTime / 60);
    if (minutes < 10) {
      minutes = "0" + String(minutes);
    }

    let seconds = Math.floor(video.currentTime % 60);
    if (seconds < 10) {
      seconds = "0" + String(seconds);
    }

    timestamp.textContent = `${minutes}:${seconds}`;
  };

  const setVideoProgress = function () {
    video.currentTime = (progress.value / 100) * video.duration;
  };

  video.addEventListener("click", toggleVideo);
  video.addEventListener("timeupdate", updateVideoProgress);

  playpauseBtn.addEventListener("click", toggleVideo);

  stopBtn.addEventListener("click", stopVideo);

  // progress.addEventListener("change", setVideoProgress);
  progress.addEventListener("input", setVideoProgress);
});
