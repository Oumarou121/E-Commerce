document.addEventListener("DOMContentLoaded", function () {
  const addressList = document.getElementById("address-list");
  const addAddressBtn = document.getElementById("addAddress");
  const newAddressContent = document.querySelector(".addAddress");
  const cancelBtn = document.getElementById("cancel");

  addAddressBtn.addEventListener("click", () => {
    newAddressContent.style.display =
      newAddressContent.style.display === "none" ? "block" : "none";
  });

  cancelBtn.addEventListener("click", () => {
    newAddressContent.style.display = "none";
  });

  document.getElementById("submitAddress").addEventListener("click", () => {
    const adr = {
      firstName: document.querySelector("#first-name").value.trim(),
      lastName: document.querySelector("#last-name").value.trim(),
      phoneNumber1: document.querySelector("#phone-number1").value.trim(),
      phoneNumber2: document.querySelector("#phone-number2").value.trim(),
      region: document.querySelector("#region-select").value,
      district: document.querySelector("#district").value.trim(),
      street: document.querySelector("#street").value.trim(),
    };

    if (
      !adr.firstName ||
      !adr.lastName ||
      !adr.phoneNumber1 ||
      !adr.phoneNumber2 ||
      !adr.region ||
      !adr.district ||
      !adr.street
    ) {
      alert("Please fill all fields");
      return;
    }

    user.addAdress(
      new Address(
        adr.firstName,
        adr.lastName,
        adr.phoneNumber1,
        adr.phoneNumber2,
        adr.region,
        adr.district,
        adr.street
      )
    );

    document
      .querySelectorAll(".addAddress input, .addAddress select")
      .forEach((input) => (input.value = ""));

    const indexAdresse = document.querySelector("#address");
    if (indexAdresse.checked) {
      user.currentIndex = user.addresses.length - 1;
    }

    newAddressContent.style.display = "none";
    updateAddresses();
    console.log(user);
  });

  function updateAddresses() {
    addressList.innerHTML = "";

    user.addresses.forEach((address, index) => {
      const addressItem = document.createElement("div");
      addressItem.classList.add("address-item");

      addressItem.innerHTML = `
        <p class="edit-address-button">
          <span class="edit">Edit</span> |
          <span class="delete">Delete</span>
        </p>
        <div class="form-address" style="display: none;">
          <div class="column">
            <div class="form-group">
              <label for="first-name-${index}">First Name</label>
              <input type="text" id="first-name-${index}" class="form-input" value="${
        address.firstName
      }" />
            </div>
            <div class="form-group">
              <label for="last-name-${index}">Last Name</label>
              <input type="text" id="last-name-${index}" class="form-input" value="${
        address.lastName
      }" />
            </div>
          </div>
          <div class="column">
            <div class="form-group">
              <label for="phone-number1-${index}">Phone Number</label>
              <input type="text" id="phone-number1-${index}" class="form-input" value="${
        address.phoneNumber1
      }" />
            </div>
            <div class="form-group">
              <label for="phone-number2-${index}">Secondary Phone Number</label>
              <input type="text" id="phone-number2-${index}" class="form-input" value="${
        address.phoneNumber2
      }" />
            </div>
          </div>
          <div class="select-box">
            <label for="region-select-${index}">Region</label>
            <select id="region-select-${index}">
              <option value="" disabled hidden>Select a region</option>
              ${[
                "Agadez",
                "Diffa",
                "Dosso",
                "Maradi",
                "Tahoua",
                "Tillabéri",
                "Zinder",
                "Niamey",
              ]
                .map(
                  (region) =>
                    `<option value="${region}" ${
                      region === address.region ? "selected" : ""
                    }>${region}</option>`
                )
                .join("")}
            </select>
          </div>
          <div class="form-group">
            <label for="district-${index}">District</label>
            <input type="text" id="district-${index}" class="form-input" value="${
        address.district
      }" />
          </div>
          <div class="form-group">
            <label for="street-${index}">Street</label>
            <input type="text" id="street-${index}" class="form-input" value="${
        address.street
      }" />
          </div>
          <div class="setDefault">
            <input id="address-${index}" type="checkbox" ${
        user.currentIndex === index ? "checked" : ""
      } />
            <label for="address-${index}">Set as default address</label>
          </div>
          <button class="update-address">UPDATE ADDRESS</button>
        </div>
        <h3>${address.firstName} ${address.lastName} ${
        user.currentIndex === index ? "(Default)" : ""
      }</h3>
        ${
          address.district &&
          address.street &&
          address.phoneNumber1 &&
          address.phoneNumber2 &&
          address.region ? (
            `<address>
              ${address.district} / ${address.street}
              <br />${address.phoneNumber1} / ${address.phoneNumber2}
              <br />${address.region} / Niger
            </address>`
          ) : ''
        }
        
      `;

      // Événement pour afficher/masquer le formulaire d'édition
      addressItem.querySelector(".edit").addEventListener("click", function () {
        const formAddress = addressItem.querySelector(".form-address");
        formAddress.style.display =
          formAddress.style.display === "none" ? "block" : "none";
      });

      // Événement pour supprimer une adresse
      addressItem
        .querySelector(".delete")
        .addEventListener("click", function () {
          if (user.currentIndex === index) {
            alert("You cannot delete the default address");
            return;
          }
          user.addresses.splice(index, 1);
          if (user.currentIndex > 0) {
            user.currentIndex--;
          }
          updateAddresses();
          console.log(user);
        });

      // Événement pour mettre à jour une adresse
      addressItem
        .querySelector(".update-address")
        .addEventListener("click", () => {
          const updatedAddress = {
            firstName: addressItem
              .querySelector(`#first-name-${index}`)
              .value.trim(),
            lastName: addressItem
              .querySelector(`#last-name-${index}`)
              .value.trim(),
            phoneNumber1: addressItem
              .querySelector(`#phone-number1-${index}`)
              .value.trim(),
            phoneNumber2: addressItem
              .querySelector(`#phone-number2-${index}`)
              .value.trim(),
            region: addressItem.querySelector(`#region-select-${index}`).value,
            district: addressItem
              .querySelector(`#district-${index}`)
              .value.trim(),
            street: addressItem.querySelector(`#street-${index}`).value.trim(),
          };

          user.addresses[index] = updatedAddress;

          if (addressItem.querySelector(`#address-${index}`).checked) {
            user.currentIndex = index;
          }
          updateAddresses();
          console.log(user);
        });

      addressList.appendChild(addressItem);
    });
  }

  updateAddresses();
  console.log(user);
});
