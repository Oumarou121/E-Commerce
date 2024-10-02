// Fonction pour incrémenter la quantité
function increment(button) {
    let cartItem = button.closest('.cart-item');
    let qtyInput = cartItem.querySelector('.qtyInput');
    let quantity = parseInt(qtyInput.value);
    
    if (quantity < 10) {  // Limite de 10
        quantity++;
        qtyInput.value = quantity;
        updateTotalPrice(cartItem, quantity);
    }
}

// Fonction pour décrémenter la quantité
function decrement(button) {
    let cartItem = button.closest('.cart-item');
    let qtyInput = cartItem.querySelector('.qtyInput');
    let quantity = parseInt(qtyInput.value);
    
    if (quantity > 1) {  // Limite minimale de 1
        quantity--;
        qtyInput.value = quantity;
        updateTotalPrice(cartItem, quantity);
    }
}

// Fonction pour mettre à jour le prix total d'un article
function updateTotalPrice(cartItem, quantity) {
    let unitPrice = parseFloat(cartItem.getAttribute('data-unit-price'));  // Récupérer le prix unitaire
    let totalPriceElement = cartItem.querySelector('.totalPrice');
    let totalPrice = unitPrice * quantity;
    
    // Afficher le total avec formatage 'FCFA'
    totalPriceElement.innerText = totalPrice.toLocaleString() + ' FCFA';
    
    // Mettre à jour le total global du panier
    updateCartTotal();
}

// Fonction pour mettre à jour le total global du panier
function updateCartTotal() {
    let cartItems = document.querySelectorAll('.cart-item');
    let total = 0;

    // Parcourir chaque article du panier et ajouter le prix total
    cartItems.forEach(item => {
        let unitPrice = parseFloat(item.getAttribute('data-unit-price'));
        let quantity = parseInt(item.querySelector('.qtyInput').value);
        total += unitPrice * quantity;
    });

    // Afficher le total global formaté
    let cartTotalElement = document.getElementById('cartTotal');
    cartTotalElement.innerText = total.toLocaleString() + ' FCFA';
}

// Fonction pour supprimer un article du panier
function deleteItem(button) {
    let cartItem = button.closest('.cart-item');  // Trouver l'article parent
    cartItem.remove();  // Supprimer l'élément du DOM

    // Vérifier si le panier est vide après la suppression
    checkIfCartIsEmpty();

    // Mettre à jour le total global après la suppression
    updateCartTotal();
}

// Fonction pour vérifier si le panier est vide
function checkIfCartIsEmpty() {
    let cartItems = document.querySelectorAll('.cart-item');
    let emptyCartMessage = document.getElementById('emptyCartMessage');
    
    if (cartItems.length === 0) {
        // Si le panier est vide, afficher le message "Cart Is Empty"
        emptyCartMessage.style.display = 'flex';
    } else {
        // Si le panier contient des articles, masquer le message "Cart Is Empty"
        emptyCartMessage.style.display = 'none';
    }
}

// Mettre à jour le total au chargement de la page et vérifier si le panier est vide
window.onload = function() {
    updateCartTotal();
    checkIfCartIsEmpty();
};