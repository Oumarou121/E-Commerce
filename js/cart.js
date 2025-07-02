document.addEventListener("DOMContentLoaded", function () {
  const cartContent = document.getElementById("cart-content");
  const cartContent2 = document.getElementById("cart-second");
  const cartContent3 = document.getElementById("cart-thrid");
  const subContent = document.getElementById("sub-total");
  const shippingContent = document.getElementById("shipping-total");
  const totalContent = document.getElementById("total");
  const shippingTotalCart = 1000;
  const table = `
    <table class="cart-table">
      <thead>
        <tr>
          <th colspan="2">Product</th>
          <th>Price</th>
          <th>Quantity</th>
          <th>Total</th>
          <th>&nbsp;</th>
        </tr>
      </thead>
      <tbody id="cart-items-body">
      </tbody>
    </table>
  `;

  function updateCartPrice() {
    shippingContent.innerHTML = `${formatPrice(shippingTotalCart)} FCFA`;
    subContent.innerHTML = `${formatPrice(
      cart.getTotal() - shippingTotalCart
    )} FCFA`;
    totalContent.innerHTML = `${formatPrice(cart.getTotal())} FCFA`;
  }

  function updateCartContent() {
    console.log(cart.getItems());
    cartContent.innerHTML = "";
    cartContent.innerHTML = table;
    const tbody = document.getElementById("cart-items-body");
    if (cart.getItems().length > 0) {
      cart.getItems().forEach((cartItem) => {
        const cartElement = document.createElement("tr");
        cartElement.innerHTML = `
          <td class="product-thumbnail">
            <a href="${`/product.html?id=${cartItem.product.id}`}">
              <img src="${cartItem.product.images[0]}" alt="${
          cartItem.product.name
        }" />
            </a>
          </td>
          <td class="product-name">
            <a href="${`/product.html?id=${cartItem.product.id}`}">${
          cartItem.product.name
        }</a>
          </td>
          <td class="product-price">
            <span class="price">${formatPrice(
              cartItem.product.price
            )} FCFA</span>
          </td>
          <td class="product-quantity">
            <div class="pro-qty">
              <span class="dec">-</span>
              <input type="text" name="updates" value="${
                cartItem.quantity
              }" readonly/>
              <span class="inc">+</span>
            </div>
          </td>
          <td class="total-price">
            <span class="price">${formatPrice(
              cartItem.product.price * cartItem.quantity
            )} FCFA</span>
          </td>
          <td class="product-remove">
            <span>
              <i class="uil uil-times"></i>
            </span>
          </td>
        `;

        const inc = cartElement.querySelector(".inc");
        const dec = cartElement.querySelector(".dec");
        const qtyInput = cartElement.querySelector(".pro-qty input");
        const totalPrice = cartElement.querySelector(".total-price .price");
        const deleteBtn = cartElement.querySelector(".product-remove span");

        inc.addEventListener("click", () => {
          let qty = parseInt(qtyInput.value);
          if (qty < cartItem.product.qty) {
            qtyInput.value = qty + 1;
            totalPrice.innerHTML = `${formatPrice(
              cartItem.product.price * qtyInput.value
            )} FCFA`;
            cart.updateQuantity(cartItem.product.id, 1);
            updateCartPrice();
          }
        });

        dec.addEventListener("click", () => {
          let qty = parseInt(qtyInput.value);
          if (qty > 1) {
            qtyInput.value = qty - 1;
            totalPrice.innerHTML = `${formatPrice(
              cartItem.product.price * qtyInput.value
            )} FCFA`;
            cart.updateQuantity(cartItem.product.id, -1);
            updateCartPrice();
          }
        });

        deleteBtn.addEventListener("click", () => {
          cart.removeItem(cartItem.product.id);
          updateCartContent();
        });

        tbody.appendChild(cartElement);
      });
    } else {
      cartContent.innerHTML = `
        <div class="no-results-container">
          <i class="uil uil-shopping-cart"></i>
          <p>Your Shopping Cart is empty. <a href="shop.html">Continue shopping</a></p>
        </div>
      `;
      cartContent2.style.display = "none";
      cartContent3.style.display = "none";
    }
    updateCartPrice();
  }

  updateCartContent();

  document.getElementById("cart-terms").addEventListener("change", function () {
    document.querySelector(".checkout-button").disabled = !this.checked;
  });

  document.getElementById("clear-cart").addEventListener("click", () => {
    cart.clear();
    updateCartContent();
  });
});
