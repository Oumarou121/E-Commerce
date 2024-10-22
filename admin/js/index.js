// add hovered class to selected list item
let list = document.querySelectorAll(".navigation li");

function activeLink() {
  list.forEach((item) => {
    item.classList.remove("hovered");
  });
  this.classList.add("hovered");
}

list.forEach((item) => item.addEventListener("click", activeLink));

// Menu Toggle
let toggle = document.querySelector(".toggle");
let navigation = document.querySelector(".navigation");
let main = document.querySelector(".main");

toggle.onclick = function () {
  navigation.classList.toggle("active");
  main.classList.toggle("active");
};


// adminPage.js

import { isUserAdmin } from './../../js/firebase.js';

document.addEventListener('DOMContentLoaded', async () => {
    const isAdmin = await isUserAdmin();

    if (!isAdmin) {
        // Rediriger vers la page d'accueil ou de connexion si l'utilisateur n'est pas admin
        window.location.href = '/login.html';
    }
});