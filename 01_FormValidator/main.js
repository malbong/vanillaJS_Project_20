function showSuccess(input) {
  const formInput = input.parentElement;
  formInput.className = "form__inputs valid";
}

function showFail(input, message) {
  const formInput = input.parentElement;
  formInput.className = "form__inputs invalid";

  const errorMessage = formInput.querySelector("small");
  errorMessage.textContent = message;
}

function isValidLength(input, min, max) {
  return min <= input.value.length && input.value.length <= max;
}

function isValidEmail(email) {
  let regex = new RegExp("[a-z0-9]+@[a-z]+.[a-z]{2,3}");
  return regex.test(email.value);
}

function isValidConfirmPassword(password, confirmPassword) {
  if (confirmPassword.value === "") return false;
  return password.value === confirmPassword.value;
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".form");

  const username = document.querySelector("#username");
  const email = document.querySelector("#email");
  const password = document.querySelector("#password");
  const confirmPassword = document.querySelector("#confirm_password");

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (isValidLength(username, 6, 15)) showSuccess(username);
    else showFail(username, `Username must be 6-15 characters`);

    if (isValidEmail(email)) showSuccess(email);
    else showFail(email, `Email is not Valid`);

    if (isValidLength(password, 6, 25)) showSuccess(password);
    else showFail(password, `Password must be 6-25 characters`);

    if (isValidConfirmPassword(password, confirmPassword))
      showSuccess(confirmPassword);
    else showFail(confirmPassword, `invalid confirm password`);
  });
});
