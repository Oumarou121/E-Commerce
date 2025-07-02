document.addEventListener("DOMContentLoaded", function () {
  const errorMessage = document.getElementById("error-message");
  document
    .getElementById("submit-message")
    .addEventListener("click", function () {
      errorMessage.style.opacity = 0;
      const message = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        subject: document.getElementById("subject").value,
        message: document.getElementById("message").value,
        date: new Date().toLocaleDateString(),
      };

      if (
        !message.name ||
        !message.email ||
        !message.subject ||
        !message.message ||
        !message.date
      ) {
        errorMessage.style.opacity = 1;
        return;
      }

      errorMessage.style.opacity = 0;
      console.log(message);
    });
});
