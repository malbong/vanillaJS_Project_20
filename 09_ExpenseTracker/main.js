document.addEventListener("DOMContentLoaded", () => {
  let histories = [];

  const form = document.querySelector("form");
  const inputName = document.querySelector("#name");
  const inputAmount = document.querySelector("#amount");
  const inputList = document.querySelector(".history-list");

  const total = document.querySelector("#total");
  const income = document.querySelector("#income");
  const expense = document.querySelector("#expense");

  const deleteHistory = function (deleteID, e) {
    histories = histories.filter((history) => history.id !== deleteID);
    updateLocalStorage();
    init();
  };

  const updateTotal = function () {
    let incomeSum = 0;
    let expenseSum = 0;
    histories.forEach((history) => {
      if (history.amount >= 0) incomeSum += history.amount;
      else expenseSum += history.amount;
    });

    if (incomeSum + expenseSum < 0)
      total.textContent = `-$${-(incomeSum + expenseSum)}`;
    else total.textContent = `$${incomeSum + expenseSum}`;

    income.textContent = `$${incomeSum}`;
    expense.textContent = `$${-expenseSum}`;
  };

  const addHistoryToDOM = function (history) {
    const li = document.createElement("li");
    li.className = "history";

    const name = document.createElement("span");
    name.textContent = history.name;
    li.appendChild(name);

    const amount = document.createElement("span");
    if (history.amount >= 0) {
      amount.textContent = `+${history.amount}`;
      li.classList.add("plus");
    } else {
      amount.textContent = history.amount;
      li.classList.add("minus");
    }
    li.appendChild(amount);

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "X";
    deleteBtn.className = "deleteBtn";
    deleteBtn.addEventListener(
      "click",
      deleteHistory.bind(deleteBtn, history.id)
    );
    li.appendChild(deleteBtn);

    inputList.appendChild(li);

    updateTotal();
  };

  const updateLocalStorage = function () {
    localStorage.setItem("histories", JSON.stringify(histories));
  };

  const init = function () {
    inputList.innerHTML = "";

    histories = JSON.parse(localStorage.getItem("histories"));

    if (histories === null) histories = [];
    else histories.forEach((history) => addHistoryToDOM(history));
  };

  const getID = function () {
    if (histories.length === 0) return 0;
    return histories[histories.length - 1].id + 1;
  };

  const addHistroy = function (e) {
    e.preventDefault();

    if (
      inputName.value === null ||
      inputName.value.trim() === "" ||
      inputAmount.value === null ||
      inputAmount.value.trim() === ""
    ) {
      alert("Please add a text and amount.");
      return;
    }

    const history = {
      id: getID(),
      name: inputName.value,
      amount: Number(inputAmount.value),
    };

    histories.push(history);
    addHistoryToDOM(history);
    updateLocalStorage();

    inputName.value = "";
    inputAmount.value = "";
  };

  form.addEventListener("submit", addHistroy);

  init();
});
