document.addEventListener("DOMContentLoaded", () => {
  let randomWord = null;
  let isPlaying = false;
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
    isPlaying = true;
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
    if (wrongLetters.length === 6) {
      endContainer.classList.add("active");
      endMessage.textContent = `Unfortunately you lost. 😕`;
      isPlaying = false;
    }
    if (!correctLetters.includes(" ")) {
      endContainer.classList.add("active");
      endMessage.textContent = `Congratulations! You won! 😃`;
      isPlaying = false;
    }
  };

  endRetryBtn.addEventListener("click", () => {
    endContainer.classList.remove("active");
    start();
  });

  gameRetryBtn.addEventListener("click", start);

  gameAnswerBtn.addEventListener("click", () => {
    correctLetters = randomWord;
    updateDOM();
  });

  // keyboard event
  window.addEventListener("keyup", (event) => {
    if (!isPlaying) return;
    if (randomWord === null) return;
    if (!event.code.startsWith("Key")) return;

    const input = event.code[3].toLowerCase();

    if (checkDuplication(input)) return;

    if (checkCorrect(input) === false) {
      wrongLetters.push(input);
    }

    updateDOM();
    checkFinished();
  });

  endContainer.addEventListener("click", (event) => {
    if (event.target === endContainer) endContainer.classList.remove("active");
  });

  start();
});
/*
구조 짜는게 힘듦
-> restart 버튼이 있어서 구조를 잘 짰어야 했음
-> 매번 입력때마다 돔을 업데이트한다면 편할 것
-> correctLetters, wrongLetters에 따라 DOM이 업데이트 된다면 편하게 작성할 수 있을 것

데이터 관리하는 방법 -> 가벼운 데이터를 들고 다님
-> 쉬운 DOM 랜더링을 위함임

word render와 wrong render의 차이를 보고 뭘 해야할 지 생각해봐라

api를 이용하는 것은 비동기에서 매우 중요함
-> 순서 로직 작성하는 것이 쉽지 않음
-> 보통 순서 비동기 API를 초기화 과정에 넣어두고, 이벤트 기반으로 움직이는 친구들은 데이터를 받지 못했다면 (data === null)이면 리턴해버림

키보드 기반 이벤트를 작성해봤음 -> event.code.startsWith("Key")는 알파벳 입력을 받았다고 생각했음

timer를 걸어두는 작업이 있었는데, 마지막 이벤트를 기준으로 타이머가 작동해야 하므로 아래의 형태로 작성함
let timerID = null;
function eventHandler () {
  clearTimeout(timerID);
  timerID = setTimeout(() => {
    messageContainer.classList.remove("active");
  }, 2000);
}

게임이 종료되었는데도 키 이벤트를 계속 받을 수 있는 문제가 있으므로 isPlaying같은 변수를 둬서 사용함
- 끝날 때 false
- 새로 라우팅때 true




*/
