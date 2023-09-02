document.addEventListener("DOMContentLoaded", () => {
  const loopTime = 7500;
  const step = loopTime / 5;

  const outerCircle = document.querySelector(".outer-circle");
  const message = document.querySelector(".message");

  const execLoop = function () {
    // grow
    outerCircle.classList.add("grow");
    outerCircle.classList.remove("shrink");
    message.textContent = "Breathe In !";

    // hold
    setTimeout(() => {
      message.textContent = "Hold !";
    }, 2 * step);

    // shrink
    setTimeout(() => {
      outerCircle.classList.add("shrink");
      outerCircle.classList.remove("grow");
      message.textContent = "Breathe Out !";
    }, 3 * step);

    setTimeout(execLoop, loopTime);
  };
  execLoop();
});
