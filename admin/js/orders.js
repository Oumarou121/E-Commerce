import { getAdminOrdersById, getProductById, updateProductStatusInOrderAdmin, updateOrderStatus, getOrdersList, getUserNameByUid } from './../../js/firebase.js';


// Fonction de "debounce" pour retarder la recherche
function debounce(func, delay) {
    let timeoutId;
    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
}

// Filtrer les commandes en fonction de la recherche avec le "debounce"
document.getElementById('orderSearch').addEventListener('input', debounce(function () {
    const searchValue = this.value.toLowerCase();
    const orderRows = document.querySelectorAll('.orders-table tbody tr');
    
    orderRows.forEach(row => {
        const rowText = row.textContent.toLowerCase();
        if (rowText.includes(searchValue)) {
            row.style.display = ''; // Afficher la ligne
        } else {
            row.style.display = 'none'; // Masquer la ligne
        }
    });
}, 300)); // Délai de 300 ms pour le "debounce"


function capitalizeFirstLetter(string) {
    if (!string) return string; // Vérifie si la chaîne n'est pas vide
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

// Function to add a new product
function addOrderData(Uid, userName, status, date, amount) {
    const productTable = document.getElementById('orderTable').getElementsByTagName('tbody')[0];
    const newRow = productTable.insertRow();

    newRow.innerHTML = `
        <td>${Uid}</td>
        <td>${userName}</td>
        <td><span class="status state">${capitalizeFirstLetter(status)}</span></td>
        <td>${date}</td>
        <td>${formatPrice(amount)} FCFA</td>
        <td>
            <button class="view-details">Details</button>
        </td>
    `;

    newRow.querySelector(".view-details").addEventListener('click', ()=>{
        detailsOrder(Uid);
    })

    if (status == "pending") {
        newRow.querySelector(".state").style.backgroundColor = "hsl(var(--clr-blue))"; // Changer la couleur de fond
    } 

    if (status == "delivered") {
        newRow.querySelector(".state").style.backgroundColor = "hsl(var(--clr-green))"; // Changer la couleur de fond
    }

    if (status == "checking") {
        newRow.querySelector(".state").style.backgroundColor = "hsl(var(--clr-red) / .5)"; // Changer la couleur de fond
    }

    if (status == "cancelled") {
        newRow.querySelector(".state").style.backgroundColor = "hsl(var(--clr-black) / .8)"; // Changer la couleur de fond
    } 

    if (status == "returned") {
        newRow.querySelector(".state").style.backgroundColor = "hsl(var(--clr-red) / .8)"; // Changer la couleur de fond
    }


}

function formatDate(timestamp) {
    const date = timestamp.toDate(); // Convertir le timestamp en objet Date
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
}

async function LoadListOrders() {
    const productTable = document.getElementById('orderTable').getElementsByTagName('tbody')[0];

    try {
        const OrdersList = await getOrdersList();

        if (OrdersList.length > 0) {
            productTable.innerHTML = '';

            OrdersList.forEach(async order => {
                const userName = await getUserNameByUid(order.userId);                
                addOrderData(order.orderId, userName, order.status, formatDate(order.updatedAt), order.totalAmount);
            });
        } else {
            productTable.innerHTML = '<p>Aucun produit disponible.</p>';
        }
    } catch (error) {
        console.log('Erreur lors de la récupération des produits', error);
        productTable.innerHTML = '<p>Erreur lors du chargement des produits.</p>';
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    await LoadListOrders();
});

function detailsOrder(orderUid) {
    openCustomAlert(orderUid);
    // document.getElementById('orderId').innerHTML = orderUid;
}

// Fonction pour ouvrir l'alerte et désactiver les interactions
function openCustomAlert(orderUid) {
    displayCartItems(orderUid);
    const customAlert = document.getElementById('customAlert');
    const pageContent = document.getElementById('main');
    const body = document.body;

    customAlert.style.display = 'flex'; // Affiche l'alerte
    pageContent.classList.add('no-interaction'); // Désactive les interactions sur le reste de la page
    body.classList.add('no-scroll'); // Désactive le défilement
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

// Fermer l'alerte sans suppression lors du clic sur la croix
document.getElementById('closeAlert').addEventListener('click', closeCustomAlert);

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

function formatDate1(timestamp) {
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

const displayCartItems = async (orderId) => {

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
    const option1_1 = document.querySelector(".option1_1");
    const option1_2 = document.querySelector(".option1_2");
    const option2 = document.querySelector(".option2");
    const option3_1 = document.querySelector(".option3_1");
    const option3_2 = document.querySelector(".option3_2");
    const option4 = document.querySelector(".option4");

    let orderData = await getAdminOrdersById(orderId);
    orderData = orderData[0];
    const shippingAddress = orderData.shippingAddress;
    const status = orderData.status;
    const items = orderData.items;
    let totalQty = 0;

    if (status == "pending") {
        option1_1.style.display = 'none';
        option3_1.style.display = 'none';
        option2.style.display = 'none';
    } else if (status == "checking") {
        option1_2.style.display = 'none';
        option3_2.style.display = 'none';
        option4.style.display = 'none';
    }


    //document.getElementById('loading-spinner').style.display = 'block';
    const ads = (shippingAddress.adresse_sup == "") ? shippingAddress.adresse : `${shippingAddress.adresse} , ${shippingAddress.adresse_sup}`;
    orderNum.textContent = `Commande n°${orderId}`;
    orderDate.textContent = formatFirebaseTimestamp(orderData.createdAt);
    orderTotal.textContent = `Total: ${formatPrice(orderData.totalAmount)} FCFA`;
    orderTotal1.textContent = `Total: ${formatPrice(orderData.totalAmount)} FCFA`;
    orderSousTotal.textContent = `Sous-total: ${formatPrice(orderData.totalAmount - 2000)} FCFA`;
    name.textContent = `${shippingAddress.prenom} ${shippingAddress.nom}`;
    adresse.textContent = ads;
    region.textContent = `${shippingAddress.region}, Niger`;

    while (cartItemsList.firstChild) {
        cartItemsList.removeChild(cartItemsList.firstChild);
    }

    while (detailsList.firstChild) {
        detailsList.removeChild(detailsList.firstChild);
    }

    for(const [index, item] of items.entries()){
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
                <div class="select-box">
                    <select class="select">
                        <option value="" selected>Currente state</option>
                        <option class="option3_1" value="report-returned">Report</option>
                        <option class="option1_1" value="dismiss-returned">Dismiss</option>
                        <option class="option1_2" value="dismiss-delivered">Dismiss</option>
                        <option class="option2" value="returned">Returned</option>
                        <option class="option3_2" value="report-delivered">Report</option>
                        <option class="option4" value="delivered">Delivered</option>
                    </select>
                </div>
            </div>
            <div class="time"></div>
        </header>
        <div class="cart-item">
            <div class="image">
                <img src="/${product.images[0]}" alt="${product.name}">
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

        `;
        const state1 = cartItemElement.querySelector(".state1");
        const time = cartItemElement.querySelector(".time");
        const select_box = cartItemElement.querySelector(".select-box");
        const option1_1 = cartItemElement.querySelector(".option1_1");
        const option1_2 = cartItemElement.querySelector(".option1_2");
        const option2 = cartItemElement.querySelector(".option2");
        const option3_1 = cartItemElement.querySelector(".option3_1");
        const option3_2 = cartItemElement.querySelector(".option3_2");
        const option4 = cartItemElement.querySelector(".option4");


        if (item.status == "pending") {
            time.textContent = formatDeliveryDateRange(item.updatedAt);
        } else if (item.status == "checking") {
            time.textContent = formatCheckingDateRange(item.updatedAt);
        } else {
            time.textContent = formatDate1(item.updatedAt); 
        }  
        
        const now = Date.now(); // Obtenir le timestamp actuel
        const time1 = item.updatedAt; // Récupérer le timestamp de `updatedAt`
        const Sdate = new Date(time1); // Créer un objet Date à partir de `updatedAt`
        const Edate = new Date(time1); // Créer une autre date à partir de `updatedAt`
        const Edate1 = new Date(time1); // Créer une autre date à partir de `updatedAt`
        Edate.setDate(Sdate.getDate() + 1); // Ajouter 1 jour à `updatedAt`
        Edate1.setDate(Sdate.getDate() + 3); // Ajouter 1 jour à `updatedAt`


        if (item.status == "pending"){
            state1.style.backgroundColor = "hsl(var(--clr-blue))";
            option1_1.style.display = 'none';
            option2.style.display = 'none';
            option3_1.style.display = 'none';

            if (now <= Edate) {
                state1.textContent = "En ATTENTE D'EXPÉDITION";
                select_box.style.display = 'none';
            } else if (now >= Edate){
                state1.textContent = "COMMANDE EN COURS";
            } 

        }else if (item.status == "delivered"){

            select_box.style.display = 'none';

        }else if (item.status == "cancelled"){
            // state2.style.visibility = "hidden";
            state1.textContent = "ANNULÉE";
            state1.style.backgroundColor = "hsl(var(--clr-black) / .8)";
            select_box.style.display = 'none';
           
        }else if (item.status == "returned"){
            state1.textContent = "RETOURNÉE";
            state1.style.backgroundColor = "hsl(var(--clr-red) / .8)";
            select_box.style.display = 'none';
            
        }else if (item.status == "checking"){
            // state1.style.display = "none";
            state1.textContent = "COMMANDE EN EXAMINATION DE RETOUR";
            state1.style.backgroundColor = "hsl(var(--clr-red) / .5)";
            option1_2.style.display = 'none';
            option3_2.style.display = 'none';
            option4.style.display = 'none';

        }

        cartItemsList.appendChild(cartItemElement);

    }

    const nbr = (totalQty == 1) ? `${totalQty} article` : `${totalQty} articles` ;

    orderNbr.textContent = nbr;

    document.getElementById('confirmer').addEventListener('click', async () => {
        const commandeState = document.getElementById('commande-select')?.value; // Vérification de l'existence de l'élément
        if (!commandeState) {
            console.log("État de la commande non sélectionné");
        }
    
        try {
            for (const [index, item] of items.entries()) {
                const stateElement = document.querySelectorAll('.select')[index];
                if (!stateElement) {
                    console.log(`Élément de sélection manquant pour l'index ${index}`);
                    continue; // Passer au prochain élément si l'élément de sélection est introuvable
                }
    
                const state = stateElement.value;
                if (state !== "") {
                    console.log(state);
                    await updateProductStatusInOrderAdmin(orderId, state, index);
                    console.log(orderId, state, index);
                }
            }
    
            if (commandeState && commandeState !== "") {
                console.log(commandeState);
                await updateOrderStatus(orderId, commandeState);
                console.log(orderId, commandeState);
            }
        } catch (error) {
            console.error("Erreur lors de la mise à jour :", error);
        }
    });
}



