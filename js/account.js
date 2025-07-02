document.addEventListener("DOMContentLoaded", function () {
  const statusTranslations = {
    pending: "En attente d'expédition",
    shipping: "En cours d'expédition",
    progress: "En cours de livraison",
    delivered: "Livré",
    checking: "En vérification",
    cancelled: "Annulé",
    returned: "Retourné",
    "report-returned": "Retour reporté",
    "dismiss-delivered": "Livraison rejetée",
    "report-delivered": "Livraison reportée",
    "dismiss-returned": "Retour rejeté",
    postponed: "Commande reportée",
  };
  const logout = document.getElementById("logout");
  const name = document.getElementById("name");
  const address = document.getElementById("address");
  const nbrAddress = document.getElementById("nbr-address");
  const nbrOrders = document.getElementById("nbr-orders");
  const currentAdress = user.addresses[user.currentIndex];
  const lastOrderContent = document.getElementById("last-order-content");
  const unrealMessage = document.getElementById("messages-link");

  logout.addEventListener("click", () => {
    alert("You have been logged out");
  });

  name.innerHTML = "";
  address.innerHTML = "";
  nbrAddress.innerHTML = "";

  name.innerHTML = currentAdress.firstName + " " + currentAdress.lastName;
  address.innerHTML = `
  ${currentAdress.district} / ${currentAdress.street}<br />
  ${currentAdress.phoneNumber1} / ${currentAdress.phoneNumber2}<br />
  ${currentAdress.region} / Niger<br />
  <br />
`;
  if (
    currentAdress.district &&
    currentAdress.street &&
    currentAdress.phoneNumber1 &&
    currentAdress.phoneNumber2 &&
    currentAdress.region
  ) {
    address.style.opacity = 1;
  } else {
    address.style.opacity = 0;
  }

  nbrAddress.innerHTML = `View Addresses (${user.addresses.length})`;
  const ordersList = orders.getOrders();
  const ordersLength = ordersList.length;

  lastOrderContent.innerHTML = "";
  if (ordersLength > 0) {
    const lastOrder = ordersList.sort((a, b) => b.updateAt - a.updateAt)[0];
    const translatedStatus =
      statusTranslations[lastOrder.status] || lastOrder.status;
    lastOrderContent.innerHTML = `
    <div class="order-card">
      <p><strong>Order ID:</strong> #${lastOrder.id}</p>
      <p><strong>Date:</strong> ${formatDate(lastOrder.updateAt)}</p>
      <p><strong>Status:</strong> ${translatedStatus}</p>
      <p><strong>Total:</strong> ${lastOrder.totalPrice.toLocaleString(
        "de-DE"
      )} FCFA</p>
      <a href="detail.html?id=${
        lastOrder.id
      }" class="order-details">View Details</a>
    </div>
  `;
    nbrOrders.innerHTML = `<a href="order.html">View Orders (${ordersLength})</a>`;
  } else {
    nbrOrders.innerHTML = "You haven't placed any orders yet.";
  }

  unrealMessage.innerHTML = `View Messages (${
    messages.filter((msg) => !msg.isRead).length
  })`;
});
