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