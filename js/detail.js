function move(){
    window.location.href = 'track.html';
}

function move1(){
    window.location.href = 'commande.html';
}

import { getUserOrdersById, getProductById } from './firebase.js';

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

    let orderData = await getUserOrdersById(orderId);
    orderData = orderData[0];
    console.log(orderData);
    const shippingAddress = orderData.shippingAddress;
    const items = orderData.items;
    let totalQty = 0;
    
    const displayCartItems = async () => {
        document.getElementById('loading-spinner').style.display = 'block';
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

            detailsElement.innerHTML = `
            
            <h3>Colis ${index + 1}</h3>
            <span>Livraison à domicile. Expédié Niger.net Livraison entre
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
                <div class="btn-one text-white">
                    COMMANDE À NOUVEAU
                </div>
                <div class="btn-two" onclick="move()">
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
                btn2.textContent = "ANNULER VOTRE COMMANDE"
            }else if (item.status == "delivered"){

                if (now <= Edate1) {
                    state2.textContent = "RETOURNABLE";
                    state2.style.backgroundColor = "hsl(var(--clr-blue) / .8)";
                } else if (now >= Edate1){
                    state2.textContent = "NON-RETOURNABLE";
                    foot.style.cursor = "default";
                    footContent.textContent = `La période de retour s'est terminée ${formatDate(Edate1)}`;
                }

            }else if (item.status == "cancelled"){
                state2.style.visibility = "hidden";
                state1.textContent = "ANNULÉE";
                state1.style.backgroundColor = "hsl(var(--clr-black) / .8)";
                foot.style.display = "none";
                btn1.style.display = "none";
            }else if (item.status == "returned"){
                state2.textContent = "RETOURNÉE";
                state2.style.backgroundColor = "hsl(var(--clr-red) / .8)";
                foot.style.display = "none";
                btn1.style.display = "none";
            }

            cartItemsList.appendChild(cartItemElement);

        }

        const nbr = (totalQty == 1) ? `${totalQty} article` : `${totalQty} articles` ;

        orderNbr.textContent = nbr;

        document.getElementById('loading-spinner').style.display = 'none';
    }

    await displayCartItems();
    
        
});

                