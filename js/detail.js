document.addEventListener("DOMContentLoaded", () => {
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

  const params = new URLSearchParams(window.location.search);
  const orderId = params.get("id") || "";
  const order = orders.getOrderById(Number(orderId))[0];
  const items = order.getItems();
  document.getElementById(
    "title1"
  ).innerHTML = `Order #${order.id} - Niger.net`;
  document.getElementById("title2").innerHTML = `Order #${order.id}`;
  const productsContent = document.getElementById("products-content");
  document.getElementById("sub-total").innerHTML =
    formatPrice(order.totalPrice) + " FCFA";
  document.getElementById("shipping-total").innerHTML =
    formatPrice(order.deliveryPrice) + " FCFA";
  document.getElementById("total").innerHTML =
    formatPrice(order.totalPrice + order.deliveryPrice) + " FCFA";
  const orderSummary = document.querySelector(".order-summary");
  var nbrItem = 0;
  const modalCancelled = document.getElementById("confirmModal");
  const modal = document.getElementById("return-modal");
  const closeModal = document.querySelector(".close-btn");
  const submitReturn = document.getElementById("submit-return");
  const returnQuantityInput = document.querySelector(".quantity input");
  const returnReason = document.getElementById("return-reason");
  const returnJustification = document.getElementById("return-justification");
  const justificationPreview = document.getElementById("justification-preview");

  items.forEach((item, index) => {
    var date1 = null;
    var date2 = null;
    const date = item.history.at(-1).updateAt;
    const status = item.history.at(-1).status;
    const translatedStatus = statusTranslations[status] || status;
    const txtColor = statusColors[status] || "txt-default";
    const product = document.createElement("div");
    const canCancelled = status === "pending";
    const isReportAndDismiss = status.includes("report", "dismiss");
    product.classList.add("products-section");

    if (
      ["progress", "checking", "report-returned", "report-delivered"].includes(
        status
      )
    ) {
      date1 = date;
      date2 = item.history.at(-1).endingAt;
    } else {
      date1 = date;
    }

    let prevPriceHtml = "";
    if (item.priceReduction > 0) {
      prevPriceHtml = `
            <span class="prev-price">
                <span id="previewPrice">-${formatPrice(
                  item.priceReduction
                )} FCFA</span>
            </span>
        `;
    }

    product.innerHTML = `
  <div class="product">
    <div class="product-image-content">
      ${
        isReportAndDismiss
          ? `
          <span class="info-icon" id="infoIcon">i
            <span class="tooltip" id="tooltip">Consultez votre messagerie pour plus de détails.</span>
          </span>
        `
          : ""
      }
      <div class="product-image">
        <img src="${item.image}" alt="${item.productName}" />
        ${prevPriceHtml}
      </div>
    </div>
    <div class="product-content">
      <div class="content">
        <div class="name-content">
          <a href="product.html?id=${item.productId}" class="text-red">${
      item.productName
    }</a>
          <p class="text-gray">Couleur : ${
            item.color ? item.color : "Non spécifiée"
          }</p>
          <p>Statut : <span class="status ${txtColor}">${translatedStatus}</span></p>
        </div>
        <div class="price-content">
          <span class="text-red">${formatPrice(item.price)} FCFA</span>
          ${
            item.quantity > 1
              ? `<span class="text-red"> x ${item.quantity}</span>`
              : ""
          }
        </div>
      </div>
      <div class="order-info">
        <p><span class="delivery-date">${formatDateOrder(
          date1,
          date2
        )}</span></p>
        <button class="track-btn">Suivre la commande</button>
        ${
          canCancelled
            ? `<button class="cancelled-btn">Annulée la commande</button>`
            : ""
        }
        ${
          status === "delivered" && item.history?.length
            ? (() => {
                const endDate = item.history.at(-1).endingAt;
                const guarantee = item.history.at(-1).guarantee;

                if (Date.now() <= endDate) {
                  return `<button class="return-btn">Demande de retour</button>`;
                } else if (Date.now() <= guarantee) {
                  return `La période de retour s'est terminée le ${formatDate(
                    endDate
                  )}, mais si c'est en rapport avec la guarantee, consultez le Service après-vente`;
                } else {
                  return ``;
                }
              })()
            : ""
        }
      </div>
    </div>
  </div>
`;

    if (isReportAndDismiss) {
      const infoIcon = product.querySelector("#infoIcon");
      const tooltip = product.querySelector("#tooltip");

      infoIcon.addEventListener("mouseover", () => {
        tooltip.style.display = "block";
      });

      infoIcon.addEventListener("mouseout", () => {
        tooltip.style.display = "none";
      });
    }

    product.querySelector(".track-btn").addEventListener("click", () => {
      if (orderId && index !== undefined) {
        window.location.href = `track.html?id=${orderId}&index=${index}`;
      } else {
        console.error("ID ou index de commande manquant !");
      }
    });

    product.querySelector(".cancelled-btn")?.addEventListener("click", () => {
      modalCancelled.classList.add("show");
    });

    product.querySelector(".return-btn")?.addEventListener("click", (e) => {
      document.getElementById("return-product-image").src = item.image;
      document.getElementById("return-product-name").textContent =
        item.productName;
      document.getElementById(
        "return-product-price"
      ).textContent = `${formatPrice(item.price)} FCFA`;
      document.getElementById("return-product-quantity").textContent =
        item.quantity;
      modal.style.display = "flex";

      window.updateQuantity = (change) => {
        let currentQuantity = parseInt(returnQuantityInput.value, 10);
        let maxQuantity = parseInt(
          document.getElementById("return-product-quantity").textContent,
          10
        );

        if (isNaN(currentQuantity)) currentQuantity = 1;
        currentQuantity += change;

        if (currentQuantity < 1) currentQuantity = 1;
        if (currentQuantity > maxQuantity) currentQuantity = maxQuantity;

        returnQuantityInput.value = currentQuantity;
      };

      closeModal.addEventListener("click", () => {
        modal.style.display = "none";
      });

      window.addEventListener("click", (e) => {
        if (e.target === modal) {
          modal.style.display = "none";
        }
      });

      returnJustification.addEventListener("change", (event) => {
        const file = event.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (e) => {
            justificationPreview.src = e.target.result;
            justificationPreview.style.display = "block";
          };
          reader.readAsDataURL(file);
        }
      });

      submitReturn.addEventListener("click", () => {
        const quantity = returnQuantityInput.value;
        const reason = returnReason.value.trim();

        const justification = returnJustification.files[0];
        //Savegarder de l'image dans firebase storage
        //path users/userId/justification/orderID/ItemID/imageJustification.jpg;
        const path = `users/${user.id}/justification/imageJustification${orderId}${index}.jpg`;

        if (quantity < 1 || reason.length < 10) {
          alert(
            "Veuillez entrer une quantité valide et une justification d'au moins 10 caractères."
          );
          return;
        }

        const justif = new Justification(quantity, reason, path);
        alert(
          `Demande envoyée pour ${quantity} produit(s).\nMotif : ${justif}`
        );

        modal.style.display = "none";
      });
    });

    if (canCancelled) {
      document
        .getElementById("confirmCancelled")
        .addEventListener("click", () => {
          alert("Cancelled Product");

          //Mis a jour de la nouvelle status
          const historyItem = new orderItemHistory("cancelled", Date.now());

          //Enregistrer la nouvelle status dans firebase
          console.log(item.history.at(-1));

          modalCancelled.classList.remove("show");
        });
    }

    productsContent.appendChild(product);
    nbrItem += item.quantity;
  });
  const paymentStatus = document.createElement("div");
  if (order.payment === "cash") {
    paymentStatus.innerHTML = `
      <div class="payment-status pending">
        ⚠️ Payment Pending - Pay on Delivery
      </div>
    `;
  } else if (order.payment.includes("virtual-wallet")) {
    paymentStatus.innerHTML = `
      <div class="payment-status paid">
        ✅ Payment Confirmed - Paid by Virtual Wallet
        <a href="https://virtual-wallet.web.app/receipt.html?id=${order.payment}" class="receipt-link" target="_blank">Receipt</a>
      </div>
    `;
  } else {
    paymentStatus.innerHTML = `
      <div class="payment-status delivered">
        Payment Confirmed - Received
      </div>
    `;
  }
  orderSummary.appendChild(paymentStatus);
  document.getElementById("user-name").innerHTML =
    order.shippingAddress.firstName + " " + order.shippingAddress.lastName;
  document.getElementById("nbr-articles").innerHTML = `${nbrItem} article(s)`;
  document.getElementById("user-email").innerHTML = user.email;
  document.getElementById("user-phone-number").innerHTML =
    order.shippingAddress.phoneNumber1;
  document.getElementById("user-address").innerHTML = `
    <h2>Shipping Address</h2>
    <address>
      ${order.shippingAddress.district} / ${order.shippingAddress.street}
      <br />${order.shippingAddress.phoneNumber1} / ${order.shippingAddress.phoneNumber2}
      <br />${order.shippingAddress.region} / Niger
    </address>
  `;

  document.getElementById("cancelCancelled").addEventListener("click", () => {
    modalCancelled.classList.remove("show");
  });
});
