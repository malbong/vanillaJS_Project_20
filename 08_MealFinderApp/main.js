document.addEventListener("DOMContentLoaded", () => {
  const inputForm = document.querySelector(".search-form");
  const input = document.querySelector("#search-input");

  const randomBtn = document.querySelector(".randomBtn");
  const mealInfoContainer = document.querySelector(".meal-info");

  const resultsContainer = document.querySelector(".search-results");

  const initContainer = function () {};

  const setTitle = function (name) {
    const title = document.createElement("h1");
    title.className = "title";
    title.textContent = name;

    mealInfoContainer.appendChild(title);
  };

  const setImage = function (src, name) {
    const image = document.createElement("img");
    image.className = "image";
    image.alt = name;
    image.src = src;

    mealInfoContainer.appendChild(image);
  };

  const setInfo = function (category, area) {
    const info = document.createElement("div");
    info.className = "info";

    const pCategory = document.createElement("p");
    const pArea = document.createElement("p");
    pCategory.textContent = category;
    pArea.textContent = area;

    info.appendChild(pCategory);
    info.appendChild(pArea);

    mealInfoContainer.appendChild(info);
  };

  const setInstruction = function (content) {
    const wrapper = document.createElement("div");
    wrapper.className = "instructions";

    const pInstruction = document.createElement("p");
    pInstruction.textContent = content;

    wrapper.appendChild(pInstruction);

    mealInfoContainer.appendChild(wrapper);
  };

  const setIngredients = function (meal) {
    const wrapper = document.createElement("div");
    wrapper.className = "ingredients";

    const heading = document.createElement("h2");
    heading.textContent = "ingredients";
    wrapper.appendChild(heading);

    const ul = document.createElement("ul");
    for (let i = 1; i <= 20; ++i) {
      const ingredient = meal[`strIngredient${i}`];
      const measure = meal[`strIngredient${i}`];
      if (!ingredient || !measure) break;
      if (ingredient.length === 0 || measure.length === 0) break;

      const li = document.createElement("li");
      li.textContent = `${ingredient} - ${measure}`;

      ul.appendChild(li);
    }
    wrapper.appendChild(ul);

    mealInfoContainer.appendChild(wrapper);
  };

  const showMealInfo = function (meal) {
    resultsContainer.classList.remove("active");
    mealInfoContainer.classList.add("active");

    while (mealInfoContainer.hasChildNodes())
      mealInfoContainer.removeChild(mealInfoContainer.firstChild);

    setTitle(meal.strMeal);
    setImage(meal.strMealThumb, meal.strMeal);
    setInfo(meal.strCategory, meal.strArea);
    setInstruction(meal.strInstructions);
    setIngredients(meal);
  };

  const getRandomMeal = async function () {
    const res = await fetch(
      "https://www.themealdb.com/api/json/v1/1/random.php"
    );
    const json = await res.json();
    const meal = json.meals[0];
    showMealInfo(meal);
  };

  const setSearchMessage = function (message) {
    const searchMessage = document.createElement("h2");
    searchMessage.className = "message";
    searchMessage.textContent = message;

    resultsContainer.appendChild(searchMessage);
  };

  const setMealsImages = function (meals) {
    const wrapper = document.createElement("div");
    wrapper.className = "meals";

    const DOMFragment = document.createDocumentFragment();
    meals.forEach((meal) => {
      const mealWrapper = document.createElement("div");
      mealWrapper.className = "meal";

      const image = document.createElement("img");
      image.src = meal.strMealThumb;
      image.alt = meal.strMeal;
      mealWrapper.appendChild(image);

      const nameWrapper = document.createElement("div");
      nameWrapper.className = "name";

      const name = document.createElement("span");
      name.textContent = meal.strMeal;

      nameWrapper.appendChild(name);
      mealWrapper.appendChild(nameWrapper);

      mealWrapper.addEventListener("click", () => {
        showMealInfo(meal);
      });

      DOMFragment.appendChild(mealWrapper);
    });
    wrapper.appendChild(DOMFragment);

    resultsContainer.appendChild(wrapper);
  };

  const showSearchResults = function (meals) {
    mealInfoContainer.classList.remove("active");
    resultsContainer.classList.add("active");

    while (resultsContainer.hasChildNodes())
      resultsContainer.removeChild(resultsContainer.firstChild);

    if (meals === null) {
      setSearchMessage(
        `There are no '${input.value}' search results. Try again!`
      );
      return;
    }
    setSearchMessage(`Search results for '${input.value}'`);
    setMealsImages(meals);
  };

  const getSearchMeals = async function (e) {
    e.preventDefault();
    if (input.value === null || input.value.length === 0) {
      alert("Please enter a search term");
      return;
    }

    const res = await fetch(
      `https://www.themealdb.com/api/json/v1/1/search.php?s=${input.value}`
    );
    const json = await res.json();
    const meals = json.meals;

    showSearchResults(meals);

    input.value = "";
  };

  randomBtn.addEventListener("click", getRandomMeal);
  inputForm.addEventListener("submit", getSearchMeals);
});
