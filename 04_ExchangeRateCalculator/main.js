document.addEventListener("DOMContentLoaded", () => {
  const http = new XMLHttpRequest();
  const url = `https://open.er-api.com/v6/latest/$CUR`;

  const curFrom = document.querySelector("#from");
  const curTo = document.querySelector("#to");
  const amountFrom = document.querySelector("#amount-from");
  const amountTo = document.querySelector("#amount-to");
  const rateText = document.querySelector("#calc__rate");
  const swapBtn = document.querySelector(".calc__swapBtn");

  const routeSelect = function (select, countries) {
    const originSelectedValue = select.value;
    while (select.hasChildNodes()) {
      select.removeChild(select.firstChild);
    }

    for (const country in countries) {
      const option = document.createElement("option");
      option.value = country;
      option.textContent = country;
      select.appendChild(option);
    }
    select.value = originSelectedValue;
  };

  const updateDate = function (date) {
    const updatedDate = document.querySelector(".rate__update__date span");
    updatedDate.textContent = date.toString();
  };

  const request = function (currency, callback) {
    http.open("GET", url.replace("$CUR", currency));
    http.send();
    http.onreadystatechange = () => {
      if (http.readyState === 4 && http.status === 200) {
        callback(JSON.parse(http.response));
      }
    };
  };

  const init = function () {
    request("AED", (res) => {
      routeSelect(curFrom, res.rates);
      routeSelect(curTo, res.rates);
      updateDate(new Date(res.time_last_update_utc));
      calc();
    });
  };

  const calc = function () {
    request(curFrom.value, (res) => {
      const rate = res.rates[curTo.value];
      rateText.textContent = `1 ${curFrom.value} = ${rate} ${curTo.value}`;
      amountTo.value = (amountFrom.value * rate).toFixed(2);
    });
  };

  curFrom.addEventListener("change", calc);
  curTo.addEventListener("change", calc);
  amountFrom.addEventListener("input", calc);
  amountTo.addEventListener("input", calc);

  swapBtn.addEventListener("click", () => {
    const tmp = curFrom.value;
    curFrom.value = curTo.value;
    curTo.value = tmp;
    calc();
  });

  init();
});
