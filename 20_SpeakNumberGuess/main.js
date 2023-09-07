document.addEventListener("DOMContentLoaded", () => {
  window.SpeechRecognition =
    window.SpeechRecognition || webkitSpeechRecognition;
  const recognition = new window.SpeechRecognition();

  const messageContainer = document.querySelector("#message-container");
  const numberBox = messageContainer.querySelector("#number-box");
  const message = messageContainer.querySelector("#message");
  const againBtn = document.querySelector("#againBtn");

  const loaderContainer = document.querySelector("#loader-container");

  let answerNumber = Math.floor(Math.random() * 100) + 1;
  console.log(answerNumber);

  const checkResults = function (event) {
    const speechNumber = Number(event.results[0][0].transcript);

    messageContainer.classList.add("active");

    if (isNaN(speechNumber) || speechNumber <= 0 || speechNumber > 100) {
      numberBox.textContent = event.results[0][0].transcript;
      message.textContent = "speack 1 - 100 number..";
      return;
    }

    numberBox.textContent = speechNumber;
    if (speechNumber === answerNumber) {
      messageContainer.classList.add("answer");
      loaderContainer.classList.add("answer");

      message.textContent = "Congrats! You have guessed the number!";
      recognition.paused = true;
    } else {
      if (speechNumber < answerNumber) message.textContent = "GO HIGHER";
      else message.textContent = "GO LOWER";
    }
  };

  againBtn.addEventListener("click", () => {
    window.location.reload();
  });

  recognition.addEventListener("speechstart", () => {
    loaderContainer.classList.add("speaking");
  });

  recognition.addEventListener("speechend", () => {
    loaderContainer.classList.remove("speaking");
  });

  recognition.addEventListener("result", checkResults);

  recognition.addEventListener("end", () => {
    if (!recognition.paused) recognition.start();
  });
  recognition.start();
});
