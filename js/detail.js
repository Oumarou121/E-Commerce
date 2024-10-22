document.getElementById('exit').addEventListener('click', ()=>{
    window.history.back();
})

import { getUserOrderById, getProductById, isInCart, removeFromCart, addToCart, updateProductStatusInOrder } from './firebase.js';

// Récupération du fragment à partir de l'URL
let orderId = window.location.hash.substring(1); // Retire le symbole '#'
orderId = `#${orderId}`

function formatPrice(price) {
    // Assurez-vous que le prix est un nombre
    if (isNaN(price)) return price; // Retourne le prix tel quel s'il n'est pas un nombre

    // Convertit le prix en chaîne et remplace les virgules par des points
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

function formatFirebaseTimestamp(firebaseTimestamp) {
    // Conversion du Timestamp de Firebase en objet Date
    const date = firebaseTimestamp.toDate();

    // Récupération du jour, du mois et de l'année
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Les mois commencent à 0
    const year = date.getFullYear();

    // Formatage final
    return `Effectuée le ${day}-${month}-${year}`;
}

function formatDate(timestamp) {
    const date = new Date(timestamp); // Convertir le timestamp en objet Date
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `Le ${day}-${month}-${year}`;
}

function formatDeliveryDateRange(startTimestamp) {
    const daysOfWeek = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"];
    const months = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];

    const startDate = new Date(startTimestamp);
    const endDate = new Date(startTimestamp); // Créer une nouvelle date basée sur startTimestamp

    // Ajouter 2 jours en millisecondes (2 jours * 24 heures * 60 minutes * 60 secondes * 1000 millisecondes)
    endDate.setDate(startDate.getDate() + 2);

    const startDayOfWeek = daysOfWeek[startDate.getDay()];
    const startDay = startDate.getDate();
    const startMonth = months[startDate.getMonth()];

    const endDayOfWeek = daysOfWeek[endDate.getDay()];
    const endDay = endDate.getDate();
    const endMonth = months[endDate.getMonth()];

    return `Livré entre le ${startDayOfWeek} ${startDay} ${startMonth} et le ${endDayOfWeek} ${endDay} ${endMonth}`;
}

function formatCheckingDateRange(startTimestamp) {
    const daysOfWeek = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"];
    const months = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];

    const startDate = new Date(startTimestamp);
    const endDate = new Date(startTimestamp); // Créer une nouvelle date basée sur startTimestamp

    // Ajouter 2 jours en millisecondes (2 jours * 24 heures * 60 minutes * 60 secondes * 1000 millisecondes)
    endDate.setDate(startDate.getDate() + 2);

    const startDayOfWeek = daysOfWeek[startDate.getDay()];
    const startDay = startDate.getDate();
    const startMonth = months[startDate.getMonth()];

    const endDayOfWeek = daysOfWeek[endDate.getDay()];
    const endDay = endDate.getDate();
    const endMonth = months[endDate.getMonth()];

    return `Fin d'examination entre le ${startDayOfWeek} ${startDay} ${startMonth} et le ${endDayOfWeek} ${endDay} ${endMonth}`;
}

function formatDeliveryDateRange1(startTimestamp) {
    const daysOfWeek = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"];
    const months = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];

    const startDate = new Date(startTimestamp);
    const endDate = new Date(startTimestamp); // Créer une nouvelle date basée sur startTimestamp

    // Ajouter 2 jours en millisecondes (2 jours * 24 heures * 60 minutes * 60 secondes * 1000 millisecondes)
    endDate.setDate(startDate.getDate() + 2);

    const startDayOfWeek = daysOfWeek[startDate.getDay()];
    const startDay = startDate.getDate();
    const startMonth = months[startDate.getMonth()];

    const endDayOfWeek = daysOfWeek[endDate.getDay()];
    const endDay = endDate.getDate();
    const endMonth = months[endDate.getMonth()];

    return ` le ${startDayOfWeek} ${startDay} ${startMonth} et le ${endDayOfWeek} ${endDay} ${endMonth}`;
}

document.addEventListener('DOMContentLoaded', async () => {
    const orderNum = document.querySelector('.Num');
    const orderNbr = document.querySelector('.nbr');
    const orderDate = document.querySelector('.Comd-date');
    const orderTotal = document.querySelector('.total');
    const orderTotal1 = document.querySelector('.total1');
    const orderSousTotal = document.querySelector('.sous-total');
    const name = document.querySelector('.nom');
    const adresse = document.querySelector('.adress');
    const region = document.querySelector('.region');
    const cartItemsList = document.querySelector('.cart-items');
    const detailsList = document.querySelector('.detail-exp');

    //document.getElementById('loading-spinner').style.display = 'block';
    let orderData = await getUserOrderById(orderId);
    console.log(orderData)
    // orderData = orderData[0];
    const shippingAddress = orderData.shippingAddress;
    const items = orderData.items;
    let totalQty = 0;
    
    const displayCartItems = async () => {
        //document.getElementById('loading-spinner').style.display = 'block';
        const ads = (shippingAddress.adresse_sup == "") ? shippingAddress.adresse : `${shippingAddress.adresse} , ${shippingAddress.adresse_sup}`;
        orderNum.textContent = `Commande n°${orderId}`;
        console.log(orderData.createdAt);
        orderDate.textContent = formatFirebaseTimestamp(orderData.createdAt);
        orderTotal.textContent = `Total: ${formatPrice(orderData.totalAmount)} FCFA`;
        orderTotal1.textContent = `Total: ${formatPrice(orderData.totalAmount)} FCFA`;
        orderSousTotal.textContent = `Sous-total: ${formatPrice(orderData.totalAmount - 2000)} FCFA`;
        name.textContent = `${shippingAddress.prenom} ${shippingAddress.nom}`;
        adresse.textContent = ads;
        region.textContent = `${shippingAddress.region}, Niger`;

        for(const [index, item] of items.entries()){
            console.log(item);
            totalQty += item.quantity;

            const productId = item.productId; // Récupérer l'ID du produit
            const product = await getProductById(productId);
            const cartItemElement = document.createElement('li');
            const detailsElement = document.createElement('div');
            cartItemElement.className = 'cart-content';

            const content = (item.status == "checking") ? "La commande sera récupérée entre" : "Livraison à domicile. Expédié Niger.net Livraison entre" ;

            detailsElement.innerHTML = `
            
            <h3>Colis ${index + 1}</h3>
            <span> ${content}
            <strong>${formatDeliveryDateRange1(item.updatedAt)}</strong>
            </span>

            `;

            detailsList.appendChild(detailsElement);

            cartItemElement.innerHTML = `

            <div class="content-left">
            <header class="cart-icon-top">
                <div class="state-box">
                    <div class="state1 text-white bg-green">COMMANDE LIVRÉE</div>
                    <div class="state2 text-white bg-red">NON-RETOURNABLE</div>
                </div>
                <div class="time">Le 21-02-2024</div>
            </header>
            <div class="cart-item">
                <div class="image">
                    <img src="${product.images[0]}" alt="${product.name}">
                </div>
                <div class="div-name">
                    <div class="name text-black">
                        ${product.name}
                    </div>
                    <div class="qty">Quantité: ${item.quantity}</div>
                    <div class="price">${formatPrice(item.price)} FCFA</div>
                </div>
            </div>
            </div>
            <div class="content-right">
                <div class="btn-one add-to-cart text-white">
                    COMMANDE À NOUVEAU
                </div>
                <div class="btn-two">
                    HISTORIQUE DU COLIS
                </div>
            </div>
            <footer class="cart-icon-bottom">
                <i class="uil uil-redo">Retourne le produit</i> 
            </footer>

            `;
            const state1 = cartItemElement.querySelector(".state1");
            const state2 = cartItemElement.querySelector(".state2");
            const time = cartItemElement.querySelector(".time");
            const btn1 = cartItemElement.querySelector(".btn-one");
            const btn2 = cartItemElement.querySelector(".btn-two");

            if (item.status == "pending") {
                time.textContent = formatDeliveryDateRange(item.updatedAt);
            } else if (item.status == "checking") {
                time.textContent = formatCheckingDateRange(item.updatedAt);
            } else {
                time.textContent = formatDate(item.updatedAt); 
            }  
            
            const foot = cartItemElement.querySelector(".cart-icon-bottom");
            const footContent = cartItemElement.querySelector(".uil-redo");
            const now = Date.now(); // Obtenir le timestamp actuel
            const time1 = item.updatedAt; // Récupérer le timestamp de `updatedAt`
            const Sdate = new Date(time1); // Créer un objet Date à partir de `updatedAt`
            const Edate = new Date(time1); // Créer une autre date à partir de `updatedAt`
            const Edate1 = new Date(time1); // Créer une autre date à partir de `updatedAt`
            Edate.setDate(Sdate.getDate() + 1); // Ajouter 1 jour à `updatedAt`
            Edate1.setDate(Sdate.getDate() + 3); // Ajouter 1 jour à `updatedAt`


            if (item.status == "pending"){
                state2.style.visibility = "hidden";
                state1.style.backgroundColor = "hsl(var(--clr-blue))";

                if (now <= Edate) {
                    state1.textContent = "En ATTENTE D'EXPÉDITION";
                } else if (now >= Edate){
                    state1.textContent = "COMMANDE EN COURS";
                } 

                foot.style.display = "none";
                btn1.style.display = "block";
                btn1.textContent = "SUIVRE VOTRE COLIS";
                btn2.textContent = "ANNULER VOTRE COMMANDE";
                btn1.addEventListener('click', ()=>{
                    window.location.href = `track.html?id=${orderData.orderId}&index=${index}`;

                });

                btn2.addEventListener('click', ()=>{
                    openCustomAlert(orderId, "cancelled" ,index);
                });

            }else if (item.status == "delivered"){

                if (now <= Edate1) {
                    state2.textContent = "RETOURNABLE";
                    state2.style.backgroundColor = "hsl(var(--clr-blue) / .8)";
                    foot.addEventListener('click', ()=>{
                        openCustomAlertRetourne(product, item, orderId, "checking", index);
                    });
                } else if (now >= Edate1){
                    state2.textContent = "NON-RETOURNABLE";
                    foot.style.cursor = "default";
                    footContent.textContent = `La période de retour s'est terminée ${formatDate(Edate1)}, mais si s'est en rapport de la garantie consulté le +227 94464639`;
                }

                const cartIcon = cartItemElement.querySelector('.add-to-cart');
                const isCart = await isInCart(productId);
                            
                if (isCart) {
                    cartIcon.classList.add('in-cart');
                }

                btn1.addEventListener('click', async()=>{
                    if (cartIcon.classList.contains('in-cart')) {
                        // Si le produit est déjà dans le panier, on le retire
                        await removeFromCart(productId);
                        cartIcon.classList.remove('in-cart');
                        showAlert('Le produit a été retiré de votre panier!');
                    } else {
                        // Si le produit n'est pas dans le panier, on l'ajoute avec une quantité par défaut (1)
                        await addToCart(productId, 1); // Quantité par défaut de 1
                        cartIcon.classList.add('in-cart');
                        showAlert('Le produit a été ajouté à votre panier!');
                    }
                });

                btn2.addEventListener('click', ()=>{
                    window.location.href = `track.html?id=${orderData.orderId}&index=${index}`;
                });

            }else if (item.status == "cancelled"){
                state2.style.visibility = "hidden";
                state1.textContent = "ANNULÉE";
                state1.style.backgroundColor = "hsl(var(--clr-black) / .8)";
                foot.style.display = "none";
                btn1.style.display = "none";
                btn2.addEventListener('click', ()=>{
                    window.location.href = `track.html?id=${orderData.orderId}&index=${index}`;
                });
            }else if (item.status == "returned"){
                state2.textContent = "RETOURNÉE";
                state2.style.backgroundColor = "hsl(var(--clr-red) / .8)";
                foot.style.display = "none";
                btn1.style.display = "none";
                btn2.addEventListener('click', ()=>{
                    window.location.href = `track.html?id=${orderData.orderId}&index=${index}`;
                });
            }else if (item.status == "checking"){
                state1.style.display = "none";
                state2.textContent = "COMMANDE EN EXAMINATION DE RETOUR";
                state2.style.backgroundColor = "hsl(var(--clr-red) / .5)";
                foot.style.display = "none";
                btn1.style.display = "none";
                btn2.addEventListener('click', ()=>{
                    window.location.href = `track.html?id=${orderData.orderId}&index=${index}`;
                });
            }

            cartItemsList.appendChild(cartItemElement);

        }

        const nbr = (totalQty == 1) ? `${totalQty} article` : `${totalQty} articles` ;

        orderNbr.textContent = nbr;

        //document.getElementById('loading-spinner').style.display = 'none';
    }

    await displayCartItems();
    
        
});

// Fonction pour afficher l'alerte au centre de l'écran
function showAlert(message) {
    const alertBox = document.createElement('div');
    alertBox.classList.add('alert', 'show');
    alertBox.innerHTML = `
    <span class="text-black">${message}<a href="/cart.html"> Voir votre panier.</a></span>
    <span class="close-btn">&times;</span>
    `;
    
    document.body.appendChild(alertBox);

    alertBox.querySelector('.close-btn').addEventListener('click', () => {
        alertBox.classList.add('hide');
    });

    setTimeout(() => {
        alertBox.classList.add('hide');
    }, 5000);

    setTimeout(() => {
        alertBox.remove();
    }, 5500);
}

// Fonction pour afficher l'alerte au centre de l'écran
function showAlert1(message) {
    const alertBox = document.createElement('div');
    alertBox.classList.add('alert', 'show');
    alertBox.innerHTML = `
    <span class="text-black">${message}<a href="#"> </a></span>
    <span class="close-btn"></span>
    `;
    
    document.body.appendChild(alertBox);

    alertBox.querySelector('.close-btn').addEventListener('click', () => {
        alertBox.classList.add('hide');
    });

    setTimeout(() => {
        alertBox.classList.add('hide');
    }, 5000);

    setTimeout(() => {
        alertBox.remove();
    }, 5500);
}

// Fonction pour ouvrir l'alerte et désactiver les interactions
function openCustomAlert(orderId, newStatus, productIndex) {
    const customAlert = document.getElementById('customAlert');
    const pageContent = document.getElementById('main');
    const body = document.body;
    const confirmBtn = document.getElementById('confirmBtn');

    customAlert.style.display = 'flex'; // Affiche l'alerte
    pageContent.classList.add('no-interaction'); // Désactive les interactions sur le reste de la page
    body.classList.add('no-scroll'); // Désactive le défilement

    // Retirer tout événement de clic préalablement ajouté pour éviter les duplications
    confirmBtn.onclick = null;

    // Attacher l'événement au bouton de confirmation avec les paramètres actuels
    confirmBtn.onclick = async () => {
        //document.getElementById('loading-spinner').style.display = 'block';

        try {
            // Appeler la fonction pour mettre à jour le statut du produit dans la commande
            await updateProductStatusInOrder(orderId, newStatus, productIndex);
            console.log("Mise à jour effectuée :", orderId, newStatus, productIndex);
        } catch (error) {
            console.error("Erreur lors de la mise à jour du statut du produit :", error);
        } finally {
            closeCustomAlert(); // Ferme l'alerte après l'opération
            //document.getElementById('loading-spinner').style.display = 'none';
            window.history.back();
        }
    };
}

// Fonction pour fermer l'alerte et réactiver les interactions
function closeCustomAlert() {
    const customAlert = document.getElementById('customAlert');
    const pageContent = document.getElementById('main');
    const body = document.body;

    customAlert.style.display = 'none'; // Cache l'alerte
    pageContent.classList.remove('no-interaction'); // Réactive les interactions sur la page
    body.classList.remove('no-scroll'); // Réactive le défilement
}

// Fermer l'alerte sans effectuer de mise à jour lors du clic sur la croix
document.getElementById('closeAlert').addEventListener('click', closeCustomAlert);


// Fonction pour ouvrir l'alerte et désactiver les interactions
function openCustomAlertRetourne(product, item, orderId, newStatus, productIndex) {
    const customAlert = document.getElementById('customAlertRetourne');
    const pageContent = document.getElementById('main');
    const body = document.body;
    const confirmBtn = document.getElementById('confirmBtnRetourne');
    const cartItemsList = document.querySelector('.content-item');
    cartItemsList.innerHTML = "";

    const cartItemElement = document.createElement('div');
    cartItemElement.className = 'item';

    cartItemElement.innerHTML = `
        <div class="item-content">
            <div class="item-image">
            <img src="${product.images[0]}" alt="${product.name}">
            </div>
            <div class="fs-50 item-text">
                <p>${product.name}</p>
                <p>Quantité : ${item.quantity}</p>
            </div>
        </div>
    `;

    cartItemsList.appendChild(cartItemElement);

    customAlert.style.display = 'flex'; // Affiche l'alerte
    pageContent.classList.add('no-interaction'); // Désactive les interactions sur le reste de la page
    body.classList.add('no-scroll'); // Désactive le défilement

    // Retirer tout événement de clic préalablement ajouté pour éviter les duplications
    confirmBtn.onclick = null;

    // Attacher l'événement au bouton de confirmation avec les paramètres actuels
    confirmBtn.onclick = async () => {
        //document.getElementById('loading-spinner').style.display = 'block';
        const motifContent = document.getElementById('motif');
        const texteMotif = motifContent.value.trim(); // Obtenir le texte et supprimer les espaces en début/fin

        if(texteMotif === ""){
            //document.getElementById('loading-spinner').style.display = 'none';
        }else{
            try {
                await updateProductStatusInOrder(orderId, newStatus, productIndex, texteMotif);
            } catch (error) {
                
            } finally {
                closeCustomAlertRetourne(); // Ferme l'alerte après l'opération
                //document.getElementById('loading-spinner').style.display = 'none';
                showAlert1("Votre demande est encours d'examination");
                delay(250);
                window.history.back();
            }
        }
        
    };
}

// Fonction pour fermer l'alerte et réactiver les interactions
function closeCustomAlertRetourne() {
    const customAlert = document.getElementById('customAlertRetourne');
    const pageContent = document.getElementById('main');
    const body = document.body;

    customAlert.style.display = 'none'; // Cache l'alerte
    pageContent.classList.remove('no-interaction'); // Réactive les interactions sur la page
    body.classList.remove('no-scroll'); // Réactive le défilement
}

// Fermer l'alerte sans effectuer de mise à jour lors du clic sur la croix
document.getElementById('closeAlertRetourne').addEventListener('click', closeCustomAlertRetourne);

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}