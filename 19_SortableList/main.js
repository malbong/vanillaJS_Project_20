document.addEventListener("DOMContentLoaded", () => {
  let currentDragTarget = null;

  let richestPeople = [];

  const listContainer = document.querySelector("#list-container");
  const loadingImage = document.querySelector("#loading");

  const getRichestPeopleName = async function () {
    const res = await fetch(
      "https://forbes400.onrender.com/api/forbes400?limit=10"
    );
    const json = await res.json();
    return json.map((v) => v.person.name);
  };

  const createList = async function () {
    richestPeople = await getRichestPeopleName();
    const randomOrderPeople = richestPeople
      .map((p) => [p, Math.random()])
      .sort((a, b) => a[1] - b[1])
      .map((a) => a[0]);
    randomOrderPeople.forEach((name, index) => {
      const li = document.createElement("li");
      li.className = "list";
      li.innerHTML = `<div class="number">${index + 1}</div>
                        <div class="draggable" draggable="true">
                        <p class="name">${name}</p>
                        <i class="fa-solid fa-grip-lines"></i>
                      </div>`;
      listContainer.appendChild(li);
    });
  };

  const swapPosition = function (a, b) {
    const parentA = a.parentNode;
    const parentB = b.parentNode;
    parentA.appendChild(b);
    parentB.appendChild(a);
  };

  const dragstart = function (event) {
    currentDragTarget = event.currentTarget;
    currentDragTarget.classList.add("dragging");
  };

  const dragenter = function (event) {
    event.currentTarget.classList.add("over");
  };

  const dragleave = function (event) {
    event.currentTarget.classList.remove("over");
  };

  const dragover = function (event) {
    event.preventDefault();
  };

  const drop = function (event) {
    currentDragTarget.classList.remove("dragging");
    event.currentTarget.classList.remove("over");

    swapPosition(currentDragTarget, event.currentTarget);
    checkOrder();
  };

  const checkOrder = function () {
    const draggableList = Array.from(document.querySelectorAll(".draggable"));
    draggableList.forEach((list, index) => {
      const name = list.querySelector(".name").textContent;
      if (name === richestPeople[index]) {
        list.classList.remove("wrong");
        list.classList.add("correct");
      } else {
        list.classList.remove("correct");
        list.classList.add("wrong");
      }
    });
  };

  const init = async function () {
    await createList();
    listContainer.classList.remove("loading");
    loadingImage.remove();

    const draggableList = Array.from(document.querySelectorAll(".draggable"));
    draggableList.forEach((draggable) => {
      draggable.addEventListener("dragstart", dragstart);
      draggable.addEventListener("dragenter", dragenter);
      draggable.addEventListener("dragleave", dragleave);
      draggable.addEventListener("dragover", dragover);
      draggable.addEventListener("drop", drop);
    });
    checkOrder();
  };

  init();
});
