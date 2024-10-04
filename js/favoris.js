import { getFavorites, getProductById, removeFavorite, isInCart, removeFromCart, addToCart } from './firebase.js'; 

async function loadFavorites() {
    document.getElementById('loading-spinner').style.display = 'block';
    const favoritesListElement = document.getElementById('cart-items');
    const emptyCartMessage = document.getElementById('emptyCartMessage');

    // Récupérer les favoris de l'utilisateur connecté
    const favoritesIds = await getFavorites();

    console.log(favoritesIds);

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

                document.getElementById('loading-spinner').style.display = 'none';

                // Ajouter un événement pour supprimer le produit des favoris
                productElement.querySelector('.Delete').addEventListener('click', async () => {
                    await removeFavorite(product.id);  // Supprime le produit des favoris
                    productElement.remove();           // Supprime l'élément de la liste HTML
                    showAlert('Produit supprimé des favoris');

                    // Vérification si la liste des favoris est maintenant vide
                    const remainingItems = favoritesListElement.querySelectorAll('.cart-item');
                    if (remainingItems.length === 0) {
                        emptyCartMessage.style.display = 'flex'; // Afficher le message de panier vide
                    }
                });

                const cartIcon = productElement.querySelector('.add-to-cart');
                const isCart = await isInCart(product.id);
                            
                if (isCart) {
                    cartIcon.classList.add('in-cart');
                }
                
                cartIcon.addEventListener('click', async (event) => {
                    event.stopPropagation();
                
                    if (cartIcon.classList.contains('in-cart')) {
                        // Si le produit est déjà dans le panier, on le retire
                        await removeFromCart(product.id);
                        cartIcon.classList.remove('in-cart');
                        showAlert('Le produit a été retiré de votre panier!');
                    } else {
                        // Si le produit n'est pas dans le panier, on l'ajoute avec une quantité par défaut (1)
                        await addToCart(product.id, 1); // Quantité par défaut de 1
                        cartIcon.classList.add('in-cart');
                        showAlert('Le produit a été ajouté à votre panier!');
                    }
                });
            }
        }
    }
    document.getElementById('loading-spinner').style.display = 'none';
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

document.getElementById('exit').addEventListener('click', () => {
    window.location.href = 'index.html';
})