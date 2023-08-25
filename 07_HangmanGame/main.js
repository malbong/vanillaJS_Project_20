document.addEventListener("DOMContentLoaded", () => {
  let randomWord = null;
  let correctLetters = [];
  let wrongLetters = [];
  let timerID = null;

  const word = document.querySelector(".word");
  const wrong = document.querySelector(".wrong");
  const endContainer = document.querySelector(".end__container");
  const endMessage = document.querySelector(".end__message h2");
  const endRetryBtn = document.querySelector(".end__container .retryBtn");
  const parts = document.querySelectorAll(".parts");
  const messageContainer = document.querySelector(".message__container");
  const gameRetryBtn = document.querySelector(".game__container .retryBtn");
  const gameAnswerBtn = document.querySelector(".game__container .answerBtn");

  const updateDOM = function (isWrong) {
    word.removeChild();
    // word render
    word.innerHTML = "";
    for (let i = 0; i < randomWord.length; ++i) {
      const span = document.createElement("span");
      span.className = "letter";
      if (randomWord[i] === correctLetters[i]) {
        span.textContent = correctLetters[i];
      }
      word.appendChild(span);
    }

    // wrong render
    wrong.innerHTML = "";
    wrongLetters.forEach((letter, index) => {
      let ret = "";
      if (index === 0) wrong.innerHTML = "<h2>Wrong letters<h2>";
      ret += `<span class="letter">`;
      if (index !== 0) ret += ", " + letter;
      else ret += letter;
      ret += `</span>`;
      wrong.innerHTML += ret;
    });

    // hangman render
    parts.forEach((figure, index) => {
      if (index < wrongLetters.length) {
        figure.classList.remove("hidden");
      } else {
        figure.classList.add("hidden");
      }
    });
  };

  const start = async function () {
    const res = await fetch("https://random-word-api.herokuapp.com/word");
    const json = await res.json();
    randomWord = json[0].split("");

    wrongLetters = [];
    correctLetters = [];
    for (let i = 0; i < randomWord.length; ++i) {
      correctLetters.push(" ");
    }

    updateDOM();
    window.addEventListener("keyup", keyboardEvent);
    console.log(randomWord);
  };

  const checkDuplication = function (input) {
    if (correctLetters.includes(input) || wrongLetters.includes(input)) {
      clearTimeout(timerID);

      messageContainer.classList.add("active");

      timerID = setTimeout(() => {
        messageContainer.classList.remove("active");
      }, 2000);
      return true;
    }
    return false;
  };

  const checkCorrect = function (input) {
    let isCorrect = false;
    for (let i = 0; i < randomWord.length; ++i) {
      if (randomWord[i] === input) {
        correctLetters[i] = input;
        isCorrect = true;
      }
    }
    return isCorrect;
  };

  const checkFinished = function () {
    // lost
    if (wrongLetters.length === 6) {
      endContainer.classList.add("active");
      endMessage.textContent = `Unfortunately you lost. 😕`;
      window.removeEventListener("keyup", keyboardEvent);
    }
    // win
    else if (!correctLetters.includes(" ")) {
      endContainer.classList.add("active");
      endMessage.textContent = `Congratulations! You won! 😃`;
      window.removeEventListener("keyup", keyboardEvent);
    }
  };

  const keyboardEvent = function (event) {
    if (randomWord === null) return;
    if (!event.code.startsWith("Key")) return;

    const input = event.code[3].toLowerCase();

    if (checkDuplication(input)) return;

    if (checkCorrect(input) === false) {
      wrongLetters.push(input);
    }

    updateDOM();
    checkFinished();
  };

  endRetryBtn.addEventListener("click", () => {
    endContainer.classList.remove("active");
    start();
  });

  gameRetryBtn.addEventListener("click", start);

  gameAnswerBtn.addEventListener("click", () => {
    correctLetters = randomWord;
    updateDOM();
    window.removeEventListener("keyup", keyboardEvent);
  });

  endContainer.addEventListener("click", (event) => {
    if (event.target === endContainer) endContainer.classList.remove("active");
  });

  start();
});
