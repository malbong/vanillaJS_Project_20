document.addEventListener("DOMContentLoaded", () => {
  const movieSeats = document.querySelector(".movie__seats");

  const seatsRoute = function () {
    for (let i = 0; i < 10; ++i) {
      const rowSeats = document.createElement("div");
      rowSeats.className = "row";

      for (let j = 0; j < 10; ++j) {
        const seat = document.createElement("div");
        seat.className = "seat";
        rowSeats.appendChild(seat);
      }

      movieSeats.appendChild(rowSeats);
    }
  };
  seatsRoute();

  const totalCount = document.querySelector(".movie__total #count");
  const totalPrice = document.querySelector(".movie__total #price");
  const selectedMovie = document.querySelector("#movies");
  const seats = document.querySelectorAll(".movie__seats .row .seat");
  const clearBtn = document.querySelector(".movie__clearBtn");

  const updateTotal = function () {
    let selectedCount = 0;
    const selectedIndices = [];
    seats.forEach((seat, index) => {
      if (seat.classList.contains("selected")) {
        selectedCount++;
        selectedIndices.push(index);
      }
    });

    totalCount.textContent = selectedCount;
    totalPrice.textContent = selectedCount * selectedMovie.value;

    localStorage.setItem("selectedMovie", selectedMovie.selectedIndex);
    localStorage.setItem(
      `selectedSeats${selectedMovie.selectedIndex}`,
      JSON.stringify(selectedIndices)
    );
  };

  const seatsInit = function () {
    const selectedMovieIndex = localStorage.getItem("selectedMovie");
    if (selectedMovieIndex !== null) {
      selectedMovie.selectedIndex = selectedMovieIndex;
    }

    const selectedSeats = JSON.parse(
      localStorage.getItem(`selectedSeats${selectedMovieIndex}`)
    );
    if (selectedSeats !== null) {
      seats.forEach((seat, index) => {
        if (selectedSeats.indexOf(index) !== -1) {
          seat.classList.add("selected");
        } else {
          seat.classList.remove("selected");
        }
      });
    } else {
      seats.forEach((seat) => {
        seat.classList.remove("selected");
      });
    }
    updateTotal();
  };

  selectedMovie.addEventListener("change", () => {
    localStorage.setItem("selectedMovie", selectedMovie.selectedIndex);
    seatsInit();
  });

  movieSeats.addEventListener("click", (event) => {
    if (
      event.target.classList.contains("seat") &&
      !event.target.classList.contains("occupied")
    ) {
      event.target.classList.toggle("selected");
      updateTotal();
    }
  });

  clearBtn.addEventListener("click", () => {
    seats.forEach((seat) => {
      if (seat.classList.contains("selected")) {
        seat.classList.remove("selected");
      }
    });
    updateTotal();
  });

  seatsInit();
});
