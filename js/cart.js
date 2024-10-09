import { getCartItems, removeFromCart, getProductById, increaseQuantity, 
    decreaseQuantity, getTotalQuantityInCart, getNbrorder, getUserDataValue } from './firebase.js';

let total = 0;
// Fonction pour formater les prix
const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

// Met à jour le total du panier
const updateCartTotal = (cartTotalElement) => {
    document.querySelectorAll('.cart-item').forEach(item => {
    const totalPriceElement = item.querySelector('.totalPrice');
    const totalPrice = parseFloat(totalPriceElement.textContent.replace(/\./g, '').replace(' FCFA', ''));
    total += totalPrice;
    console.log(total)
});
cartTotalElement.textContent = `${formatPrice(total)} FCFA`; // Met à jour le total du panier
};


document.addEventListener('DOMContentLoaded', async () => {
    const cartItemsList = document.querySelector('.cart-items');
    const emptyCartMessage = document.getElementById('emptyCartMessage');
    const cartTotalElement = document.getElementById('cartTotal');

    // Fonction pour afficher les articles dans le panier
    const displayCartItems = async () => {
        document.getElementById('loading-spinner').style.display = 'block';
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
        document.getElementById('loading-spinner').style.display = 'none';
    };

    // Gérer les événements de clic sur les boutons plus et moins
    cartItemsList.addEventListener('click', async (event) => {
        const qtyInput = event.target.closest('.cart-item').querySelector('.qtyInput');
        const currentQty = parseInt(qtyInput.value);

        if (event.target.closest('.btn.plus')) {
            const productId = event.target.closest('.btn.plus').dataset.id;
            
            // Met à jour la quantité affichée et le total de l'article
            qtyInput.value = currentQty + 1;
            updateTotalPrice(event.target.closest('.cart-item'), productId); // Met à jour le prix total de cet article

            await increaseQuantity(productId); // Appelle la fonction pour augmenter la quantité            
            await getTotalQuantityInCart();
        }

        if (event.target.closest('.btn.minus')) {
            const productId = event.target.closest('.btn.minus').dataset.id;
            if (currentQty > 1) {

                // Met à jour la quantité affichée et le total de l'article
                qtyInput.value = currentQty - 1;
                updateTotalPrice(event.target.closest('.cart-item'), productId); // Met à jour le prix total de cet article

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
    const updateTotalPrice = (cartItemElement, productId) => {
        const qtyInput = cartItemElement.querySelector('.qtyInput');
        const price = parseFloat(cartItemElement.getAttribute('data-unit-price'));
        const totalPriceElement = cartItemElement.querySelector('.totalPrice');

        const totalPrice = qtyInput.value * price; // Calcule le nouveau total de cet article
        totalPriceElement.textContent = `${formatPrice(totalPrice)} FCFA`; // Met à jour le prix total affiché
        updateCartTotal(cartItemElement); // Met à jour le total du panier
    };

    
    // Affiche les articles au chargement de la page
    await displayCartItems();
});

document.getElementById('exit').addEventListener('click', () => {
    window.location.href = 'index.html';
})

document.getElementById('Commander').addEventListener('click', () => {
    openCustomAlert();
})

await getTotalQuantityInCart();

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

async function displayOrder(){
    document.getElementById('loading-spinner').style.display = 'block';
    await getNbrorder();
    const orderTotal =  document.querySelector('.orderTotal');
    const finalTotal =  document.querySelector('.finalTotal');
    const userName =  document.querySelector('.userName');
    const userAdresse =  document.querySelector('.userAdresse');
    updateCartTotal(orderTotal);
    finalTotal.textContent = `${formatPrice(total + 2000)} FCFA`;
    const userData = await getUserDataValue(); // Récupère les données utilisateur
    const addresses = userData.addresses;

    if (userData) {
        for (const [index, address] of addresses.entries()){
            if (address.select){
                userName.textContent = `${address.prenom} ${address.nom}`;
                userAdresse.textContent = `${address.adresse} ${address.adresse_sup}`;
            }
        }
    } else {
        console.log("Veillez-vous connecter");
    }

    try {
        const userData = await getUserDataValue(); // Récupère les adresses depuis Firestore
    } catch (error) {
        document.getElementById('loading-spinner').style.display = 'none';
    } finally {
        document.getElementById('loading-spinner').style.display = 'none';
    }
}

