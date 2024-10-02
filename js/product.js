let qty = document.querySelector("#qtyInput");

function decrement(){
    if (qty.value <= 1) {
        qty.value = 1;
    } else {
        qty.value = parseInt(qty.value) - 1;
    }
}

function increment(){
    if (qty.value >= 10) {
        qty.value = 10;
    } else {
        qty.value = parseInt(qty.value) + 1;
    }
}

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


// Sélectionner toutes les vignettes
const thumbnails = document.querySelectorAll('.thumb-container img');

// Sélectionner l'image principale
const mainImage = document.getElementById('main-image');

// Ajouter un écouteur d'événement pour chaque vignette
thumbnails.forEach(thumb => {
    thumb.addEventListener('click', function() {
        // Récupérer la source de la vignette cliquée
        const newSrc = this.getAttribute('data-large');
        
        // Vérifier si l'image principale est déjà la même
        if (mainImage.getAttribute('src') === newSrc) {
            return; // Si c'est la même, ne rien faire
        }

        // Transition de fondu en sortie (fade-out)
        mainImage.style.transition = 'opacity 0.5s';
        mainImage.style.opacity = 0;

        // Changer l'image après la transition de fondu en sortie
        setTimeout(() => {
            mainImage.setAttribute('src', newSrc);
            
            // Transition de fondu en entrée (fade-in)
            mainImage.style.opacity = 1;
        }, 500); // Délai de 500ms pour laisser le temps au fade-out
    });
});


// Sélectionner les éléments pour le défilement
const scrollContainer = document.getElementById('webizoom');
const scrollLeft = document.getElementById('scroll-left');
const scrollRight = document.getElementById('scroll-right');

// Définit la largeur de défilement à chaque clic (vous pouvez ajuster la valeur)
const scrollAmount = 150;

// Ajouter un événement au clic pour la flèche gauche
scrollLeft.addEventListener('click', () => {
    scrollContainer.scrollBy({
        left: -scrollAmount, // Défiler vers la gauche
        behavior: 'smooth'   // Défilement fluide
    });
});

// Ajouter un événement au clic pour la flèche droite
scrollRight.addEventListener('click', () => {
    scrollContainer.scrollBy({
        left: scrollAmount,  // Défiler vers la droite
        behavior: 'smooth'   // Défilement fluide
    });
});