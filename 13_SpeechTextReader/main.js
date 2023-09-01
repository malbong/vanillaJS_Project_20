document.addEventListener("DOMContentLoaded", () => {
  const data = [
    {
      image: "./img/drink.jpg",
      text: "I'm Thirsty",
    },
    {
      image: "./img/food.jpg",
      text: "I'm Hungry",
    },
    {
      image: "./img/tired.jpg",
      text: "I'm Tired",
    },
    {
      image: "./img/hurt.jpg",
      text: "I'm Hurt",
    },
    {
      image: "./img/happy.jpg",
      text: "I'm Happy",
    },
    {
      image: "./img/angry.jpg",
      text: "I'm Angry",
    },
    {
      image: "./img/sad.jpg",
      text: "I'm Sad",
    },
    {
      image: "./img/scared.jpg",
      text: "I'm Scared",
    },
    {
      image: "./img/outside.jpg",
      text: "I Want To Go Outside",
    },
    {
      image: "./img/home.jpg",
      text: "I Want To Go Home",
    },
    {
      image: "./img/school.jpg",
      text: "I Want To Go To School",
    },
    {
      image: "./img/grandma.jpg",
      text: "I Want To Go To Grandmas",
    },
  ];

  let voices = [];
  let currentUtterance = new SpeechSynthesisUtterance();

  const toggleBtn = document.querySelector("#toggleBtn");
  const voiceContainer = document.querySelector(".voice-container");
  const closeBtn = voiceContainer.querySelector("#closeBtn");
  const inputText = voiceContainer.querySelector("#input-text");
  const speakBtn = voiceContainer.querySelector("#speakBtn");

  const textContainer = document.querySelector(".text-container");

  const voiceSelect = voiceContainer.querySelector("#voice-select");

  const toggleVoiceContainer = function () {
    voiceContainer.classList.toggle("active");
  };

  const routeTextBox = function () {
    const DOMFragment = document.createDocumentFragment();
    data.forEach((v) => {
      const wrapper = document.createElement("div");
      wrapper.className = "text-box";
      wrapper.innerHTML = `<img src="${v.image}" alt="drink" /><p>${v.text}</p>`;

      wrapper.addEventListener("click", () => {
        speakText(v.text);
        wrapper.classList.add("active");

        setTimeout(() => {
          wrapper.classList.remove("active");
        }, 1000);
      });

      DOMFragment.appendChild(wrapper);
    });
    textContainer.appendChild(DOMFragment);
  };

  const createVoiceOption = function () {
    voices = speechSynthesis.getVoices();

    const DOMFragment = document.createDocumentFragment();
    voices.forEach((voice) => {
      const option = document.createElement("option");

      // option["data-lang"] = voice.lang;
      // option["data-name"] = voice.name;
      option.value = voice.name;
      option.textContent = `${voice.name} (${voice.lang})`;

      if (voice.default) {
        option.textContent += " - default voice";
        currentUtterance.voice = voice;
      }

      DOMFragment.appendChild(option);
    });

    voiceSelect.appendChild(DOMFragment);
  };

  const speakText = function (text) {
    currentUtterance.text = text;
    speechSynthesis.speak(currentUtterance);
  };

  const changeVoice = function () {
    voices.forEach((voice) => {
      if (voice.name === voiceSelect.value) {
        currentUtterance.voice = voice;
      }
    });
  };

  const speakInputText = function () {
    speakText(inputText.value);
  };

  /*
    The voiceschanged event of the Web Speech API is fired 
    when the list of SpeechSynthesisVoice objects that 
    would be returned by the SpeechSynthesis.getVoices() method has changed
    https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis/voiceschanged_event
  */
  speechSynthesis.addEventListener("voiceschanged", createVoiceOption);

  toggleBtn.addEventListener("click", toggleVoiceContainer);
  closeBtn.addEventListener("click", toggleVoiceContainer);

  voiceSelect.addEventListener("change", changeVoice);
  speakBtn.addEventListener("click", speakInputText);

  routeTextBox();
});
