import { getAdminOrdersById, getProductById, updateProductStatusInOrderAdmin, updateOrderStatus, getOrdersList, getUserNameByUid } from './../../js/firebase.js';

// Sélectionne tous les éléments de filtre
document.querySelectorAll('.filtre li').forEach(li => {
    li.addEventListener('click', () => {
        // Trouve l'input checkbox à l'intérieur du `li` et change son état
        const checkbox = li.querySelector('input[type="checkbox"]');
        checkbox.checked = !checkbox.checked;
        
        // Applique le style si la case est cochée
        if (checkbox.checked) {
            li.classList.add('checked');
            filterOrders()
        } else {
            li.classList.remove('checked');
            filterOrders()
        }
    });
});

// Fonction de debounce
function debounce(func, delay) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), delay);
    };
}

// Fonction pour filtrer les commandes
function filterOrders() {
    const searchValue = document.getElementById('orderSearch').value.toLowerCase();
    const selectedStatuses = Array.from(document.querySelectorAll('.filtre li input[type="checkbox"]:checked'))
                                  .map(checkbox => checkbox.getAttribute('name'));

    const orderRows = document.querySelectorAll('.orders-table tbody tr');
    
    orderRows.forEach(row => {
        const rowText = row.textContent.toLowerCase();
        const rowStatus = row.getAttribute('data-status'); // Assurez-vous que chaque ligne possède un attribut `data-status`

        // Vérifie si la ligne correspond à la recherche et aux statuts cochés
        const matchesSearch = rowText.includes(searchValue);
        const matchesStatus = selectedStatuses.length === 0 || selectedStatuses.includes(rowStatus);

        if (matchesSearch && matchesStatus) {
            row.style.display = ''; // Afficher la ligne
        } else {
            row.style.display = 'none'; // Masquer la ligne
        }
    });
}

// Événement de recherche avec debounce
document.getElementById('orderSearch').addEventListener('input', debounce(filterOrders, 300));

function capitalizeFirstLetter(string) {
    if (!string) return string; // Vérifie si la chaîne n'est pas vide
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

// Function to add a new order
function addOrderData(Uid, userName, status, date, amount) {
    const productTable = document.getElementById('orderTable').getElementsByTagName('tbody')[0];
    const newRow = productTable.insertRow();

    // Ajout d'attributs pour le tri
    newRow.setAttribute('data-orderId', Uid); // Attribut pour Order ID
    newRow.setAttribute('data-updatedAt', date); // Convertir la date en timestamp pour le tri
    newRow.setAttribute('data-price', amount); // Attribut pour le montant

    // Ajout d'un attribut data-status pour le filtrage
    newRow.setAttribute('data-status', status);

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

    newRow.querySelector(".view-details").addEventListener('click', () => {
        detailsOrder(Uid);
    });

    // Changer la couleur de fond en fonction du statut
    const statusElement = newRow.querySelector(".state");
    switch (status) {
        case "pending":
            statusElement.style.backgroundColor = "hsl(var(--clr-blue))";
            break;
        case "progress":
            statusElement.style.backgroundColor = "hsl(var(--clr-green) / .5)";
            break;
        case "delivered":
            statusElement.style.backgroundColor = "hsl(var(--clr-green))";
            break;
        case "cancelled":
            statusElement.style.backgroundColor = "hsl(var(--clr-black) / .8)";
            break;
        case "returned":
            statusElement.style.backgroundColor = "hsl(var(--clr-red) / .8)";
            break;
        case "checking":
            statusElement.style.backgroundColor = "hsl(var(--clr-red) / .5)";
            break;
        case "report-delivered":
            statusElement.style.backgroundColor = "hsl(var(--clr-blue) / .5)";
            break;
        case "report-returned":
            statusElement.style.backgroundColor = "hsl(var(--clr-blue) / .7)";
            break;
        case "dismiss-delivered":
            statusElement.style.backgroundColor = "hsl(var(--clr-red))";
            break;
        case "dismiss-returned":
            statusElement.style.backgroundColor = "hsl(var(--clr-red) / .9)";
            break;
    }
}



function formatDateTable(timestamp) {
    const date = timestamp.toDate(); // Convertir le timestamp en objet Date
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
}

async function LoadListOrders() {
    const productTable = document.getElementById('orderTable').getElementsByTagName('tbody')[0];

    try {
        // const OrdersList = await getOrdersList();
        // OrdersList.sort((a, b) => a.updateAt - b.updateAt);

        const OrdersList = await getOrdersList();
        // OrdersList.sort((a, b) => {
        //     const idA = parseInt(a.orderId.replace('#', ''), 10); // Extraire et convertir en nombre
        //     const idB = parseInt(b.orderId.replace('#', ''), 10); // Extraire et convertir en nombre
        //     return idA - idB; // Trier dans l'ordre décroissant
        // });

        if (OrdersList.length > 0) {
            productTable.innerHTML = '';

            OrdersList.forEach(async order => {
                const userName = await getUserNameByUid(order.userId);                
                addOrderData(order.orderId, userName, order.status, formatDateTable(order.updatedAt), order.totalAmount);
            });
        } else {
            productTable.innerHTML = `
            <div class="cart vide bold-800 flex" id="emptyCartMessage3" style="display: flex;">
                <i class="uil uil-box"></i>
                <p>Orders Is Empty</p>
            </div>
            `;
        }
    } catch (error) {
        console.log('Erreur lors de la récupération des commandes', error);
        productTable.innerHTML = '<p>Erreur lors du chargement des commandes.</p>';
    }
}

export function sortItems(criteria, isAscending) {
    const tbody = document.querySelector('#orderTable tbody');
    const rows = Array.from(tbody.querySelectorAll('tr'));

    rows.sort((a, b) => {
        let valA, valB;

        // Vérifiez si le critère est 'orderId' pour gérer le #
        if (criteria === 'orderId') {
            valA = parseInt(a.getAttribute(`data-${criteria}`).replace('#', ''), 10); // Retire le '#' avant de parser
            valB = parseInt(b.getAttribute(`data-${criteria}`).replace('#', ''), 10);
        } else {
            valA = parseInt(a.getAttribute(`data-${criteria}`), 10);
            valB = parseInt(b.getAttribute(`data-${criteria}`), 10);
        }

        return (isAscending == "asc") ? valA - valB : valB - valA;
    });

    // Réorganise les lignes dans le DOM
    rows.forEach(row => tbody.appendChild(row));
}

let currentSort = {
    criteria: null,
    order: null
};

// Fonction pour mettre à jour les flèches
function updateArrows() {
    const arrows = document.querySelectorAll('.arrow');
    arrows.forEach(arrow => arrow.classList.remove('up', 'down')); // Réinitialiser toutes les flèches

    if (currentSort.criteria) {
        const currentArrow = document.getElementById(`${currentSort.criteria}-arrow`);
        currentArrow.classList.add(currentSort.order === 'asc' ? 'up' : 'down');
    }
}

// Gestion des boutons de tri
document.querySelectorAll('.sort-options button').forEach(button => {
    button.addEventListener('click', (event) => {
        const { target } = event;
        const criteria = target.getAttribute('data-criteria');
        
        // Vérifiez si le bouton cliqué a déjà la classe 'up' ou 'down'
        const currentArrow = document.getElementById(`${criteria}-arrow`);

        if (currentArrow.classList.contains('up')) {
            currentSort.order = 'desc'; // Passer à décroissant
            currentArrow.classList.remove('up');
            currentArrow.classList.add('down');
        } else {
            currentSort.order = 'asc'; // Passer à croissant
            currentArrow.classList.remove('down');
            currentArrow.classList.add('up');
        }

        // Réinitialiser le critère courant si un nouveau critère est sélectionné
        if (currentSort.criteria !== criteria) {
            currentSort.criteria = criteria; 
        }

        console.log(currentSort.order)
        // Appel de la fonction de tri
        sortItems(currentSort.criteria, currentSort.order);
        updateArrows(); // Mettre à jour les flèches après le tri
    });
});

document.addEventListener('DOMContentLoaded', async () => {
    await LoadListOrders();
});

function detailsOrder(orderUid) {
    openCustomAlert(orderUid);
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

const delayAvantExp = 1;

function formatDate(timestamp) {
    // Vérifier si l'entrée est un Timestamp de Firebase et le convertir en Date
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `Le ${day}-${month}-${year}`;
}

const daysOfWeek = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"];
const months = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];

function formatDateRange(startTimestamp, eventType, interval = 2) {
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
        case 'effectue':
            return `${"Effectuée le"} ${startDayOfWeek} ${startDay} ${startMonth}`;
        case 'progress':
            return `${"Livraison ce"} ${startDayOfWeek} ${startDay} ${startMonth}`;
        case 'progress-checking':
            return `${"Retour ce"} ${startDayOfWeek} ${startDay} ${startMonth}`;
        default:
            eventText = "Événement entre le"; // Valeur par défaut si type non reconnu
    }

    return `${eventText} ${startDayOfWeek} ${startDay} ${startMonth} et le ${endDayOfWeek} ${endDay} ${endMonth}`;
}

const displayCartItems = async (orderId) => {

    const state_commande_box = document.getElementById('select-box-commande');
    state_commande_box.style.display = 'none';
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
    const optionP = document.querySelector("#commande-select .optionP");
    const option0 = document.querySelector("#commande-select .option0");
    const option1_1 = document.querySelector("#commande-select .option1_1");
    const option1_2 = document.querySelector("#commande-select .option1_2");
    const option2 = document.querySelector("#commande-select .option2");
    const option3_1 = document.querySelector("#commande-select .option3_1");
    const option3_2 = document.querySelector("#commande-select .option3_2");
    const option4 = document.querySelector("#commande-select .option4");

    let orderData = await getAdminOrdersById(orderId);
    orderData = orderData['order'];
    const shippingAddress = orderData.shippingAddress;
    const status = orderData.status;
    const items = orderData.items;
    let totalQty = 0;
    //document.getElementById('loading-spinner').style.display = 'block';
    const ads = (shippingAddress.adresse_sup == "") ? shippingAddress.adresse : `${shippingAddress.adresse} , ${shippingAddress.adresse_sup}`;
    orderNum.textContent = `Commande n°${orderId}`;
    orderDate.textContent = formatDateRange(orderData.createdAt, "effectue");
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

    if (status == "pending") {
        optionP.style.display = 'none';
        option0.style.display = 'block';
        option1_1.style.display = 'none';
        option1_2.style.display = 'block';
        option3_1.style.display = 'none';
        option2.style.display = 'none';
        option3_2.style.display = 'none';
        option4.style.display = 'none';
        state_commande_box.style.display = 'block';
    } else if (status == "progress") {  
        state_commande_box.style.display = 'none';

    } else if (status == "report-returned" || status == "report-delivered") {
        optionP.style.display = 'none';
        option0.style.display = 'block';
        option1_1.style.display = 'none';
        option3_1.style.display = 'none';
        option2.style.display = 'none';
        option1_2.style.display = 'none';
        option3_2.style.display = 'none';
        option4.style.display = 'none';
        state_commande_box.style.display = 'block';
    }else if(status == "checking"){
        optionP.style.display = 'none';
        option0.style.display = 'block';
        option1_1.style.display = 'block';
        option1_2.style.display = 'none';
        option3_1.style.display = 'none';
        option2.style.display = 'none';
        option3_2.style.display = 'none';
        option4.style.display = 'none';
        state_commande_box.style.display = 'block';
    } else if(status == "returned"){
        optionP.style.display = 'block';
        option0.style.display = 'none';
        option1_1.style.display = 'none';
        option1_2.style.display = 'none';
        option3_1.style.display = 'none';
        option2.style.display = 'none';
        option3_2.style.display = 'none';
        option4.style.display = 'none';
        state_commande_box.style.display = 'block';
    } else{            
        optionP.style.display = 'none';
        option0.style.display = 'none';
        option1_1.style.display = 'none';
        option3_1.style.display = 'none';
        option2.style.display = 'none';
        option1_2.style.display = 'none';
        option3_2.style.display = 'none';
        option4.style.display = 'none';
        state_commande_box.style.display = 'none';
    }

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
                <div class="state1 text-white"></div>
                <div id="select-box-product" class="select-box">
                    <select class="select">
                        <option value="" selected>Currente state</option>
                        <option class="optionP" value="pending">Pending</option>
                        <option class="option0" value="progress">Progress</option>
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
        <div class="motif">
            <div>
                  <h4>Message</h4>
            </div>
            <div class="motif-content">
                    <textarea class="motifText" class="text-black fs-poppins" rows="4" placeholder="Votre message ici" required></textarea>
                </div>
            </div>
        </div>
        </div>
        <div class="content-right">
            <ul>
                <li class="value1"><i class="uil uil-wrap-text"></i> Value 1</li>
                <li class="value2"><i class="uil uil-wrap-text"></i> Value 2</li>
                <li class="value3"><i class="uil uil-wrap-text"></i> Value 3</li>
                <li class="value4"><i class="uil uil-wrap-text"></i> Value 4</li>
                <li class="delete"><i class="uil uil-trash"></i> Delete</li>
            </ul>
        </div>

        `;
        const state1 = cartItemElement.querySelector(".state1");
        const time = cartItemElement.querySelector(".time");
        const select_box = cartItemElement.querySelector(".select-box");
        const optionP = cartItemElement.querySelector(".optionP");
        const option0 = cartItemElement.querySelector(".option0");
        const option1_1 = cartItemElement.querySelector(".option1_1");
        const option1_2 = cartItemElement.querySelector(".option1_2");
        const option2 = cartItemElement.querySelector(".option2");
        const option3_1 = cartItemElement.querySelector(".option3_1");
        const option3_2 = cartItemElement.querySelector(".option3_2");
        const option4 = cartItemElement.querySelector(".option4");
        // const state_product = cartItemElement.querySelector("#select-box-product");
        const message = cartItemElement.querySelector(".motif");
        const valueBox = cartItemElement.querySelector(".content-right");
        const deleteValue = cartItemElement.querySelector(".delete");
        const value1 = cartItemElement.querySelector(".value1");
        const value2 = cartItemElement.querySelector(".value2");
        const value3 = cartItemElement.querySelector(".value3");
        const value4 = cartItemElement.querySelector(".value4");
        const motifText = cartItemElement.querySelector(".motifText");

        deleteValue.style.color = "red";

        deleteValue.addEventListener('click', ()=>{
            motifText.value = "";
        });

        value1.addEventListener('click', ()=>{
            motifText.value = "Value 1";
        });

        value2.addEventListener('click', ()=>{
            motifText.value = "Value 2";
        });

        value3.addEventListener('click', ()=>{
            motifText.value = "Value 3";
        });

        value4.addEventListener('click', ()=>{
            motifText.value = "Value 4";
        });
        
    
        const now = Date.now(); // Obtenir le timestamp actuel
        const time1 = item.updatedAt; // Récupérer le timestamp de `updatedAt`
        // Calculer les dates d'expiration
        const updatedAtDate = time1.toDate ? time1.toDate() : new Date(time1); // Convertir le Timestamp Firebase en Date
        const Edate = new Date(updatedAtDate);
        Edate.setDate(updatedAtDate.getDate() + delayAvantExp); // Ajouter 1 jour pour l'expédition

        if (item.status == "pending"){
            time.textContent = formatDateRange(item.updatedAt, 'delivery');
            state1.style.backgroundColor = "hsl(var(--clr-blue))";
            optionP.style.display = 'none';
            option1_1.style.display = 'none';
            option3_1.style.display = 'none';
            option2.style.display = 'none';
            option3_2.style.display = 'none';
            option4.style.display = 'none';
            message.style.display = "none";
            valueBox.style.display = "none";

            if (now <= Edate) {
                state1.textContent = "En ATTENTE D'EXPÉDITION";
                select_box.style.display = 'none';
            } else if (now >= Edate){
                state1.textContent = "COMMANDE EN COURS";
                select_box.style.display = 'block'
            } 

        }else if (item.status == "cancelled"){
            message.style.display = "none";
            valueBox.style.display = "none";
            time.textContent = formatDate(item.updatedAt);
            state1.textContent = "COMMANDE ANNULÉE";
            state1.style.backgroundColor = "hsl(var(--clr-black) / .8)";
            select_box.style.display = 'none';
           
        }else if (item.status == "returned"){
            message.style.display = "block";
            valueBox.style.display = "block";
            time.textContent = formatDate(item.updatedAt);
            state1.textContent = "COMMANDE RETOURNÉE";
            state1.style.backgroundColor = "hsl(var(--clr-red) / .8)";
            optionP.style.display = 'block';
            option0.style.display = 'none';
            option1_1.style.display = 'none';
            option3_1.style.display = 'none';
            option2.style.display = 'none';
            option1_2.style.display = 'none';
            option3_2.style.display = 'none';
            option4.style.display = 'none';
            select_box.style.display = 'block';
            
        }else if (item.status == "checking"){
            message.style.display = "block";
            valueBox.style.display = "block";
            time.textContent = formatDateRange(item.updatedAt, 'checking');
            state1.textContent = "COMMANDE EN EXAMINATION DE RETOUR";
            state1.style.backgroundColor = "hsl(var(--clr-red) / .5)";
            optionP.style.display = 'none';
            option0.style.display = 'block';
            option1_1.style.display = 'block';
            option3_1.style.display = 'none';
            option2.style.display = 'none';
            option1_2.style.display = 'none';
            option3_2.style.display = 'none';
            option4.style.display = 'none';
            select_box.style.display = 'block';

        }else if (item.status == "progress"){
            message.style.display = "block";
            valueBox.style.display = "block";
            state1.style.backgroundColor = "hsl(var(--clr-green) / .5)";
            optionP.style.display = 'none';
            option0.style.display = 'none';
            select_box.style.display = 'block';
            state1.textContent = "LIVRAISON EN COURS";
            time.textContent = formatDateRange(item.updatedAt, "progress");
            const historyAll = item.history;
            if (historyAll.length >= 2) { // Vérifie qu'il y a au moins deux éléments
                const avantDernier = historyAll[historyAll.length - 2];
                if (avantDernier.status === "checking") {
                    state1.textContent = "RETOUR EN COURS";
                    option1_2.style.display = 'none';
                    option3_2.style.display = 'none';
                    option4.style.display = 'none';
                    time.textContent = formatDateRange(item.updatedAt, "progress-checking");
                } else {
                    option1_2.style.display = 'none';
                    option1_1.style.display = 'none';
                    option3_1.style.display = 'none';
                    option2.style.display = 'none';
                }
            } else {
                // Si le tableau n'a pas au moins deux éléments, utiliser le comportement par défaut
                option1_1.style.display = 'none';
                option3_1.style.display = 'none';
                option2.style.display = 'none';
            }

        }else if (item.status == "delivered"){
            message.style.display = "none";
            valueBox.style.display = "none";
            state1.textContent = "COMMANDE LIVRÉE";
            state1.style.backgroundColor = "hsl(var(--clr-green))";
            time.textContent = formatDate(item.updatedAt);
            select_box.style.display = 'none';

        }else if (item.status == "report-returned" || item.status == "report-delivered") {
            message.style.display = "block";
            valueBox.style.display = "block";
            optionP.style.display = 'none';
            option0.style.display = 'block';
            option1_1.style.display = 'none';
            option3_1.style.display = 'none';
            option2.style.display = 'none';
            option1_2.style.display = 'none';
            option3_2.style.display = 'none';
            option4.style.display = 'none';
            select_box.style.display = 'block';
            time.textContent = formatDateRange(item.updatedAt, "report");

            if (item.status == "report-delivered") {
                state1.textContent = "COMMANDE REPORTÉE";
                state1.style.backgroundColor = "hsl(var(--clr-blue) / .5)";
            }

            if (item.status == "report-returned") {
                state1.textContent = "RETOUR DE LA COMMANDE REPORTÉE";
                state1.style.backgroundColor = "hsl(var(--clr-blue) / .7)";
            }
        }else if(item.status == "dismiss-returned" || item.status == "dismiss-delivered"){
            message.style.display = "none";
            valueBox.style.display = "none";
            select_box.style.display = 'none';
            time.textContent = formatDate(item.updatedAt);

            if (item.status == "dismiss-delivered") {
                state1.textContent = "COMMANDE REJETÉE";
                state1.style.backgroundColor = "hsl(var(--clr-red))";
            }

            if (item.status == "dismiss-returned") {
                state1.textContent = "RETOUR DE LA COMMANDE REJETÉE";
                state1.style.backgroundColor = "hsl(var(--clr-red) / .9)";
            }
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



