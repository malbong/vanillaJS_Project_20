document.addEventListener("DOMContentLoaded", () => {
  const nav = document.querySelector("nav");
  const container = document.querySelector(".container");
  const toggleBtn = document.querySelector("button.toggleBtn");

  const signupBtn = document.querySelector(".signupBtn");
  const modal = document.querySelector(".modal__container");
  const modalCloseBtn = document.querySelector(".modal__closeBtn");

  const navCloseEvent = function (e) {
    if (!nav.classList.contains("nav__active")) return;

    let element = e.target;
    while (element !== document.body) {
      if (element === nav) {
        return;
      }
      element = element.parentElement;
    }
    closeNavbar();
  };

  const openNavbar = function () {
    nav.classList.add("nav__active");
    container.classList.add("nav__active");

    document.body.addEventListener("click", navCloseEvent);
  };

  const closeNavbar = function (e) {
    nav.classList.remove("nav__active");
    container.classList.remove("nav__active");

    document.body.removeEventListener("click", navCloseEvent);
  };

  toggleBtn.addEventListener("click", (event) => {
    event.stopPropagation();

    if (nav.classList.contains("nav__active")) closeNavbar();
    else openNavbar();
  });

  const openModal = function () {
    modal.classList.add("modal__active");
    document.body.classList.add("modal__active");
  };

  const closeModal = function () {
    modal.classList.remove("modal__active");
    document.body.classList.remove("modal__active");
  };

  signupBtn.addEventListener("click", openModal);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });
  modalCloseBtn.addEventListener("click", closeModal);
});
