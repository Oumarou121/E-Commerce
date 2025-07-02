document.addEventListener("DOMContentLoaded", function () {
  const passwordInput = document.getElementById("password");
  const toggleButton = document.querySelector(".login__eye");
  const eyeOff = document.querySelector(".eye-off");
  const eyeOn = document.querySelector(".eye-on");

  toggleButton.addEventListener("click", function () {
    const isPassword = passwordInput.type === "password";
    passwordInput.type = isPassword ? "text" : "password";

    eyeOff.classList.toggle("hidden", !isPassword);
    eyeOn.classList.toggle("hidden", isPassword);
  });

  document.getElementById("sub-btn").addEventListener("click", function () {
    let errors = [];

    const firstName = document.getElementById("first-name");
    const lastName = document.getElementById("last-name");
    const email = document.getElementById("email");
    const password = document.getElementById("password");

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    document
      .querySelectorAll(".form-input")
      .forEach((input) => input.classList.remove("error"));

    const user = {
      firstName: firstName.value,
      lastName: lastName.value,
      email: email.value,
      password: password.value,
    };

    if (user.firstName.length <= 4) {
      errors.push("First name must contain more than 4 characters");
      firstName.classList.add("error");
    }
    if (user.lastName.length <= 4) {
      errors.push("Name must contain more than 4 characters");
      lastName.classList.add("error");
    }
    if (!emailPattern.test(user.email)) {
      errors.push("Please enter a valid email");
      email.classList.add("error");
    }
    if (user.password.length <= 6) {
      errors.push("Password must be more than 6 characters long");
      password.classList.add("error");
    }

    const errorContainer = document.querySelector(".error-content");
    const listError = document.createElement("ul");
    errorContainer.innerHTML = "";
    if (errors.length > 0) {
      errors.forEach((msg) => {
        const li = document.createElement("li");
        li.classList.add("error-message");
        li.textContent = msg;
        listError.appendChild(li);
      });
      errorContainer.appendChild(listError);
      errorContainer.classList.remove("hidden");
    } else {
      errorContainer.classList.add("hidden");
      console.log(user);
    }
  });
});
