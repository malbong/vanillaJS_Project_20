document.addEventListener("DOMContentLoaded", () => {
  let currentSeconds = 10;
  let currentScore = 0;
  let currentIndex = 0;

  let words = null;
  let backupWords = null;
  const wordsCount = 5;

  let timer = null;

  const word = document.querySelector("#word");
  const input = document.querySelector("#input");
  const time = document.querySelector("#time");
  const score = document.querySelector("#score");

  const toggleBtn = document.querySelector("#toggleBtn");
  const settingContainer = document.querySelector(".setting-container");

  const difficulty = document.querySelector("#difficulty");

  const endContainer = document.querySelector(".end-container");
  const endScore = document.querySelector("#end-score");
  const reloadBtn = document.querySelector("#reloadBtn");
  const progressBar = document.querySelector(".progress-inner");

  const setRandomWordsForBackup = async function () {
    const res = await fetch(
      `https://random-word-api.herokuapp.com/word?number=${wordsCount}`
    );
    backupWords = await res.json();
  };

  const updateTime = function () {
    currentSeconds -= 0.01;

    time.textContent = `Time left: ${currentSeconds.toFixed(1)}s`;
    progressBar.style.width = `${currentSeconds.toFixed(2) * 10}%`;
    if (currentSeconds <= 0) {
      endGame();
      clearInterval(timer);
    }
  };

  const updateScore = function () {
    word.textContent = words[currentIndex];
    score.textContent = `Score: ${currentScore}`;
  };

  const checkTypeValid = async function () {
    if (words[currentIndex] !== input.value) return;

    input.value = "";

    currentScore++;
    currentIndex++;
    currentSeconds += Number(difficulty.value);
    if (currentSeconds >= 10) currentSeconds = 10;

    if (currentIndex === wordsCount) {
      words = backupWords;
      currentIndex = 0;
      setRandomWordsForBackup();
    }

    updateScore();
    updateTime();
  };

  const changeDifficulty = function () {
    localStorage.setItem("difficulty", difficulty.value);

    reload();
  };

  const endGame = function () {
    endContainer.classList.add("active");
    endScore.textContent = `Your final score is ${currentScore}`;
  };

  const reload = function () {
    endContainer.classList.remove("active");

    input.value = "";
    init(true);
  };

  const toggleSetting = function () {
    if (settingContainer.classList.contains("active")) {
      settingContainer.classList.remove("active");
    } else {
      settingContainer.classList.add("active");
    }
  };

  const init = async function (isReload) {
    currentSeconds = 10;
    currentScore = 0;
    currentIndex = 0;

    const difficultyValue = localStorage.getItem("difficulty");
    if (difficultyValue) difficulty.value = difficultyValue;

    await setRandomWordsForBackup();
    words = backupWords;
    setRandomWordsForBackup();

    updateScore();
    updateTime();

    if (isReload) clearInterval(timer);
    timer = setInterval(updateTime, 10);

    if (!isReload) {
      toggleBtn.addEventListener("click", toggleSetting);
      input.addEventListener("input", checkTypeValid);
      difficulty.addEventListener("change", changeDifficulty);
      reloadBtn.addEventListener("click", reload);
    }
    input.focus();
  };

  init(false);
});
