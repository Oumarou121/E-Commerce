document.addEventListener("DOMContentLoaded", function () {
  const messagesList = document.getElementById("messages");
  const messageTitle = document.getElementById("message-title");
  const messageBody = document.getElementById("message-body");
  const messageTime = document.getElementById("message-time");
  const deleteBtn = document.getElementById("delete-btn");

  function renderMessages() {
    messagesList.innerHTML = "";
    messages.forEach((msg, index) => {
      const li = document.createElement("li");
      li.textContent = msg.sender;

      li.classList.toggle("unread", !msg.isRead);

      li.addEventListener("click", function () {
        messageTitle.textContent = msg.sender;
        messageBody.textContent = msg.message;
        messageTime.textContent = formatDate(msg.time);
        deleteBtn.style.display = "inline-block";
        deleteBtn.onclick = function () {
          messages.splice(index, 1);
          renderMessages();
          messageTitle.textContent = "Sélectionnez un message";
          messageBody.textContent = "Cliquez sur un message pour l'afficher.";
          messageTime.textContent = "";
          deleteBtn.style.display = "none";
        };
        msg.isRead = true;
        renderMessages();
      });

      messagesList.appendChild(li);
    });
  }

  renderMessages();
});
