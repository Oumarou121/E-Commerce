function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

document.addEventListener("DOMContentLoaded", () => {
  const addressContainer = document.getElementById("address-container");
  const firstName = document.getElementById("first-name");
  const lastName = document.getElementById("last-name");
  document.getElementById("user-email").innerHTML = user.email;
  const phoneNumber1 = document.getElementById("phone-number1");
  const phoneNumber2 = document.getElementById("phone-number2");
  const regionSelect = document.getElementById("region-select");
  const districtSelect = document.getElementById("district");
  const street = document.getElementById("street");
  const modal = document.getElementById("address-modal");
  const openModalBtn = document.getElementById("add-address");
  const closeModalBtn = document.getElementById("exit");
  const cancelBtn = document.getElementById("cancel");
  const modalDelete = document.getElementById("address-modal-delete");
  const closeModalBtnDelete = document.getElementById("exit-delete");
  const cancelBtnDelete = document.getElementById("cancel-delete");
  const confirmDelete = document.getElementById("deleteAddress");
  const account = document.getElementById("top-user-account");
  const accountI = document.getElementById("angleAccount");
  const accountContent = document.getElementById("account-content");
  const delivery = document.getElementById("top-user-delivery");
  const deliveryI = document.getElementById("angleDelivery");
  const deliveryContent = document.getElementById("delivery-content");
  const shipping = document.getElementById("top-user-shipping-method");
  const shippingI = document.getElementById("angleShippingMethod");
  const shippingContent = document.getElementById("shipping-method-content");
  const payment = document.getElementById("top-user-payment");
  const paymentI = document.getElementById("anglePayment");
  const paymentContent = document.getElementById("payment-content");
  const cartList = document.getElementById("items-list");
  const spanSummary = document.getElementById("spanSummary");
  const subTotal = document.getElementById("sub-total");
  const total = document.getElementById("total");
  var items = [];

  subTotal.innerHTML = `${formatPrice(cart.getTotal() - 1000)} FCFA`;
  total.innerHTML = `${formatPrice(cart.getTotal())} FCFA`;

  spanSummary.addEventListener("click", async () => {
    cartList.classList.toggle("show");
    spanSummary.innerHTML =
      spanSummary.innerHTML === `Show <i class="uil uil-angle-down"></i>`
        ? `Hide <i class="uil uil-angle-up"></i>`
        : `Show <i class="uil uil-angle-down"></i>`;
  });

  account.addEventListener("click", () => {
    accountI.classList.toggle("rotate");
    accountContent.classList.toggle("show");
  });

  delivery.addEventListener("click", () => {
    deliveryI.classList.toggle("rotate");
    deliveryContent.classList.toggle("show");
  });

  shipping.addEventListener("click", () => {
    shippingI.classList.toggle("rotate");
    shippingContent.classList.toggle("show");
  });

  payment.addEventListener("click", () => {
    paymentI.classList.toggle("rotate");
    paymentContent.classList.toggle("show");
  });

  function updateDisplay() {
    addressContainer.innerHTML = "";
    if (
      user.addresses.length === 1 &&
      !user.addresses[0].district &&
      !user.addresses[0].street &&
      !user.addresses[0].phoneNumber1 &&
      !user.addresses[0].phoneNumber2 &&
      !user.addresses[0].region
    ) {
      openModalBtn.style.display = "none";
      const address = user.addresses[0];
      addressContainer.innerHTML = `
      <div class="form-address">
      <div class="column">
        <div class="form-group">
          <input
            type="text"
            id="first-name-new"
            placeholder="First Name"
            class="form-input"
            value="${address.firstName}"
          />
        </div>
        <div class="form-group">
          <input
            type="text"
            id="last-name-new"
            placeholder="Last Name"
            class="form-input"
            value="${address.lastName}"
          />
        </div>
      </div>
      <div class="column">
        <div class="form-group">
          <input
            type="text"
            id="phone-number1-new"
            placeholder="Phone Number"
            class="form-input"
          />
        </div>
        <div class="form-group">
          <input
            type="text"
            id="phone-number2-new"
            placeholder="Secondary Phone Number"
            class="form-input"
          />
        </div>
      </div>
      <div class="select-box">
        <select id="region-select-new" required>
          <option value="" disabled hidden selected>
            Sélectionnez une région
          </option>
          <option value="Agadez">Agadez</option>
          <option value="Diffa">Diffa</option>
          <option value="Dosso">Dosso</option>
          <option value="Maradi">Maradi</option>
          <option value="Tahoua">Tahoua</option>
          <option value="Tillabéri">Tillabéri</option>
          <option value="Zinder">Zinder</option>
          <option value="Niamey">Niamey</option>
        </select>
      </div>
      <div class="form-group">
        <input
          type="text"
          id="district-new"
          placeholder="District"
          class="form-input"
        />
      </div>
      <div class="form-group">
        <input
          type="text"
          id="street-new"
          placeholder="Street"
          class="form-input"
        />
      </div>
    </div>
      `;
    } else if (user.addresses.length > 0) {
      user.addresses.forEach((address, index) => {
        const addressItem = document.createElement("div");
        addressItem.classList.add("address-card");
        if (index === user.currentIndex) {
          addressItem.classList.add("active");
        }

        addressItem.innerHTML = `
                <div class="addressContent">
                  <input id="address-${index}" type="radio" name="selectedAddress" value="${index}" ${
          index === user.currentIndex ? "checked" : ""
        } />
                  <label for="address-${index}">
                    <div class="address-info">
                      <h4>${address.firstName} ${address.lastName}</h4>
                      <p><strong>Téléphone :</strong> ${address.phoneNumber1} ${
          address.phoneNumber2 ? ` / ${address.phoneNumber2}` : ""
        }</p>
                      <p><strong>Adresse :</strong> ${address.street}, ${
          address.district
        }, ${address.region}, Niger</p>
                    </div>
                  </label>
                </div>
                <div class="options">
                  <i class="fas fa-ellipsis-v option-btn" data-index="${index}"></i>
                  <div class="dropdown-menu" id="menu-${index}">
                    <button class="edit-btn" data-index="${index}">Modifier</button>
                    <button class="delete-btn" data-index="${index}">Supprimer</button>
                  </div>
                </div>
            `;

        addressItem
          .querySelector(`input[name="selectedAddress"]`)
          .addEventListener("change", () => {
            document.querySelectorAll(".address-card").forEach((card) => {
              card.classList.remove("active");
            });
            addressItem.classList.add("active");
          });

        addressItem
          .querySelector(".option-btn")
          .addEventListener("click", () => {
            document.querySelectorAll(".dropdown-menu").forEach((menu) => {
              menu.style.display = "none";
            });
            document.getElementById(`menu-${index}`).style.display = "block";
          });

        addressItem
          .querySelector(".delete-btn")
          .addEventListener("click", () => {
            openModalDelete(index);
          });

        addressItem.querySelector(".edit-btn").addEventListener("click", () => {
          openModal(false, index);
        });

        document.addEventListener("click", (e) => {
          if (!e.target.closest(".options")) {
            document.querySelectorAll(".dropdown-menu").forEach((menu) => {
              menu.style.display = "none";
            });
          }
        });

        addressContainer.appendChild(addressItem);
      });
    } else {
      addressContainer.innerHTML = `<p class="no-address">Aucune adresse disponible.</p>`;
    }
  }

  openModalBtn.addEventListener("click", () => {
    openModal(true);
  });
  closeModalBtn.addEventListener("click", () => {
    modal.classList.remove("show");
    resetInput();
  });
  closeModalBtnDelete.addEventListener("click", () => {
    modalDelete.classList.remove("show");
  });
  cancelBtn.addEventListener("click", () => {
    modal.classList.remove("show");
    resetInput();
  });
  cancelBtnDelete.addEventListener("click", () => {
    modalDelete.classList.remove("show");
  });

  function openModal(addAddress = false, index = null) {
    resetInput();
    modal.classList.add("show");
    if (addAddress && index === null) {
      firstName.value = user.firstName;
      lastName.value = user.lastName;
      phoneNumber1.value = "";
      phoneNumber2.value = "";
      regionSelect.value = "";
      districtSelect.value = "";
      street.value = "";
    } else {
      const address = user.addresses[index];
      firstName.value = address.firstName;
      lastName.value = address.lastName;
      phoneNumber1.value = address.phoneNumber1;
      phoneNumber2.value = address.phoneNumber2;
      regionSelect.value = address.region;
      districtSelect.value = address.district;
      street.value = address.street;
    }

    document
      .getElementById("submitAddress")
      .addEventListener("click", () => save(addAddress, index));
  }

  function save(addAddress, index) {
    resetInput();
    const firstNameValue = firstName.value.trim();
    const lastNameValue = lastName.value.trim();
    const phoneNumber1Value = phoneNumber1.value.trim();
    const phoneNumber2Value = phoneNumber2.value.trim();
    const regionValue = regionSelect.value;
    const districtValue = districtSelect.value;
    const streetValue = street.value.trim();

    if (firstNameValue.length < 4) {
      firstName.classList.add("error");
      return;
    }

    if (lastNameValue.length < 4) {
      lastName.classList.add("error");
      return;
    }

    if (phoneNumber1Value.length < 13) {
      phoneNumber1.classList.add("error");
      return;
    }

    if (!regionValue) {
      regionSelect.classList.add("error");
      return;
    }

    if (!districtValue) {
      districtSelect.classList.add("error");
      return;
    }

    if (streetValue.length < 5) {
      street.classList.add("error");
      return;
    }

    const address = new Address(
      firstNameValue,
      lastNameValue,
      phoneNumber1Value,
      phoneNumber2Value,
      regionValue,
      districtValue,
      streetValue
    );

    if (addAddress && index === null) {
      user.addAdress(address);
      modal.classList.remove("show");
      resetInput();
    } else {
      user.addresses[index] = address;
      modal.classList.remove("show");
      resetInput();
    }
    updateDisplay();
  }

  function resetInput() {
    document.querySelectorAll(".form-input").forEach((input) => {
      input.classList.remove("error");
    });
    regionSelect.classList.remove("error");
  }

  function openModalDelete(index) {
    modalDelete.classList.add("show");
    document.getElementById("delete-content").innerHTML = `
      Are you sure you want to delete the address ${user.addresses[index].firstName} ${user.addresses[index].lastName}, ${user.addresses[index].district} 
      ${user.addresses[index].street} ${user.addresses[index].phoneNumber1} Niamey?
    `;
    confirmDelete.addEventListener("click", () => {
      user.addresses.splice(index, 1);
      if (user.currentIndex > 0) {
        user.currentIndex--;
      }
      modalDelete.classList.remove("show");
      updateDisplay();
    });
  }

  const paymentMethods = document.querySelectorAll(".payment-method input");

  paymentMethods.forEach((input) => {
    input.addEventListener("change", () => {
      document.querySelectorAll(".payment-method").forEach((method) => {
        method.classList.remove("active");
      });

      input.closest(".payment-method").classList.add("active");
    });
  });

  updateDisplay();

  cart.getItems().forEach((cartItem, index) => {
    cartList.innerHTML += `
      <li>
        <img
          src="${cartItem.product.images[0]}"
          alt="${cartItem.product.name}"
        />
        <div class="item-details">
          <span class="item-name">${cartItem.product.name}</span>
        </div>
        <span class="item-price">${formatPrice(
          cartItem.product.price * cartItem.quantity
        )} FCFA</span>
        <span class="item-quantity">${cartItem.quantity}</span>
      </li>
    `;
    items.push(
      new orderItem(
        cartItem.product.id,
        cartItem.product.images[0],
        cartItem.product.price,
        cartItem.product.priceReduction,
        cartItem.quantity,
        "pending",
        Date.now(),
        [new orderItemHistory("pending", Date.now())]
      )
    );
  });

  const walletRadio = document.getElementById("virtual-wallet");
  const cash = document.getElementById("cash-on-delivery");
  const payNow = document.getElementById("pay-now");

  walletRadio.addEventListener("change", () => {
    if (walletRadio.checked) {
      payNow.textContent = "Pay Now";
    }
  });

  cash.addEventListener("change", () => {
    if (cash.checked) {
      payNow.textContent = "Confirmer la Commande";
    }
  });

  function paymendAction(address) {
    const walletID = document.getElementById("wallet-id");
    const walletPassword = document.getElementById("wallet-password");
    if (cash.checked) {
      orders.addOrder(
        new Order(
          user.id,
          user.id,
          user.email,
          items,
          address,
          "cash",
          cart.getTotal() - 1000,
          1000,
          "pending",
          Date.now(),
          Date.now()
        )
      );
      console.log(orders);
    } else {
      const wallet = {
        id: walletID.value.trim(),
        password: walletPassword.value.trim(),
      };
      walletID.classList.remove("error");
      walletPassword.classList.remove("error");
      console.log("virtual wallet");
      console.log(walletID.value.trim());
      if (wallet.id.length < 14) {
        walletID.classList.add("error");
        return;
      }
      if (wallet.password.length < 6) {
        walletPassword.classList.add("error");
        return;
      }

      // Check if wallet ID and password are correct
      console.log(wallet);

      // Make a payment request to the virtual wallet
      console.log("Reçu du payment");
      const reçuId = wallet.id + user.id + wallet.password;

      orders.addOrder(
        new Order(
          user.id,
          user.id,
          user.email,
          items,
          address,
          `virtual-wallet-${reçuId}`,
          cart.getTotal() - 1000,
          1000,
          "pending",
          Date.now(),
          Date.now()
        )
      );
      console.log(orders);
    }
  }

  payNow.addEventListener("click", () => {
    if (
      user.addresses.length === 1 &&
      !user.addresses[0].district &&
      !user.addresses[0].street &&
      !user.addresses[0].phoneNumber1 &&
      !user.addresses[0].phoneNumber2 &&
      !user.addresses[0].region
    ) {
      resetInput();
      const firstName = document.getElementById("first-name-new");
      const lastName = document.getElementById("last-name-new");
      const phoneNumber1 = document.getElementById("phone-number1-new");
      const phoneNumber2 = document.getElementById("phone-number2-new");
      const region = document.getElementById("region-select-new");
      const district = document.getElementById("district-new");
      const street = document.getElementById("street-new");

      if (firstName.value.trim().length < 4) {
        firstName.classList.add("error");
        return;
      }

      if (lastName.value.trim().length < 4) {
        lastName.classList.add("error");
        return;
      }

      if (phoneNumber1.value.trim().length < 8) {
        phoneNumber1.classList.add("error");
        return;
      }

      if (!region.value.trim()) {
        region.classList.add("error");
        return;
      }

      if (!district.value.trim()) {
        district.classList.add("error");
        return;
      }

      if (street.value.trim().length < 5) {
        street.classList.add("error");
        return;
      }

      const address = new Address(
        firstName.value.trim(),
        lastName.value.trim(),
        phoneNumber1.value.trim(),
        phoneNumber2.value.trim(),
        region.value.trim(),
        district.value.trim(),
        street.value.trim()
      );
      paymendAction(address);
    } else if (user.addresses.length > 0) {
      const selectedRadio = document.querySelector(
        'input[name="selectedAddress"]:checked'
      );
      if (selectedRadio) {
        const selectedIndex = parseInt(selectedRadio.value, 10);
        const address = user.addresses[selectedIndex];
        paymendAction(address);
      }
    } else {
      alert("Veuillez ajouter une adresse de livraison");
    }
  });
});
