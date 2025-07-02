document.addEventListener("DOMContentLoaded", () => {
  const trackContent = document.getElementById("track-list");

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

  const statusColors = {
    pending: "txt-yellow",
    shipping: "txt-light-blue",
    progress: "txt-blue",
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

  const statusIcons = {
    pending: "uil uil-clock",
    shipping: "uil uil-truck",
    progress: "uil uil-package",
    delivered: "uil uil-check-circle",
    checking: "uil uil-search",
    cancelled: "uil uil-times-circle",
    returned: "uil uil-arrow-left",
    "report-returned": "uil uil-exclamation-circle",
    "dismiss-delivered": "uil uil-ban",
    "report-delivered": "uil uil-calendar-alt",
    "dismiss-returned": "uil uil-times",
    postponed: "uil uil-clock-five",
  };

  const params = new URLSearchParams(window.location.search);
  const orderId = params.get("id") || "";
  const productId = params.get("index") || "";
  const title = document.getElementById("title");
  const order = orders.getOrderById(Number(orderId))[0];
  const item = order ? order.getItems()[Number(productId)] : null;
  title.href = `detail.html?id=${orderId}`;
  title.innerText = `Order #${orderId}`;

  if (order && item) {
    const history = item.history;

    history.forEach((hs, index) => {
      const date = formatDate(hs.updateAt);
      const status = hs.status;
      const translatedStatus = statusTranslations[status] || status;
      const txtColor = statusColors[status] || "txt-default";
      const iconClass = statusIcons[status] || "uil uil-question-circle";

      const trackItem = document.createElement("li");
      trackItem.classList.add("track-item", "active");
      if (index === history.length - 1) {
        trackItem.innerHTML = `
          <i class="icon ${iconClass} ${txtColor}"></i>
          <div class="progress one">
              <p>${index + 1}</p>
              <i class="uil uil-circle custom-style"></i>
          </div>
          <div>
              <p class="text ${txtColor}">${translatedStatus}</p>
              <p class="text1">${date}</p>
          </div>
        `;
      } else {
        trackItem.innerHTML = `
          <i class="icon ${iconClass} ${txtColor}"></i>
          <div class="progress one">
              <p>${index + 1}</p>
              <i class="uil uil-check"></i>
          </div>
          <div>
              <p class="text ${txtColor}">${translatedStatus}</p>
              <p class="text1">${date}</p>
          </div>
        `;
      }
      trackContent.appendChild(trackItem);
    });
  }
});
