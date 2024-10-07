import { getCartItems, removeFromCart, getProductById, increaseQuantity, decreaseQuantity, getTotalQuantityInCart } from './firebase.js';

document.addEventListener('DOMContentLoaded', async () => {
    const cartItemsList = document.querySelector('.cart-items');
    const emptyCartMessage = document.getElementById('emptyCartMessage');
    const cartTotalElement = document.getElementById('cartTotal');

    // Fonction pour formater les prix
    const formatPrice = (price) => {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    };

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
        updateCartTotal(); // Met à jour le total du panier
    };

    // Met à jour le total du panier
    const updateCartTotal = () => {
        let total = 0;
        cartItemsList.querySelectorAll('.cart-item').forEach(item => {
            const totalPriceElement = item.querySelector('.totalPrice');
            const totalPrice = parseFloat(totalPriceElement.textContent.replace(/\./g, '').replace(' FCFA', ''));
            total += totalPrice;
        });
        cartTotalElement.textContent = `${formatPrice(total)} FCFA`; // Met à jour le total du panier
    };

    // Affiche les articles au chargement de la page
    await displayCartItems();
});

document.getElementById('exit').addEventListener('click', () => {
    window.location.href = 'index.html';
})

document.getElementById('Commander').addEventListener('click', () => {
    window.location.href = 'commander.html';
})

await getTotalQuantityInCart();