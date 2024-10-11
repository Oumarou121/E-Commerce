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


function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// // Affichez le contenu de l'onglet actif au chargement de la page
// document.getElementById('description').style.display = 'block';

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

function move(){
    window.location.href = 'detail.html';
}

function exit(){
    history.back();
}