document.addEventListener("DOMContentLoaded", () => {
  const cartContent1 = document.querySelector("#delivered ul");
  const cartContent2 = document.querySelector("#canceled ul");
  const cartContent3 = document.querySelector("#reported ul");
  const navLinks = document.querySelectorAll(".bar-nav li span");
  const tabContents = document.querySelectorAll(".tab-content");

  const empty = `<div class="cart-empty">
      <i class="uil uil-box"></i>
      <p>Your Orders Is Empty</p>
    </div>`;

  function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  navLinks.forEach((link) => {
    link.addEventListener("click", async function () {
      navLinks.forEach((nav) => nav.classList.remove("active"));
      tabContents.forEach((content) => (content.style.display = "none"));
      await delay(250);
      tabContents.forEach((content) => (content.style.transform = "scaleX(0)"));

      this.classList.add("active");
      const contentId = link.getAttribute("data-tab");
      const content = document.getElementById(contentId);

      if (content) {
        content.style.display = "block";
        await delay(250);
        content.style.transform = "scaleX(1)";
      }
    });
  });

  const statusTranslations = {
    pending: "En attente d'expédition",
    shipping: "En cours d'expédition",
    progressed: "En cours de livraison",
    "progressed-returned": "Retour en cours",
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

  const statusColors = {
    pending: "txt-yellow",
    shipping: "txt-light-blue",
    progressed: "txt-blue",
    "progressed-returned": "txt-light-orange",
    delivered: "txt-green",
    checking: "txt-purple",
    cancelled: "txt-red",
    returned: "txt-orange",
    "report-returned": "txt-dark-red",
    "dismiss-delivered": "txt-gray",
    "report-delivered": "txt-dark-green",
    "dismiss-returned": "txt-light-gray",
    postponed: "txt-brown",
  };

  if (orders.getOrders().length > 0) {
    const ordersList = orders
      .getOrders()
      .sort((a, b) => b.updateAt - a.updateAt);

    ordersList.forEach((order) => {
      const items = order.getItems();

      if (!items || items.length === 0) return;

      items.forEach((item) => {
        var date1 = null;
        var date2 = null;
        const date = item.history.at(-1).updateAt;
        const status = item.history.at(-1).status;
        const translatedStatus = statusTranslations[status] || status;
        const bgColor = statusColors[status] || "bg-default";
        let targetContainer = null;

        if (
          [
            "pending",
            "progressed",
            "progressed-returned",
            "delivered",
            "checking",
          ].includes(status)
        ) {
          targetContainer = cartContent1;
        } else if (["cancelled", "returned"].includes(status)) {
          targetContainer = cartContent2;
        } else if (
          [
            "report-returned",
            "dismiss-delivered",
            "report-delivered",
            "dismiss-returned",
          ].includes(status)
        ) {
          targetContainer = cartContent3;
        }

        if (
          [
            "progressed",
            "checking",
            "report-returned",
            "report-delivered",
          ].includes(status)
        ) {
          date1 = date;
          date2 = item.history.at(-1).endingAt;
        } else {
          date1 = date;
        }

        if (targetContainer) {
          targetContainer.appendChild(
            createCartItemHTML(
              item,
              order,
              date1,
              date2,
              bgColor,
              translatedStatus
            )
          );
        }
      });
    });
  }

  function createCartItemHTML(
    item,
    order,
    date1,
    date2,
    bgColor,
    translatedStatus
  ) {
    const cartItem = document.createElement("li");
    cartItem.classList.add("cart-item");
    cartItem.innerHTML = `
      <div class="image">
        <img src="${item.image}" alt="${item.productName}">
      </div>
      <div class="div-name">
        <div class="name text-black">${item.productName}</div>
        <div class="Num-comd">Commande #${order.id}</div>
        <div class="qty" aria-hidden="${item.quantity > 1 ? "false" : "true"}">
          Quantité: ${item.quantity}
        </div>
        <div class="state text-white ${bgColor}">
          ${translatedStatus}
        </div>
        <div class="time">
          ${formatDateOrder(date1, date2)}
        </div>
      </div>
      <div class="div-btn">
        <div class="Add text-black">
          <i class="uil uil-shopping-cart-alt"></i>
          DÉTAILS
        </div>
      </div>
    `;

    const detailsButton = cartItem.querySelector(".Add");
    detailsButton.addEventListener("click", () => {
      window.location = `detail.html?id=${order.id}`;
    });

    return cartItem;
  }

  [cartContent1, cartContent2, cartContent3].forEach((container) => {
    if (!container.children.length) {
      container.innerHTML = empty;
    }
  });
});
