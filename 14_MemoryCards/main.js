document.addEventListener("DOMContentLoaded", () => {
  let cards = [];
  let currentIndex = 0;

  const addBtn = document.querySelector("#addBtn");
  const deleteBtn = document.querySelector("#deleteBtn");
  const clearBtn = document.querySelector("#clearBtn");
  const addCardBtn = document.querySelector("#addCardBtn");

  const prevBtn = document.querySelector("#prevBtn");
  const nextBtn = document.querySelector("#nextBtn");
  const indexSpan = document.querySelector("#index");

  const addmodalOuter = document.querySelector(".addmodal-outer");
  const closeBtn = addmodalOuter.querySelector("#closeBtn");

  const question = addmodalOuter.querySelector("#question");
  const answer = addmodalOuter.querySelector("#answer");

  const cardContainer = document.querySelector(".card-container");

  const closeModal = function (e) {
    e.stopPropagation();
    if (
      e.target === addmodalOuter ||
      e.target === closeBtn ||
      e.target.parentElement === closeBtn
    ) {
      addmodalOuter.classList.remove("active");
    }
  };

  const showAddmodal = function () {
    addmodalOuter.classList.add("active");
  };

  const updateLocalStorage = function () {
    localStorage.setItem("cards", JSON.stringify(cards));
  };

  const flipCard = function (e) {
    e.currentTarget.classList.toggle("show");
  };

  const updatePosition = function () {
    Array.from(cardContainer.children).forEach((cardElement, index) => {
      cardElement.className = "card";

      const navIndex = index + 1;
      if (currentIndex === navIndex) {
        cardElement.classList.add("current");
      } else if (currentIndex - 1 === navIndex) {
        cardElement.classList.add("prev");
      } else if (currentIndex + 1 === navIndex) {
        cardElement.classList.add("next");
      }
    });
  };

  const updateNavIndex = function () {
    indexSpan.textContent = `${currentIndex} / ${cards.length}`;
  };

  const setPrevNavIndex = function () {
    if (currentIndex <= 1) return;
    currentIndex--;

    updateNavIndex();
    updatePosition();
  };

  const setNextNavIndex = function () {
    if (currentIndex >= cards.length) return;
    currentIndex++;

    updateNavIndex();
    updatePosition();
  };

  const addCardToDOM = function (card) {
    const cardElement = document.createElement("div");

    cardElement.innerHTML = `<div class="inner-card front">${card.question}</div>
                              <div class="inner-card back">${card.answer}</div>`;

    cardElement.addEventListener("click", flipCard);

    cardContainer.appendChild(cardElement);
  };

  const addCard = function () {
    if (question.value.trim() === "" || answer.value.trim() === "") {
      alert("enter a question and answer");
      return;
    }
    addmodalOuter.classList.remove("active");

    const newCard = {
      question: question.value.trim(),
      answer: answer.value.trim(),
    };
    cards.push(newCard);
    updateLocalStorage();

    addCardToDOM(newCard);
    if (cards.length === 1) currentIndex = 1;
    updateNavIndex();
    updatePosition();

    question.value = "";
    answer.value = "";
  };

  const deleteCard = function () {
    if (!confirm("are you sure?")) return;

    const deleteIndex = currentIndex;
    if (currentIndex === cards.length) currentIndex--;

    cards = cards.filter((card, index) => index + 1 !== deleteIndex);
    updateLocalStorage();

    Array.from(cardContainer.children).forEach((cardElement, index) => {
      if (index + 1 === deleteIndex) {
        cardContainer.removeChild(cardElement);
      }
    });

    updateNavIndex();
    updatePosition();
  };

  const clearCard = function () {
    cards = [];
    updateLocalStorage();

    init();
  };

  const makeBannerCard = function () {
    question.value = "Memory Card?";
    answer.value = "Click Add button!";
    addCard();
  };

  const init = function (isFirst) {
    cardContainer.innerHTML = "";

    cards = JSON.parse(localStorage.getItem("cards"));
    if (cards === null || cards.length === 0) {
      currentIndex = 0;
      if (isFirst) makeBannerCard();
    } else {
      currentIndex = 1;
      cards.forEach(addCardToDOM);
    }

    updateNavIndex();
    updatePosition();
  };

  addmodalOuter.addEventListener("click", closeModal);
  closeBtn.addEventListener("click", closeModal);
  addCardBtn.addEventListener("click", addCard);

  addBtn.addEventListener("click", showAddmodal);
  deleteBtn.addEventListener("click", deleteCard);
  clearBtn.addEventListener("click", clearCard);

  prevBtn.addEventListener("click", setPrevNavIndex);
  nextBtn.addEventListener("click", setNextNavIndex);

  init(true);
});
