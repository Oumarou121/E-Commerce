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

const interval = 2;
const delayAvantExp = 1;
const delayFinRetour = 3;

function formatDate(timestamp, formatType = "standard") {
    // Si l'entrée est un Timestamp de Firebase, la convertir en objet Date
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);

    // Récupération du jour, du mois et de l'année
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    // Choisir le format en fonction du type spécifié
    if (formatType === "standard") {
        return `Le ${day}-${month}-${year}`;
    } else if (formatType === "detailed") {
        return `Effectuée le ${day}-${month}-${year}`;
    } else {
        // Si le formatType n'est pas reconnu, utiliser le format standard par défaut
        return `Le ${day}-${month}-${year}`;
    }
}


const daysOfWeek = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"];
const months = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];

function formatDateRange(startTimestamp, eventType) {
    // Convertir le Timestamp en objet Date
    const startDate = startTimestamp.toDate ? startTimestamp.toDate() : new Date(startTimestamp);
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + interval); // Ajouter interval jours

    const startDayOfWeek = daysOfWeek[startDate.getDay()];
    const startDay = startDate.getDate();
    const startMonth = months[startDate.getMonth()];

    const endDayOfWeek = daysOfWeek[endDate.getDay()];
    const endDay = endDate.getDate();
    const endMonth = months[endDate.getMonth()];

    // Déterminer le texte basé sur le type d'événement
    let eventText;
    switch (eventType) {
        case 'delivery':
            eventText = "Livré entre le";
            break;
        case 'checking':
            eventText = "Fin d'examination entre le";
            break;
        case 'report':
            eventText = "Reporter entre le";
            break;
        case 'colis':
            eventText = " le";
            break;
        case 'progress':
            return `${"Livraison ce"} ${startDayOfWeek} ${startDay} ${startMonth}`;
        case 'progress-checking':
                return `${"Retour ce"} ${startDayOfWeek} ${startDay} ${startMonth}`;
        default:
                eventText = "Événement entre le"; // Valeur par défaut si type non reconnu
        }
    
    return `${eventText} ${startDayOfWeek} ${startDay} ${startMonth} et le ${endDayOfWeek} ${endDay} ${endMonth}`;
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
    const shippingAddress = orderData.shippingAddress;
    const items = orderData.items;
    let totalQty = 0;
    
    const displayCartItems = async () => {
        //document.getElementById('loading-spinner').style.display = 'block';
        const ads = (shippingAddress.adresse_sup == "") ? shippingAddress.adresse : `${shippingAddress.adresse} , ${shippingAddress.adresse_sup}`;
        orderNum.textContent = `Commande n°${orderId}`;
        orderDate.textContent = formatDate(orderData.createdAt, "detailed");
        orderTotal.textContent = `Total: ${formatPrice(orderData.totalAmount)} FCFA`;
        orderTotal1.textContent = `Total: ${formatPrice(orderData.totalAmount)} FCFA`;
        orderSousTotal.textContent = `Sous-total: ${formatPrice(orderData.totalAmount - 2000)} FCFA`;
        name.textContent = `${shippingAddress.prenom} ${shippingAddress.nom}`;
        adresse.textContent = ads;
        region.textContent = `${shippingAddress.region}, Niger`;

        for(const [index, item] of items.entries()){
            totalQty += item.quantity;

            const productId = item.productId; // Récupérer l'ID du produit
            const product = await getProductById(productId);
            const cartItemElement = document.createElement('li');
            const detailsElement = document.createElement('div');
            cartItemElement.className = 'cart-content';

            const content1 = (item.status == "checking") ? `${"La commande sera récupérée entre"}  <strong>${formatDateRange(item.updatedAt, "colis")}</strong>` : `${"Livraison à domicile. Expédié Niger.net Livraison entre"} <strong>${formatDateRange(item.updatedAt, "colis")}</strong>` ;
            const content2 = (item.status == "report-delivered" || item.status == "report-returned") ? `${"Reporter entre"} <strong>${formatDateRange(item.updatedAt, "colis")}</strong>` : content1;
            detailsElement.innerHTML = `
            
            <h3>Colis ${index + 1}</h3>
            <span>
                ${content2}
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
                <div class="time"></div>
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
                time.textContent = formatDateRange(item.updatedAt, 'delivery');
            } else if (item.status == "checking") {
                time.textContent = formatDateRange(item.updatedAt, 'checking');
            } else if(["report-delivered", "report-returned"].includes(item.status)){
                time.textContent = formatDateRange(item.updatedAt, 'report');
            } else if (item.status === "progress") {
                const historyAll = item.history;
                if (historyAll.length >= 2) { // Vérifie qu'il y a au moins deux éléments
                    const avantDernier = historyAll[historyAll.length - 2];
                    if (avantDernier.status === "checking") {
                        state1.textContent = "RETOUR EN COURS";
                        time.textContent = formatDateRange(item.updatedAt, "progress-checking");
                    } else {
                        state1.textContent = "LIVRAISON EN COURS";
                        time.textContent = formatDateRange(item.updatedAt, "progress");
                    }
                } else {
                    // Si le tableau n'a pas au moins deux éléments, utiliser le comportement par défaut
                    state1.textContent = "LIVRAISON EN COURS";
                    time.textContent = formatDateRange(item.updatedAt, "progress");
                }
                                                     
            } else {
                time.textContent = formatDate(item.updatedAt); 
            }  
            
            const foot = cartItemElement.querySelector(".cart-icon-bottom");
            const footContent = cartItemElement.querySelector(".uil-redo");
            const now = Date.now(); // Obtenir le timestamp actuel
            const updataTime = item.updatedAt; // Récupérer le timestamp de `updatedAt`
            const updatedAtDate = updataTime.toDate ? updataTime.toDate() : new Date(updataTime); // Convertir le Timestamp Firebase en Date
                    
            // Calculer les dates d'expiration
            const Edate = new Date(updatedAtDate);
            Edate.setDate(updatedAtDate.getDate() + delayAvantExp); // Ajouter 1 jour pour l'expédition
                    
            const Edate1 = new Date(updatedAtDate);
            Edate1.setDate(updatedAtDate.getDate() + delayFinRetour); // Ajouter 3 jours pour le retour
                    
            if (item.status === "pending") {
                state2.style.visibility = "hidden";
                state1.style.backgroundColor = "hsl(var(--clr-blue))";
            
                state1.textContent = (now <= Edate.getTime()) 
                    ? "En ATTENTE D'EXPÉDITION" 
                    : "COMMANDE EN COURS";
            
                foot.style.display = "none";
                btn1.style.display = "block";
                btn1.textContent = "SUIVRE VOTRE COLIS";
                btn2.textContent = "ANNULER VOTRE COMMANDE";
            
                btn1.addEventListener('click', () => {
                    window.location.href = `track.html?id=${orderData.orderId}&index=${index}`;
                });
            
                btn2.addEventListener('click', () => {
                    openCustomAlert(orderId, "cancelled", index);
                });
            
            } else if (item.status === "progress") {
                state2.style.visibility = "hidden";
                state1.style.backgroundColor = "hsl(var(--clr-green) / .5)";
                // state1.textContent = "LIVRAISON EN COURS";
                foot.style.display = "none";
                btn1.textContent = "SUIVRE VOTRE COLIS";
                btn2.style.display = 'none';
                btn1.addEventListener('click', () => {
                    window.location.href = `track.html?id=${orderData.orderId}&index=${index}`;
                });                                     
            } else if (item.status === "delivered") {
                if (now <= Edate1.getTime()) {
                    state2.textContent = "RETOURNABLE";
                    state2.style.backgroundColor = "hsl(var(--clr-blue) / .8)";
                    foot.addEventListener('click', () => {
                        openCustomAlertRetourne(product, item, orderId, "checking", index);
                    });
                } else {
                    state2.textContent = "NON-RETOURNABLE";
                    foot.style.cursor = "default";
                    footContent.textContent = `La période de retour s'est terminée ${formatDate(Edate1)}, mais si c'est en rapport avec la garantie, consultez le +227 94464639`;
                }
            
                const cartIcon = cartItemElement.querySelector('.add-to-cart');
                const isCart = await isInCart(productId);
            
                if (isCart) {
                    cartIcon.classList.add('in-cart');
                }
            
                btn1.addEventListener('click', async () => {
                    if (cartIcon.classList.contains('in-cart')) {
                        await removeFromCart(productId);
                        cartIcon.classList.remove('in-cart');
                        showAlert('Le produit a été retiré de votre panier!');
                    } else {
                        await addToCart(productId, 1); // Quantité par défaut de 1
                        cartIcon.classList.add('in-cart');
                        showAlert('Le produit a été ajouté à votre panier!');
                    }
                });
            
                btn2.addEventListener('click', () => {
                    window.location.href = `track.html?id=${orderData.orderId}&index=${index}`;
                });
                
            }else if (item.status == "cancelled"){
                state2.style.visibility = "hidden";
                state1.textContent = "COMMANDE ANNULÉE";
                state1.style.backgroundColor = "hsl(var(--clr-black) / .8)";
                foot.style.display = "none";
                btn1.style.display = "none";
                btn2.addEventListener('click', ()=>{
                    window.location.href = `track.html?id=${orderData.orderId}&index=${index}`;
                });
            }else if (item.status == "returned"){
                state2.textContent = "COMMANDE RETOURNÉE";
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
            } else if(["report-returned", "dismiss-delivered", "report-delivered", "dismiss-returned"].includes(item.status)) {
                state1.style.display = "none";
                foot.style.display = "none";
                btn1.style.display = "none";
                btn2.addEventListener('click', ()=>{
                    window.location.href = `track.html?id=${orderData.orderId}&index=${index}`;
                });

                if (item.status == "report-delivered") {
                    state2.textContent = "COMMANDE REPORTÉE";
                    state2.style.backgroundColor = "hsl(var(--clr-blue) / .5)";
                }

                if (item.status == "report-returned") {
                    state2.textContent = "RETOUR DE LA COMMANDE REPORTÉE";
                    state2.style.backgroundColor = "hsl(var(--clr-blue) / .7)";
                }

                if (item.status == "dismiss-delivered") {
                    state2.textContent = "COMMANDE REJETÉE";
                    state2.style.backgroundColor = "hsl(var(--clr-red))";
                }

                if (item.status == "dismiss-returned") {
                    state2.textContent = "RETOUR DE LA COMMANDE REJETÉE";
                    state2.style.backgroundColor = "hsl(var(--clr-red) / .9)";
                }
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
                console.log(orderId, newStatus, productIndex, texteMotif)
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