// // Fonction pour supprimer un article du panier
// function deleteItem(button) {
//     let cartItem = button.closest('.cart-item');  // Trouver l'article parent
//     cartItem.remove();  // Supprimer l'élément du DOM

//     // Vérifier si le panier est vide après la suppression
//     checkIfCartIsEmpty();

//     // Mettre à jour le total global après la suppression
//     updateCartTotal();
// }

// // Fonction pour vérifier si le panier est vide
// function checkIfCartIsEmpty() {
//     let cartItems = document.querySelectorAll('.cart-item');
//     let emptyCartMessage = document.getElementById('emptyCartMessage');
    
//     if (cartItems.length === 0) {
//         // Si le panier est vide, afficher le message "Cart Is Empty"
//         emptyCartMessage.style.display = 'flex';
//     } else {
//         // Si le panier contient des articles, masquer le message "Cart Is Empty"
//         emptyCartMessage.style.display = 'none';
//     }
// }

// // Mettre à jour le total au chargement de la page et vérifier si le panier est vide
// window.onload = function() {
//     checkIfCartIsEmpty();
// };

import { getFavorites, getProductById, removeFavorite, isInCart, removeFromCart, addToCart } from './firebase.js'; 

async function loadFavorites() {
    const favoritesListElement = document.getElementById('cart-items');
    const emptyCartMessage = document.getElementById('emptyCartMessage');

    // Récupérer les favoris de l'utilisateur connecté
    const favoritesIds = await getFavorites();

    console.log(favoritesIds);
    // Vider le conteneur avant d'ajouter les produits
    // favoritesListElement.innerHTML = '';

    if (favoritesIds.length === 0) {
        // Afficher le message de panier vide
        emptyCartMessage.style.display = 'flex';
    } else {
        emptyCartMessage.style.display = 'none';

        // Pour chaque ID de produit favori, récupérer et afficher ses détails
        for (let productId of favoritesIds) {
            const product = await getProductById(productId); // Récupérer les détails du produit
            console.log(product);
            if (product) {
                const productElement = document.createElement('li');
                productElement.classList.add('cart-item');
                productElement.dataset.unitPrice = product.price; // Utilisé pour des calculs éventuels

                productElement.innerHTML = `
                    <div class="image">
                        <img src="${product.images[0]}" alt="${product.name}">
                    </div>
                    <div class="div-name">
                        <div class="name text-black fs-100">
                            ${product.name}
                        </div>
                        <div></div>
                        <div class="Price text-black">${product.price.toLocaleString()} FCFA</div>
                    </div>
                    <div class="div-btn">
                        <div class="Add add-to-cart text-black">
                            <i class="uil uil-shopping-cart-alt"></i>
                            Ajouter
                        </div>
                        <div class="Delete text-red" data-id="${product.id}">
                            <i class="uil uil-trash"></i>
                            SUPPRIMER
                        </div>
                    </div>
                `;

                // Ajouter l'élément au DOM
                favoritesListElement.appendChild(productElement);

                // Ajouter un événement pour supprimer le produit des favoris
                productElement.querySelector('.Delete').addEventListener('click', async () => {
                    await removeFavorite(product.id);  // Supprime le produit des favoris
                    productElement.remove();           // Supprime l'élément de la liste HTML
                    showAlert('Produit supprimé des favoris');
                });

                const cartIcon = productElement.querySelector('.add-to-cart');
                const isCart = await isInCart(product.id);

                if (isCart) {
                    cartIcon.classList.add('in-cart');
                }

                cartIcon.addEventListener('click', async (event) => {
                    event.stopPropagation();

                    if (cartIcon.classList.contains('in-cart')) {
                        await removeFromCart(product.id);
                        cartIcon.classList.remove('in-cart');
                        showAlert('Le produit a été retiré à votre panier!');
                    } else {
                        await addToCart(product.id);
                        cartIcon.classList.add('in-cart');
                        showAlert('Le produit a été ajouté à votre panier!');
                    }
                });
            }
        }
    }
}

// Appel de la fonction pour charger les favoris
loadFavorites();

// Fonction pour afficher une alerte simple
function showAlert(message) {
    const alertBox = document.createElement('div');
    alertBox.classList.add('alert', 'show');
    alertBox.innerHTML = `
        <span class="text-black">${message}</span>
        <span class="close-btn">&times;</span>
    `;

    document.body.appendChild(alertBox);

    alertBox.querySelector('.close-btn').addEventListener('click', () => {
        alertBox.classList.add('hide');
    });

    setTimeout(() => {
        alertBox.classList.add('hide');
    }, 3000);

    setTimeout(() => {
        alertBox.remove();
    }, 3500);
}

