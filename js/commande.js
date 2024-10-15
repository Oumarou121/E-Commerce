import { getPendingOrDeliveredOrders, getCancelledOrReturnedOrders, getProductById } from './firebase.js';

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

document.getElementById('exit').addEventListener('click', ()=>{
    history.back();
})

function isMobile() {
    return window.matchMedia("(max-width: 35em)").matches;
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
    const emptyCartMessage = document.getElementById('emptyCartMessage');
    //document.getElementById('loading-spinner').style.display = 'block';
    const PendingOrDeliveredOrders = await getPendingOrDeliveredOrders();
    const CancelledOrReturnedOrders = await getCancelledOrReturnedOrders();
    
    const displayCartItems = async () => {
        //document.getElementById('loading-spinner').style.display = 'block';
        
        if (PendingOrDeliveredOrders && PendingOrDeliveredOrders.length > 0){
            emptyCartMessage.style.display = 'none'; // Masque le message de panier vide
            console.log(PendingOrDeliveredOrders);
            for (const item of PendingOrDeliveredOrders){
                
                const items = item.items;
                console.log(items);
                for(const productItem of items){
                    const productId = productItem.productId; // Récupérer l'ID du produit
                    const product = await getProductById(productId);
                    console.log(product)
                    const cartItemElement = document.createElement('li');
                    cartItemElement.className = 'cart-item';
                    let state;
                    let date;


                    if (productItem.status == "pending" || productItem.status == "delivered" || productItem.status == "checking"){
                        if (productItem.status == "pending") {
                            const now = Date.now(); // Obtenir le timestamp actuel
                            const time = productItem.updatedAt; // Récupérer le timestamp de `updatedAt`
                            const Sdate = new Date(time); // Créer un objet Date à partir de `updatedAt`
                            const Edate = new Date(time); // Créer une autre date à partir de `updatedAt`
                            Edate.setDate(Sdate.getDate() + 1); // Ajouter 1 jour à `updatedAt`
                        
                            if (now <= Edate) {
                                state = "En ATTENTE D'EXPÉDITION";
                            } else if (now >= Edate){
                                state = "COMMANDE EN COURS";
                            } 
                        
                            date = formatDeliveryDateRange(productItem.updatedAt);
                        
                        } else if (productItem.status == "delivered") {
                            state = "COMMANDE LIVRÉ";
                            date = formatDate(productItem.updatedAt);
                        } else if (productItem.status == "checking"){
                            state = "COMMANDE EN EXAMINATION";
                            date = formatDate(productItem.updatedAt);
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

                        if (productItem.status == "checking") {
                            cartItemElement.querySelector(".state").style.backgroundColor = "hsl(var(--clr-red) / .5)"; // Changer la couleur de fond
                        }
                    
                        if (productItem.quantity == 1) {
                            cartItemElement.querySelector(".qty").style.visibility = "hidden";
                        } else {
                            cartItemElement.querySelector(".qty").style.visibility = "visible";
                        }
                    
                        if (isMobile()) {
                            console.log("Vous êtes sur un appareil mobile.");
                            cartItemElement.addEventListener('click', ()=>{
                                window.location.href = `detail.html?id=${item.orderId}`;
                            })
                        } else {
                            console.log("Vous êtes sur un ordinateur.");
                            const detail = cartItemElement.querySelector('.Add');
                            detail.addEventListener('click', ()=>{
                                window.location.href = `detail.html?id=${item.orderId}`;
                            })
                        }
                    
                        cartItemsList.appendChild(cartItemElement);
                    }
                }
                
            }
            //document.getElementById('loading-spinner').style.display = 'none';
        }

        if (CancelledOrReturnedOrders && CancelledOrReturnedOrders.length > 0){
            emptyCartMessage.style.display = 'none'; // Masque le message de panier vide
            console.log(CancelledOrReturnedOrders);
            for (const item of CancelledOrReturnedOrders){
                
                const items = item.items;
                console.log(items);
                for(const productItem of items){
                    const productId = productItem.productId; // Récupérer l'ID du produit
                    const product = await getProductById(productId);
                    const cartItemElement = document.createElement('li');
                    cartItemElement.className = 'cart-item';
                    let state;
                    let date;
                    date = formatDate(productItem.updatedAt);

                    if (productItem.status == "cancelled") {
                        state = "ANNULÉE";
                    } else if (productItem.status == "returned") {
                        state = "RETOURNÉE";
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
                        console.log("Vous êtes sur un appareil mobile.");
                        cartItemElement.addEventListener('click', ()=>{
                            window.location.href = `detail.html?id=${item.orderId}`;
                        })
                    } else {
                        console.log("Vous êtes sur un ordinateur.");
                        const detail = cartItemElement.querySelector('.Add');
                        detail.addEventListener('click', ()=>{
                            window.location.href = `detail.html?id=${item.orderId}`;
                        })
                    }

                    cartItemsList1.appendChild(cartItemElement);
                }
                
            }
            //document.getElementById('loading-spinner').style.display = 'none';
        }

        //document.getElementById('loading-spinner').style.display = 'none';

    }

    await displayCartItems();
    
        
});

                