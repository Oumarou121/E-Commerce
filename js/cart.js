import { getCartItems, removeFromCart, getProductById, increaseQuantity, 
    decreaseQuantity, getTotalQuantityInCart, getNbrorder, getUserDataValue,
    updateAddressByIndex, deleteAddressByIndex, addOrder } from './firebase.js';

let total = 0;
// Fonction pour formater les prix
const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

// Met à jour le total du panier
const updateCartTotal = (cartTotalElement1 = null) => {
    total = 0;
    const cartTotalElement = document.getElementById('cartTotal');
    document.querySelectorAll('.cart-item').forEach(item => {
    const totalPriceElement = item.querySelector('.totalPrice');
    const totalPrice = parseFloat(totalPriceElement.textContent.replace(/\./g, '').replace(' FCFA', ''));
    total += totalPrice;
});
    if (cartTotalElement1 != null) {
        cartTotalElement1.textContent = `${formatPrice(total)} FCFA`; // Met à jour le total du panier
    }else{
        cartTotalElement.textContent = `${formatPrice(total)} FCFA`; // Met à jour le total du panier
    }

};


document.addEventListener('DOMContentLoaded', async () => {
    const cartItemsList = document.querySelector('.cart-items');
    const emptyCartMessage = document.getElementById('emptyCartMessage');
    const cartTotalElement = document.getElementById('cartTotal');

    // Fonction pour afficher les articles dans le panier
    const displayCartItems = async () => {
        //document.getElementById('loading-spinner').style.display = 'block';
        const cartItems = await getCartItems();

        let total = 0; // Pour calculer le total du panier
        // cartItemsList.innerHTML = '';  Vide la liste avant de la remplir

        if (cartItems && cartItems.length > 0) {
            emptyCartMessage.style.display = 'none'; // Masque le message de panier vide

            for (const item of cartItems) {
                const productId = item.id; // Récupérer l'ID du produit
                const product = await getProductById(productId);

                const cartItemElement = document.createElement('li');
                cartItemElement.className = 'cart-item';
                cartItemElement.setAttribute('data-unit-price', product.price);

                cartItemElement.innerHTML = `
                    <div class="image">
                        <img src="${product.images[0]}" alt="${product.name}">
                    </div>
                    <div class="name text-black fs-100">
                        ${product.name}
                    </div>
                    <div class="Price text-black">${formatPrice(product.price)} FCFA</div>
                    <div class="quantity">
                        <button class="btn minus" type="button" data-id="${productId}"> 
                            <i class="uil uil-minus"></i>
                        </button>
                        <input type="text" value="${item.qty}" class="qtyInput" readonly>
                        <button class="btn plus" type="button" data-id="${productId}"> 
                            <i class="uil uil-plus"></i>
                        </button>
                    </div>
                    <div class="totalPrice text-black">${formatPrice(item.qty * product.price)} FCFA</div>
                    <div class="delete text-red" data-id="${productId}">
                        <i class="uil uil-trash"></i>
                    </div>
                `;
                cartItemsList.appendChild(cartItemElement);

                total += item.qty * product.price; // Calcule le total
            }
        } else {
            emptyCartMessage.style.display = 'flex'; // Affiche le message de panier vide
        }

        cartTotalElement.textContent = `${formatPrice(total)} FCFA`; // Affiche le total
        //document.getElementById('loading-spinner').style.display = 'none';
    };

    // Gérer les événements de clic sur les boutons plus et moins
    cartItemsList.addEventListener('click', async (event) => {
        const qtyInput = event.target.closest('.cart-item').querySelector('.qtyInput');
        const currentQty = parseInt(qtyInput.value);

        if (event.target.closest('.btn.plus')) {
            const productId = event.target.closest('.btn.plus').dataset.id;
            
            // Met à jour la quantité affichée et le total de l'article
            qtyInput.value = currentQty + 1;
            updateTotalPrice(event.target.closest('.cart-item')); // Met à jour le prix total de cet article

            await increaseQuantity(productId); // Appelle la fonction pour augmenter la quantité            
            await getTotalQuantityInCart();
        }

        if (event.target.closest('.btn.minus')) {
            const productId = event.target.closest('.btn.minus').dataset.id;
            if (currentQty > 1) {

                // Met à jour la quantité affichée et le total de l'article
                qtyInput.value = currentQty - 1;
                updateTotalPrice(event.target.closest('.cart-item')); // Met à jour le prix total de cet article

                await decreaseQuantity(productId); // Appelle la fonction pour diminuer la quantité
                await getTotalQuantityInCart();

            } else {
                await removeFromCart(productId); // Supprime l'article si la quantité atteint 0
                displayCartItems(); // Rafraîchit l'affichage du panier
            }
        }

        if (event.target.closest('.delete')) {
            const productId = event.target.closest('.delete').dataset.id;
            await removeFromCart(productId); // Retire l'article du panier
            displayCartItems(); // Rafraîchit l'affichage du panier
            await getTotalQuantityInCart();
        }
    });

    // Met à jour le prix total de l'article
    const updateTotalPrice = (cartItemElement) => {
        const qtyInput = cartItemElement.querySelector('.qtyInput');
        const price = parseFloat(cartItemElement.getAttribute('data-unit-price'));
        const totalPriceElement = cartItemElement.querySelector('.totalPrice');

        const totalPrice = qtyInput.value * price; // Calcule le nouveau total de cet article
        totalPriceElement.textContent = `${formatPrice(totalPrice)} FCFA`; // Met à jour le prix total affiché
        updateCartTotal(); // Met à jour le total du panier
    };

    
    // Affiche les articles au chargement de la page
    await displayCartItems();
});

await getTotalQuantityInCart();

document.getElementById('exit').addEventListener('click', () => {
    history.back();
})

document.getElementById('Commander').addEventListener('click', () => {
    openCustomAlert();
})


// Fonction pour ouvrir l'alerte et désactiver les interactions
function openCustomAlert() {
    displayOrder();
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

const currentDate = new Date();

// Tableau des mois
const months = [
    "Jan", "Fév", "Mar", "Avr", "Mai", "Jui",
    "Juil", "Aoû", "Sep", "Oct", "Nov", "Déc"
];

// Obtenir le jour et le mois
const Dday = String(currentDate.getDate()).padStart(2, '0'); // Jour avec zéro devant
const Fday = String(currentDate.getDate() + 2).padStart(2, '0'); // Jour avec zéro devant
const month = months[currentDate.getMonth()]; // Récupérer le nom du mois

async function displayOrder(){
    //document.getElementById('loading-spinner').style.display = 'block';
    await getNbrorder();
    const cartItems = await getCartItems();
    const orderTotal =  document.querySelector('.orderTotal');
    const finalTotal =  document.querySelector('.finalTotal');
    const userName =  document.querySelector('.userName');
    const userAdresse =  document.querySelector('.userAdresse');
    const debut =  document.getElementById('debut');
    const fin =  document.getElementById('fin');
    updateCartTotal(orderTotal);
    finalTotal.textContent = `${formatPrice(total + 2000)} FCFA`;
    debut.textContent = `${Dday} ${month}`;
    fin.textContent = `${Fday} ${month}`;
    const userData = await getUserDataValue(); // Récupère les données utilisateur
    const addresses = userData.addresses;

    if (userData) {
        for (const [index, address] of addresses.entries()){
            if (address.select){
                userName.textContent = `${address.prenom} ${address.nom}`;
                userAdresse.textContent = `${address.adresse} ${address.adresse_sup}`;
            }
        }

        const cartItemsList = document.querySelector('.content-item');
        cartItemsList.innerHTML = "";
        if (cartItems && cartItems.length > 0){
            const taille = cartItems.length;
            for (const [index, item] of cartItems.entries()){
                const productId = item.id; // Récupérer l'ID du produit
                const product = await getProductById(productId);

                const cartItemElement = document.createElement('div');
                cartItemElement.className = 'item';

                cartItemElement.innerHTML = `
                <div class="item-title">
                    <h5>Expédition ${index + 1}/${taille}</h5>
                </div>
                <div class="item-content">
                    <div class="item-image">
                    <img src="${product.images[0]}" alt="${product.name}">
                    </div>
                    <div class="fs-50 item-text">
                        <p>${product.name}</p>
                        <p>Quantité : ${item.qty}</p>
                    </div>
                </div>
                `;
                cartItemsList.appendChild(cartItemElement);

            }
        }

    } else {
        console.log("Veillez-vous connecter");
    }

    try {
        const userData = await getUserDataValue(); // Récupère les adresses depuis Firestore
    } catch (error) {
        //document.getElementById('loading-spinner').style.display = 'none';
    } finally {
        //document.getElementById('loading-spinner').style.display = 'none';
    }
}

document.getElementById('adresse').addEventListener('click', () => {
    openCustomAlertAdresse();
})


// Fonction pour ouvrir l'alerte et désactiver les interactions
function openCustomAlertAdresse() {
    displayOrder();
    displayAddresses();
    const customAlert = document.getElementById('customAdresse');
    const customAlertA = document.getElementById('customAlert');
    const pageContent = document.getElementById('main');
    const body = document.body;

    customAlertA.style.display = 'none';
    customAlert.style.display = 'flex'; // Affiche l'alerte
    pageContent.classList.add('no-interaction'); // Désactive les interactions sur le reste de la page
    body.classList.add('no-scroll'); // Désactive le défilement


}

// Fonction pour fermer l'alerte et réactiver les interactions
function closeCustomAlertAdresse() {
    const customAlert = document.getElementById('customAdresse');
    const customAlertA = document.getElementById('customAlert');
    const pageContent = document.getElementById('main');
    const body = document.body;

    customAlert.style.display = 'none'; // Cache l'alerte
    customAlertA.style.display = 'flex'; // Cache l'alerte
    pageContent.classList.remove('no-interaction'); // Réactive les interactions sur la page
    body.classList.remove('no-scroll'); // Réactive le défilement
}

// Fermer l'alerte sans suppression lors du clic sur la croix
document.getElementById('closeAdresse').addEventListener('click', closeCustomAlertAdresse);

// Fonction pour récupérer les adresses et les afficher
async function displayAddresses() {
    //document.getElementById('loading-spinner').style.display = 'block';

    const adresseContentDiv = document.getElementById('alert-content'); // Conteneur où les adresses seront ajoutées

    // Supprimer uniquement les éléments contenant les adresses
    const existingAddresses = adresseContentDiv.querySelectorAll('.adresse');
    existingAddresses.forEach((element) => element.remove());

    try {
        const userData = await getUserDataValue(); // Récupère les adresses depuis Firestore
        const addresses = userData.addresses;

        if (addresses.length > 0) {
            addresses.forEach((address, index) => {
                const adresseDiv = document.createElement('div');
                adresseDiv.classList.add('adresse'); // Ajoute la classe 'methode'

                const ads = (address.adresse_sup == "") ? address.adresse : `${address.adresse} , ${address.adresse_sup}`;
                const phone = (address.phone1 == "" && address.phone2 == "") ? `........` :  (address.phone2 == "") ? `+227 ${address.phone1}` : `+227 ${address.phone1} / +227 ${address.phone2}`;
                const region = (address.region == "") ? `........` : `${address.region} , Niger` ;

                adresseDiv.innerHTML = `
                <div id="edit" class="title-content">
                    <div class="title-adresse">Adresse ${index + 1}</div>
                    <div class="iconss">
                        <i class="uil fs-200 text-green uil-edit" title="Edit"></i>
                        <i class="uil fs-200 text-red uil-trash-alt" title="Delete"></i>
                        <i class="uil fs-200 text-blue uil-exchange" title="Selectionner"></i>
                    </div>
                </div>
                <div>
                    <hr class="custom-hr1">
                </div>
                <div class="adresse-content1">
                    <div class="methode">
                        <h3 class="select">Adresse par défaut :</h3>
                        <p>${address.prenom} ${address.nom}</p>
                        <p>${ads}</p>
                        <p>${region}</p>
                        <p>${phone}</p>
                    </div>
                </div>
                `;

                const select = adresseDiv.querySelector(".select");
                const exchange = adresseDiv.querySelector(".uil-exchange");
                if (select) {
                    if (address.select) {
                        select.style.display = "block";
                        exchange.style.display = "none";
                    } else {
                        select.style.display = "none";
                    }
                }

                const editIcon = adresseDiv.querySelector('.uil-edit');
                editIcon.addEventListener('click', () => {
                    window.location.href = `edit.html?id=${index}`;
                });

                const deleteIcon = adresseDiv.querySelector('.uil-trash-alt');
                deleteIcon.addEventListener('click', () => {
                    openCustomAlertDelete(index); // Passe l'index de l'adresse à supprimer
                });

                exchange.addEventListener('click', async() => {
                    await changeCurrent(index);
                });

                // Ajouter chaque div à l'intérieur du conteneur adresse-content
                adresseContentDiv.appendChild(adresseDiv);
            });
        } else {
            adresseContentDiv.innerHTML += `<p>Aucune adresse trouvée</p>`; // Utilise "+=" pour ne pas effacer d'autres éléments
        }
    } catch (error) {
        console.error("Erreur lors de la récupération des adresses :", error);
    } finally {
        //document.getElementById('loading-spinner').style.display = 'none';
    }
}

async function changeCurrent(pageIndex) {
    //document.getElementById('loading-spinner').style.display = 'block';

    try {
        const userData = await getUserDataValue(); // Récupère les données utilisateur
        const addresses = userData.addresses;

        if (userData) {
            // Utiliser une boucle for...of pour gérer async/await dans la boucle
            for (const [index, address] of addresses.entries()) {
                if (index == pageIndex) {
                    console.log(`page : ${index}`);
                    const updatedData = {
                        prenom: address.prenom,
                        nom: address.nom,
                        phone1: address.phone1,
                        phone2: address.phone2,
                        adresse: address.adresse,
                        adresse_sup: address.adresse_sup,
                        region: address.region,
                        genre: address.genre,
                        select: true // Cette adresse devient l'adresse sélectionnée
                    };
                    await updateAddressByIndex(index, updatedData);
                } else if (address.select) {
                    console.log(`Désélectionner : ${index}`);
                    const updatedData1 = {
                        prenom: address.prenom,
                        nom: address.nom,
                        phone1: address.phone1,
                        phone2: address.phone2,
                        adresse: address.adresse,
                        adresse_sup: address.adresse_sup,
                        region: address.region,
                        genre: address.genre,
                        select: false // Désélectionner cette adresse
                    };
                    await updateAddressByIndex(index, updatedData1);
                }
            }
        }

    } catch (error) {
        console.error("Erreur lors de la mise à jour des adresses :", error);
    } finally {
        // Cacher le spinner après la fin de toutes les opérations ou en cas d'erreur
        displayAddresses(); // Actualise la liste des adresses après suppression
        //document.getElementById('loading-spinner').style.display = 'none';
    }
}

// Fonction pour ouvrir l'alerte et désactiver les interactions
function openCustomAlertDelete(index) {
    const customAlert = document.getElementById('customAlertDelete');
    const pageContent = document.getElementById('main');
    const body = document.body;

    customAlert.style.display = 'flex'; // Affiche l'alerte
    pageContent.classList.add('no-interaction'); // Désactive les interactions sur le reste de la page
    body.classList.add('no-scroll'); // Désactive le défilement

    // Attacher l'événement au bouton de confirmation avec l'index actuel
    document.getElementById('confirmBtnDelete').onclick = async () => {
        //document.getElementById('loading-spinner').style.display = 'flex';

        try {
            await deleteAddressByIndex(index); // Supprimer l'adresse à l'index spécifié
        } catch (error) {
            console.error("Erreur lors de la suppression de l'adresse :", error);
        } finally {
            closeCustomAlertDelete(); // Ferme l'alerte après suppression
            //document.getElementById('loading-spinner').style.display = 'none';
            displayAddresses(); // Actualise la liste des adresses après suppression
        }
    };
}

// Fonction pour fermer l'alerte et réactiver les interactions
function closeCustomAlertDelete() {
    const customAlert = document.getElementById('customAlertDelete');
    const pageContent = document.getElementById('main');
    const body = document.body;

    customAlert.style.display = 'none'; // Cache l'alerte
    pageContent.classList.remove('no-interaction'); // Réactive les interactions sur la page
    body.classList.remove('no-scroll'); // Réactive le défilement
}

// Fermer l'alerte sans suppression lors du clic sur la croix
document.getElementById('closeAlertDelete').addEventListener('click', closeCustomAlertDelete);

document.getElementById('add').addEventListener('click', ()=> {
    window.location.href = 'edit.html';
});

document.getElementById('confirmer').addEventListener('click', async () => {
    //document.getElementById('loading-spinner').style.display = 'block';
    const userData = await getUserDataValue(); // Récupère les données utilisateur
    const addresses = userData.addresses;
    let adresse;
    const cartItems = await getCartItems();
    let total = 0; // Initialiser le montant total

    if (userData) {
        // Récupérer l'adresse sélectionnée
        for (const address of addresses) {
            if (address.select) {
                adresse = address;
                break; // Sortir de la boucle une fois l'adresse trouvée
            }
        }

        // Vérifier les articles du panier
        if (cartItems && cartItems.length > 0) {
            for (const item of cartItems) {
                const productID = item.id; // Récupérer l'ID du produit
                const productQty = item.qty; // Récupérer la quantité du produit
                const product = await getProductById(productID);
                const productPrix = product.price;

                // Calculer le prix total pour cet article
                total += productPrix * productQty; // Ajouter le prix total de cet article au total global
            }
        }
    }

    // Créer l'objet orderData avec les informations de la commande
    total += 2000;
    // Récupère les données des articles du panier en attendant que toutes les promesses soient résolues
    const items = await Promise.all(cartItems.map(async item => {
        const product = await getProductById(item.id);
        return {
            productId: item.id, // ID du produit
            quantity: item.qty, // Quantité de ce produit
            price: product.price, // Prix unitaire du produit
            status: "pending", // Statut de la commande
            updatedAt: Date.now()
        };
    }));
    
    const orderData = {
        items: items, // Tableau d'objets représentant les articles commandés
        totalAmount: total, // Montant total de la commande
        shippingAddress: adresse || {}, // Adresse de livraison
        paymentMethod: "cash", // Méthode de paiement
        status: "pending" // Statut de la commande
    };
    
    


    console.log(orderData);

    // Appeler la fonction addOrder pour ajouter la commande
    try {
        if (adresse.adresse == "" || adresse.phone1 == "" || adresse.region == "") {
            //NADA   
        }else{
            const response = await addOrder(orderData);
        }        
    } catch (error) {
        console.error(error);
        // Gérer l'erreur (par exemple, afficher un message d'erreur)
    }finally{
        
        //document.getElementById('loading-spinner').style.display = 'none';
        if (adresse.adresse == "" || adresse.phone1 == "" || adresse.region == ""){
            showAlert1("Veuillez compléter votre adresse principale.");
        }else{
            closeCustomAlert();
            showAlert("Votre commande a été effectuée avec succès");   
        }
    }
    
});


// Fonction pour afficher l'alerte au centre de l'écran
function showAlert(message) {
    const alertBox = document.createElement('div');
    alertBox.classList.add('alert', 'show');
    alertBox.innerHTML = `
    <span class="text-black">${message}<a href="/commande.html"> Voir vos commandes.</a></span>
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