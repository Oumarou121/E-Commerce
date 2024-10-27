import { getPendingOrDeliveredOrders, getCancelledOrReturnedOrders, getReportOrDismissOrders , getProductById } from './firebase.js';

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

document.getElementById('exit').addEventListener('click', ()=>{
    history.back();
})

function isMobile() {
    return window.matchMedia("(max-width: 35em)").matches;
}

// const interval = 2;
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
        case 'progress':
            return `${"Livraison ce"} ${startDayOfWeek} ${startDay} ${startMonth}`;
        default:
            eventText = "Événement entre le"; // Valeur par défaut si type non reconnu
    }

    return `${eventText} ${startDayOfWeek} ${startDay} ${startMonth} et le ${endDayOfWeek} ${endDay} ${endMonth}`;
}


// Sélectionnez tous les liens de navigation
const navLinks = document.querySelectorAll('.bar-nav li a');
const tabContents = document.querySelectorAll('.tab-content');

// Ajoutez un écouteur d'événements pour chaque lien
navLinks.forEach(link => {
    link.addEventListener('click', async function() {
        // Retirez la classe "active" de tous les liens
        navLinks.forEach(nav => nav.classList.remove('active'));

        // Cacher tout le contenu des onglets
        tabContents.forEach(content => content.style.display = 'none');
        await delay(250);  // Pause de 2 secondes
        tabContents.forEach(content => content.style.transform = 'scaleX(0)');
        
        // Ajoutez la classe "active" au lien cliqué
        this.classList.add('active');

        // Afficher le contenu de l'onglet cliqué
        const contentId = link.getAttribute('data-tab');
        document.getElementById(contentId).style.display = 'block';
        await delay(250);  // Pause de 2 secondes
        document.getElementById(contentId).style.transform = 'scaleX(1)';
    });
});

document.addEventListener('DOMContentLoaded', async () => {
    const cartItemsList = document.querySelector('.cart-items');
    const cartItemsList1 = document.querySelector('.cart-items1');
    const cartItemsList2 = document.querySelector('.cart-items2');
    const emptyCartMessage1 = document.getElementById('emptyCartMessage1');
    const emptyCartMessage2 = document.getElementById('emptyCartMessage2');
    const emptyCartMessage3 = document.getElementById('emptyCartMessage3');
    //document.getElementById('loading-spinner').style.display = 'block';
    const PendingOrDeliveredOrders = await getPendingOrDeliveredOrders();
    const CancelledOrReturnedOrders = await getCancelledOrReturnedOrders();
    const ReportOrDismissOrders = await getReportOrDismissOrders();

    const displayCartItems = async () => {
        //document.getElementById('loading-spinner').style.display = 'block';
        
        if (PendingOrDeliveredOrders && PendingOrDeliveredOrders.length > 0){
            emptyCartMessage1.style.display = 'none'; // Masque le message de panier vide
            for (const item of PendingOrDeliveredOrders){
                
                const items = item.items;
                for(const productItem of items){
                    const productId = productItem.productId; // Récupérer l'ID du produit
                    const product = await getProductById(productId);
                    const cartItemElement = document.createElement('li');
                    cartItemElement.className = 'cart-item';
                    let state;
                    let date;


                    if (["pending", "progress" ,"delivered", "checking"].includes(productItem.status)){
                        if (productItem.status === "pending") {
                            const now = Date.now(); // Obtenir le timestamp actuel
                            const time = productItem.updatedAt.toDate ? productItem.updatedAt.toDate() : new Date(productItem.updatedAt); // Convertir le timestamp Firebase en Date
                            const Edate = new Date(time); // Créer un objet Date à partir de `updatedAt`
                            Edate.setDate(Edate.getDate() + delayAvantExp); // Ajouter 1 jour à `updatedAt`
                        
                            if (now <= Edate.getTime()) {
                                state = "EN ATTENTE D'EXPÉDITION";
                            } else {
                                state = "COMMANDE EN COURS";
                            }
                            date = formatDateRange(productItem.updatedAt, "delivery");
                            
                        }else if (productItem.status === "progress") {
                            state = "LIVRAISON EN COURS";
                            const historyAll = productItem.history;
                            const exists = historyAll.some(item => item.status === "report-delivered");
                            if (exists) {
                                date = formatDateRange(productItem.updatedAt, "progress");
                            }else{
                                date = formatDateRange(productItem.updatedAt, "progress");
                            }                            
                            
                        } else if (productItem.status === "delivered") {
                            state = "COMMANDE LIVRÉE";
                            date = formatDate(productItem.updatedAt);
                        
                        } else if (productItem.status === "checking") {
                            state = "COMMANDE EN EXAMINATION";
                            date = formatDateRange(productItem.updatedAt, "checking");
                        }
                        
                        
                    
                        cartItemElement.innerHTML = `
                        <div class="image">
                        <img src="${product.images[0]}" alt="${product.name}">
                        </div>
                        <div class="div-name">
                            <div class="name text-black">
                                ${product.name}
                            </div>
                            <div class="Num-comd">Commande ${item.orderId}</div>
                            <div class="qty">Quantité: ${productItem.quantity}</div>
                            <div class="state text-white bg-green">${state}</div>
                            <div class="time">${date}</div>
                        </div>
                        <div class="div-btn">
                            <div class="Add text-black">
                                <i class="uil uil-shopping-cart-alt"></i>
                                DÉTAILS
                            </div>
                            <div></div>
                        </div>
                        `;
                    
                        if (productItem.status == "pending") {
                            cartItemElement.querySelector(".state").style.backgroundColor = "hsl(var(--clr-blue))"; // Changer la couleur de fond
                        }

                        if (productItem.status == "progress") {
                            cartItemElement.querySelector(".state").style.backgroundColor = "hsl(var(--clr-green) / .5)"; // Changer la couleur de fond
                        }

                        if (productItem.status == "checking") {
                            cartItemElement.querySelector(".state").style.backgroundColor = "hsl(var(--clr-red) / .5)"; // Changer la couleur de fond
                        }

                        if (productItem.quantity == 1) {
                            cartItemElement.querySelector(".qty").style.visibility = "hidden";
                        } else {
                            cartItemElement.querySelector(".qty").style.visibility = "visible";
                        }
                    
                        if (isMobile()) {
                            cartItemElement.addEventListener('click', ()=>{
                                window.location.href = `detail.html?id=${item.orderId}`;
                            })
                        } else {
                            const detail = cartItemElement.querySelector('.Add');
                            detail.addEventListener('click', ()=>{
                                window.location.href = `detail.html?id=${item.orderId}`;
                            })
                        }
                    
                        cartItemsList.appendChild(cartItemElement);
                    }
                }
                
            }
        }else{
            emptyCartMessage1.style.display = 'flex';
        }

        if (CancelledOrReturnedOrders && CancelledOrReturnedOrders.length > 0){
            emptyCartMessage2.style.display = 'none'; // Masque le message de panier vide
            for (const item of CancelledOrReturnedOrders){
                
                const items = item.items;
                for(const productItem of items){
                    const productId = productItem.productId; // Récupérer l'ID du produit
                    const product = await getProductById(productId);
                    const cartItemElement = document.createElement('li');
                    cartItemElement.className = 'cart-item';
                    let state;
                    let date;
                    date = formatDate(productItem.updatedAt);

                    if (["cancelled", "returned"].includes(productItem.status)){

                        if (productItem.status == "cancelled") {
                            state = "COMMANDE ANNULÉE";
                        } else if (productItem.status == "returned") {
                            state = "COMMANDE RETOURNÉE";
                        } 
    
                        cartItemElement.innerHTML = `
                        <div class="image">
                        <img src="${product.images[0]}" alt="${product.name}">
                        </div>
                        <div class="div-name">
                            <div class="name text-black">
                                ${product.name}
                            </div>
                            <div class="Num-comd">Commande ${item.orderId}</div>
                            <div class="qty">Quantité: ${productItem.quantity}</div>
                            <div class="state text-white bg-red">${state}</div>
                            <div class="time">${date}</div>
                        </div>
                        <div class="div-btn">
                            <div class="Add text-black">
                                <i class="uil uil-shopping-cart-alt"></i>
                                DÉTAILS
                            </div>
                            <div></div>
                        </div>
                        `;
    
                        if (productItem.status == "cancelled") {
                            cartItemElement.querySelector(".state").style.backgroundColor = "hsl(var(--clr-black) / .8)"; // Changer la couleur de fond
                        } 
    
                        if (productItem.status == "returned") {
                            cartItemElement.querySelector(".state").style.backgroundColor = "hsl(var(--clr-red) / .8)"; // Changer la couleur de fond
                        } 
    
                        if (productItem.quantity == 1) {
                            cartItemElement.querySelector(".qty").style.visibility = "hidden";
                        } else {
                            cartItemElement.querySelector(".qty").style.visibility = "visible";
                        }
    
                        if (isMobile()) {
                            cartItemElement.addEventListener('click', ()=>{
                                window.location.href = `detail.html?id=${item.orderId}`;
                            })
                        } else {
                            const detail = cartItemElement.querySelector('.Add');
                            detail.addEventListener('click', ()=>{
                                window.location.href = `detail.html?id=${item.orderId}`;
                            })
                        }
    
                        cartItemsList1.appendChild(cartItemElement);

                    }
                    
                }
                
            }
        }else{
            emptyCartMessage2.style.display = 'flex';
        }


        if (ReportOrDismissOrders && ReportOrDismissOrders.length > 0){
            emptyCartMessage3.style.display = 'none'; // Masque le message de panier vide
            for (const item of ReportOrDismissOrders){
                
                const items = item.items;
                for(const productItem of items){
                    const productId = productItem.productId; // Récupérer l'ID du produit
                    const product = await getProductById(productId);
                    const cartItemElement = document.createElement('li');
                    cartItemElement.className = 'cart-item';
                    let state;
                    let date;
                    date = formatDate(productItem.updatedAt);

                    if (["report-returned", "dismiss-delivered", "report-delivered", "dismiss-returned"].includes(productItem.status)){

                        if (productItem.status == "dismiss-delivered") {
                            state = "COMMANDE REJETÉE";
                        } else if (productItem.status == "report-returned") {
                            state = "RETOUR DE LA COMMANDE REPORTÉE";
                            date = formatDateRange(productItem.updatedAt, "report");
                        }else if (productItem.status == "report-delivered"){
                            state = "LIVRAISON REPORTÉE";
                            date = formatDateRange(productItem.updatedAt, "report");
                        }else if (productItem.status == "dismiss-returned"){
                            state = "RETOUR DE LA COMMANDE REJETÉE";
                        }
    
                        cartItemElement.innerHTML = `
                        <div class="image">
                        <img src="${product.images[0]}" alt="${product.name}">
                        </div>
                        <div class="div-name">
                            <div class="name text-black">
                                ${product.name}
                            </div>
                            <div class="Num-comd">Commande ${item.orderId}</div>
                            <div class="qty">Quantité: ${productItem.quantity}</div>
                            <div class="state text-white bg-red">${state}</div>
                            <div class="time">${date}</div>
                        </div>
                        <div class="div-btn">
                            <div class="Add text-black">
                                <i class="uil uil-shopping-cart-alt"></i>
                                DÉTAILS
                            </div>
                            <div></div>
                        </div>
                        `;

                        if (productItem.status == "report-returned") {
                            cartItemElement.querySelector(".state").style.backgroundColor = "hsl(var(--clr-blue) / .8)"; // Changer la couleur de fond
                            date = formatDateRange(productItem.updatedAt, "report");
                        }

                        if (productItem.status == "dismiss-returned") {
                            cartItemElement.querySelector(".state").style.backgroundColor = "hsl(var(--clr-red) / .9)"; // Changer la couleur de fond
                        }

                        if (productItem.status == "report-delivered") {
                            cartItemElement.querySelector(".state").style.backgroundColor = "hsl(var(--clr-blue) / .7)"; // Changer la couleur de fond
                        }
    
                        if (productItem.quantity == 1) {
                            cartItemElement.querySelector(".qty").style.visibility = "hidden";
                        } else {
                            cartItemElement.querySelector(".qty").style.visibility = "visible";
                        }
    
                        if (isMobile()) {
                            cartItemElement.addEventListener('click', ()=>{
                                window.location.href = `detail.html?id=${item.orderId}`;
                            })
                        } else {
                            const detail = cartItemElement.querySelector('.Add');
                            detail.addEventListener('click', ()=>{
                                window.location.href = `detail.html?id=${item.orderId}`;
                            })
                        }
    
                        cartItemsList2.appendChild(cartItemElement);

                    }
                    
                }
                
            }
        }else{
            emptyCartMessage3.style.display = 'flex';
        }


    }

    await displayCartItems();
    
        
});

                