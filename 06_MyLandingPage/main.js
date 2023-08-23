document.addEventListener("DOMContentLoaded", () => {
  const nav = document.querySelector("nav");
  const container = document.querySelector(".container");
  const toggleBtn = document.querySelector("button.toggleBtn");

  toggleBtn.addEventListener("click", () => {
    nav.classList.toggle("nav__active");
    container.classList.toggle("nav__active");
  });
});
