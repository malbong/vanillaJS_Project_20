document.addEventListener("DOMContentLoaded", () => {
  const peopleDOM = document.querySelector("main .people");

  const addBtn = document.querySelector("button.addBtn");
  const multiplyBtn = document.querySelector("button.multiplyBtn");
  const filterBtn = document.querySelector("button.filterBtn");
  const sortBtn = document.querySelector("button.sortBtn");
  const calcBtn = document.querySelector("button.calcBtn");

  let users = [];

  const formatMoney = function (money) {
    if (money < 1000) return String(money);

    const listMoney = String(money).split("").reverse();
    const ret = [];
    for (let i = 0; i < listMoney.length; ++i) {
      if (i !== 0 && i % 3 === 0) ret.push(",");
      ret.push(listMoney[i]);
    }
    return ret.reverse().join("");
  };

  const updateDOM = function () {
    while (peopleDOM.hasChildNodes()) {
      peopleDOM.removeChild(peopleDOM.firstChild);
    }

    users.forEach((user) => {
      const userDOM = document.createElement("section");
      const formattedMoney = formatMoney(user.money);
      userDOM.className = "person";
      userDOM.innerHTML = `<span class="name">${user.name}</span>
                          <span class="money">$${formattedMoney}</span>`;
      peopleDOM.appendChild(userDOM);
    });
  };

  const addUser = function () {
    fetch("https://randomuser.me/api/")
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        const ret = data.results[0];
        const fullName = `${ret.name.first} ${ret.name.last}`;
        const user = {
          name: fullName,
          money: Math.floor(Math.random() * 1000000),
        };
        users.push(user);
        updateDOM();
      });
  };

  const multiplyMoney = function () {
    users.forEach((user) => {
      user.money *= 2;
    });
    updateDOM();
  };

  const filterRich = function () {
    users = users.filter((user) => user.money >= 1000000);
    updateDOM();
  };

  const sortByMoney = function () {
    users.sort((a, b) => b.money - a.money);
    updateDOM();
  };

  const calcEntryMoney = function () {
    if (document.querySelector("main .people .total")) return;

    const totalMoney = users.reduce((acc, user) => acc + user.money, 0);
    const formattedMoney = formatMoney(totalMoney);

    const totalDOM = document.createElement("section");
    totalDOM.className = "total";
    totalDOM.innerHTML = `<span>Total Money:</span>
                          <span>$${formattedMoney}</span>`;
    peopleDOM.appendChild(totalDOM);
  };

  addBtn.addEventListener("click", addUser);
  multiplyBtn.addEventListener("click", multiplyMoney);
  filterBtn.addEventListener("click", filterRich);
  sortBtn.addEventListener("click", sortByMoney);
  calcBtn.addEventListener("click", calcEntryMoney);

  for (let i = 0; i < 3; ++i) addUser();
});
